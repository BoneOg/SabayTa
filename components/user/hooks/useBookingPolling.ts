import { useEffect } from 'react';
import { Alert } from 'react-native';
import MapView from 'react-native-maps';
import { BASE_URL } from '../../../config.js';
import { SelectedLocation } from './useBookingState';

interface UseBookingPollingProps {
    bookingId: string | null;
    driverSearchVisible: boolean;
    bookingAccepted: boolean;
    fromLocation: SelectedLocation | null;
    params: any;
    setDriverSearchVisible: (visible: boolean) => void;
    setDriverArrivalVisible: (visible: boolean) => void;
    setBookingAccepted: (accepted: boolean) => void;
    setFromLocation: (location: SelectedLocation | null) => void;
    setToLocation: (location: SelectedLocation | null) => void;
    setRouteCoords: (coords: { latitude: number; longitude: number }[]) => void;
    setTripDetails: (details: { distance: string; duration: string } | null) => void;
    onDriverLocationChange?: (location: { latitude: number; longitude: number } | null) => void;
    onDriverRouteChange?: (show: boolean) => void;
    onRouteChange?: (coords: { latitude: number; longitude: number }[]) => void;
    fetchRoute: (
        from: SelectedLocation,
        to: SelectedLocation,
        setRouteCoords: (coords: { latitude: number; longitude: number }[]) => void,
        setTripDetails: (details: { distance: string; duration: string } | null) => void,
        mapRef: React.RefObject<MapView>
    ) => void;
    mapRef: React.RefObject<MapView>;
    setPassengerPickedUp: (pickedUp: boolean) => void;
    setBookingCompleted?: (completed: boolean) => void;
    setDriverName?: (name: string) => void;
    resetBookingState: () => Promise<void>;
}

