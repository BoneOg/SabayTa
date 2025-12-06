import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { BASE_URL } from '../../../config.js';

export const useBookingActions = (
    bookingId: string | null,
    setBookingId: (id: string | null) => void,
    setDriverSearchVisible: (visible: boolean) => void,
    setDriverArrivalVisible: (visible: boolean) => void,
    setBookingAccepted: (accepted: boolean) => void,
    resetBookingState: () => Promise<void>,
    onDriverRouteChange?: (show: boolean) => void,
    onDriverLocationChange?: (location: { latitude: number; longitude: number } | null) => void
) => {
    const router = useRouter();

    const handleCreateBooking = async (params: any) => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) {
                Alert.alert("Error", "User not found. Please login again.");
                setDriverSearchVisible(false);
                return;
            }
            const user = JSON.parse(userStr);

            const bookingData = {
                userId: user._id,
                pickupLocation: {
                    lat: parseFloat(params.fromLat as string),
                    lon: parseFloat(params.fromLon as string),
                    name: params.fromName as string
                },
                dropoffLocation: {
                    lat: parseFloat(params.toLat as string),
                    lon: parseFloat(params.toLon as string),
                    name: params.toName as string
                },
                distance: params.distance,
                estimatedTime: params.time
            };

            const response = await fetch(`${BASE_URL}/api/bookings/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();

            if (response.ok) {
                setBookingId(data.booking._id);
            } else {
                Alert.alert("Error", data.message || "Failed to create booking");
                setDriverSearchVisible(false);
            }
        } catch (error) {
            console.error("Booking error:", error);
            Alert.alert("Error", "Network error. Please try again.");
            setDriverSearchVisible(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!bookingId) {
            setDriverSearchVisible(false);
            router.setParams({ action: '' });
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cancelledBy: 'user' })
            });

            if (response.ok) {
                // Reset all booking state
                await resetBookingState();

                // Notify parent to hide driver route and location
                if (onDriverRouteChange) onDriverRouteChange(false);
                if (onDriverLocationChange) onDriverLocationChange(null);

                Alert.alert("Cancelled", "Your booking has been cancelled.");
                router.setParams({ action: '' });
            } else {
                const data = await response.json();
                Alert.alert("Error", data.message || "Failed to cancel booking.");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            Alert.alert("Error", "Network error.");
        }
    };

    return {
        handleCreateBooking,
        handleCancelBooking,
    };
};
