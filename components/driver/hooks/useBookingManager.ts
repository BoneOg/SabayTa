import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Alert } from "react-native";
import { BASE_URL } from "../../../config";

export interface User {
    id: string;
    name: string;
    pickup: string;
    destination: string;
    date: string;
    time: string;
    distance: string;
    estimatedTime: string;
    pickupCoords?: { latitude: number; longitude: number };
    destinationCoords?: { latitude: number; longitude: number };
    riderLocation?: { latitude: number; longitude: number };
    riderId?: string;
    profileImage?: string;
}

export const useBookingManager = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/bookings/pending`);
            const data = await response.json();

            if (response.ok) {
                const mappedUsers = data.map((booking: any) => ({
                    id: booking._id,
                    name: booking.userId?.name || "Unknown User",
                    pickup: booking.pickupLocation.name,
                    destination: booking.dropoffLocation.name,
                    date: new Date(booking.createdAt).toLocaleDateString(),
                    time: new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    distance: booking.distance,
                    estimatedTime: booking.estimatedTime,
                    pickupCoords: {
                        latitude: booking.pickupLocation.lat,
                        longitude: booking.pickupLocation.lon
                    },
                    destinationCoords: {
                        latitude: booking.dropoffLocation.lat,
                        longitude: booking.dropoffLocation.lon
                    },
                    riderLocation: booking.userId?.currentLocation ? {
                        latitude: booking.userId.currentLocation.lat,
                        longitude: booking.userId.currentLocation.lon
                    } : undefined,
                    riderId: booking.userId?._id,
                    profileImage: booking.userId?.profileImage
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const acceptBooking = async (
        userId: string,
        driverLocation: { latitude: number; longitude: number }
    ) => {
        try {
            console.log("📤 Booking ID:", userId);
            console.log("📤 Driver Location:", driverLocation);

            // Get current driver's ID from storage
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) {
                Alert.alert("Error", "Driver session not found");
                return false;
            }
            const user = JSON.parse(userStr);
            const driverId = user._id || user.id;

            if (!driverId) {
                Alert.alert("Error", "Invalid driver session");
                return false;
            }

            const response = await fetch(`${BASE_URL}/api/bookings/${userId}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    driverId: driverId,
                    driverLocation: driverLocation,
                    acceptedAt: new Date().toISOString()
                })
            });

            console.log("📥 Response status:", response.status);
            const data = await response.json();
            console.log("📥 Accept response:", data);

            if (response.ok) {
                Alert.alert("Success", `Booking accepted!`);
                await fetchBookings(); // Refresh bookings
                return true;
            } else {
                Alert.alert("Error", data.message || "Failed to accept booking");
                return false;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to accept booking. Please try again.";
            console.error("Error accepting booking:", errorMessage);
            Alert.alert("Error", errorMessage);
            return false;
        }
    };

    return {
        users,
        selectedUser,
        setSelectedUser,
        fetchBookings,
        acceptBooking,
    };
};