export const useBookingPolling = ({
    bookingId,
    driverSearchVisible,
    bookingAccepted,
    fromLocation,
    params,
    setDriverSearchVisible,
    setDriverArrivalVisible,
    setBookingAccepted,
    setFromLocation,
    setToLocation,
    setRouteCoords,
    setTripDetails,
    onDriverLocationChange,
    onDriverRouteChange,
    onRouteChange,
    fetchRoute,
    mapRef,
    setPassengerPickedUp,
    setBookingCompleted,
    setDriverName,
    resetBookingState,
}: UseBookingPollingProps) => {
    // Poll for booking status updates - driver acceptance
    useEffect(() => {
        if (!bookingId || !driverSearchVisible) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`);

                if (!response.ok) {
                    console.warn("Booking status response not ok:", response.status);
                    return;
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    console.warn("Response is not JSON:", contentType);
                    return;
                }

                const data = await response.json();
                console.log("📱 Booking status:", data);

                if (data.booking && data.booking.status === 'accepted') {
                    console.log('✅ Driver accepted booking!');
                    setDriverSearchVisible(false);
                    setDriverArrivalVisible(true);
                    setBookingAccepted(true);

                    // Restore fromLocation and toLocation from params for map markers
                    const fromLat = parseFloat(params.fromLat as string);
                    const fromLon = parseFloat(params.fromLon as string);
                    const toLat = parseFloat(params.toLat as string);
                    const toLon = parseFloat(params.toLon as string);

                    if (fromLat && fromLon && params.fromName) {
                        setFromLocation({
                            lat: fromLat,
                            lon: fromLon,
                            name: params.fromName as string
                        });
                    }

                    if (toLat && toLon && params.toName) {
                        setToLocation({
                            lat: toLat,
                            lon: toLon,
                            name: params.toName as string
                        });
                    }

                    if (data.booking.driverId && data.booking.driverId.name) {
                        console.log("👤 Driver Name:", data.booking.driverId.name);
                        if (setDriverName) setDriverName(data.booking.driverId.name);
                    }

                    // Start tracking driver location and show route
                    if (onDriverRouteChange) {
                        onDriverRouteChange(true);
                    }

                    // Clear old route immediately so it doesn't show up as the driver route
                    if (onRouteChange) {
                        onRouteChange([]);
                    }
                    setRouteCoords([]);

                    console.log("🔄 Cleared old route, preparing to fetch driver route");

                    // Immediate fetch of driver location to update route
                    try {
                        const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`);
                        const data = await response.json();
                        if (data.booking && data.booking.driverLocation) {
                            const driverLoc = {
                                latitude: data.booking.driverLocation.latitude || data.booking.driverLocation.lat,
                                longitude: data.booking.driverLocation.longitude || data.booking.driverLocation.lon
                            };
                            console.log("📍 Driver location fetched:", driverLoc);
                            if (onDriverLocationChange) onDriverLocationChange(driverLoc);

                            // Use the fromLat/fromLon we just parsed above
                            if (fromLat && fromLon) {
                                console.log("📍 Initial driver route: Driver → Pickup");
                                console.log("   Driver:", driverLoc);
                                console.log("   Pickup:", { lat: fromLat, lon: fromLon });

                                const driverLocation = { lat: driverLoc.latitude, lon: driverLoc.longitude, name: "Driver" };
                                const pickupLocation = { lat: fromLat, lon: fromLon, name: "Pickup" };
                                fetchRoute(driverLocation, pickupLocation, setRouteCoords, setTripDetails, mapRef);
                            } else {
                                console.warn("⚠️ No pickup coordinates available for initial route");
                            }
                        } else {
                            console.warn("⚠️ No driver location in booking data");
                        }
                    } catch (e) {
                        console.error("Initial driver fetch failed", e);
                    }

                    clearInterval(pollInterval);
                }
            } catch (error) {
                console.error("Error polling booking status:", error);
            }
        }, 1000); // Poll every second

        return () => clearInterval(pollInterval);
    }, [bookingId, driverSearchVisible]);

    // Poll for driver location updates when booking is accepted
    useEffect(() => {
        if (!bookingId || !bookingAccepted) return;

        let passengerPickedUpFlag = false; // Track if we've already processed pickup

        const pollDriverLocation = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`);
                if (!response.ok) return;

                const data = await response.json();

                // Check if passenger was picked up
                if (data.booking && data.booking.passengerPickedUp && !passengerPickedUpFlag) {
                    console.log("✅ [USER] Passenger picked up detected! Updating route to pickup → dropoff");
                    passengerPickedUpFlag = true;

                    // Fetch route from pickup to dropoff
                    if (fromLocation && data.booking.dropoffLocation) {
                        const dropoffLocation = {
                            lat: data.booking.dropoffLocation.lat,
                            lon: data.booking.dropoffLocation.lon,
                            name: data.booking.dropoffLocation.name || "Destination"
                        };

                        console.log("🗺️ [USER] Fetching route from pickup to dropoff");
                        console.log("   Pickup:", fromLocation);
                        console.log("   Dropoff:", dropoffLocation);

                        fetchRoute(fromLocation, dropoffLocation, setRouteCoords, setTripDetails, mapRef);
                        setPassengerPickedUp(true); // Update state for UI
                    }
                }

                // Update driver location and route (only if passenger not picked up yet)
                if (data.booking && data.booking.driverLocation && !passengerPickedUpFlag) {
                    const driverLoc = {
                        latitude: data.booking.driverLocation.latitude || data.booking.driverLocation.lat,
                        longitude: data.booking.driverLocation.longitude || data.booking.driverLocation.lon
                    };

                    if (onDriverLocationChange) onDriverLocationChange(driverLoc);

                    // Update route if we have pickup location
                    if (fromLocation) {
                        const driverLocation = { lat: driverLoc.latitude, lon: driverLoc.longitude, name: "Driver" };
                        fetchRoute(driverLocation, fromLocation, setRouteCoords, setTripDetails, mapRef);
                    }
                }

                // Check if driver cancelled the booking
                if (data.booking && data.booking.status === 'cancelled') {
                    console.log('❌ Driver cancelled the booking');
                    clearInterval(pollDriverLocation);

                    // Clear booking state
                    await resetBookingState();

                    // Notify parent to hide driver route
                    if (onDriverRouteChange) onDriverRouteChange(false);
                    if (onDriverLocationChange) onDriverLocationChange(null);

                    Alert.alert(
                        "Booking Cancelled",
                        "The driver has cancelled your booking. Please try again.",
                        [{ text: "OK" }]
                    );
                    return;
                }

                // Check if booking is completed
                if (data.booking && data.booking.status === 'completed') {
                    console.log('✅ Trip completed!');
                    clearInterval(pollDriverLocation);

                    if (setBookingCompleted) {
                        setBookingCompleted(true);
                    }

                    // Do NOT reset booking state immediately here, 
                    // we want to show the "Arrived at destination" popup first.
                    // The reset will happen after rating or closing the final popup.
                }

            } catch (error) {
                console.error("Error polling driver location:", error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(pollDriverLocation);
    }, [bookingId, bookingAccepted, fromLocation]);
};
