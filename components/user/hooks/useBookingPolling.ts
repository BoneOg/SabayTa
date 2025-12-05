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

        const pollDriverLocation = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`);
                if (!response.ok) return;

                const data = await response.json();

                // Update driver location and route
                if (data.booking && data.booking.driverLocation) {
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

            } catch (error) {
                console.error("Error polling driver location:", error);
            }
        }, 11000); // Poll every 11 seconds

        return () => clearInterval(pollDriverLocation);
    }, [bookingId, bookingAccepted, fromLocation]);
};
