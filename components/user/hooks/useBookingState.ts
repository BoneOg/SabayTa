import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

export interface SelectedLocation {
    lat: number;
    lon: number;
    name: string;
}

export interface BookingState {
    bookingId: string | null;
    bookingAccepted: boolean;
    driverSearchVisible: boolean;
    driverArrivalVisible: boolean;
    showDriverDetails: boolean;
    showChat: boolean;
    fromLocation: SelectedLocation | null;
    toLocation: SelectedLocation | null;
    fromText: string;
    toText: string;
}

export const useBookingState = () => {
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [bookingAccepted, setBookingAccepted] = useState(false);
    const [driverSearchVisible, setDriverSearchVisible] = useState(false);
    const [driverArrivalVisible, setDriverArrivalVisible] = useState(false);
    const [showDriverDetails, setShowDriverDetails] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(null);
    const [toLocation, setToLocation] = useState<SelectedLocation | null>(null);
    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [passengerPickedUp, setPassengerPickedUp] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [driverId, setDriverId] = useState<string | null>(null); // Added driverId
    const isInitialized = useRef(false);

    // Restore active booking on mount
    useEffect(() => {
        const restoreActiveBooking = async () => {
            try {
                // Get current user first
                const userStr = await AsyncStorage.getItem('user');
                if (!userStr) {
                    isInitialized.current = true;
                    return;
                }

                const user = JSON.parse(userStr);
                setUserId(user._id);
                const storageKey = `activeBooking_${user._id}`;

                const activeBookingStr = await AsyncStorage.getItem(storageKey);
                if (activeBookingStr) {
                    const activeBooking = JSON.parse(activeBookingStr);
                    console.log('📦 Restoring active booking for user:', user._id, activeBooking);

                    setBookingId(activeBooking.bookingId);
                    setBookingAccepted(activeBooking.bookingAccepted || false);

                    if (activeBooking.fromLocation) setFromLocation(activeBooking.fromLocation);
                    if (activeBooking.toLocation) setToLocation(activeBooking.toLocation);
                    if (activeBooking.fromText) setFromText(activeBooking.fromText);
                    if (activeBooking.toText) setToText(activeBooking.toText);

                    if (activeBooking.bookingAccepted) {
                        setDriverArrivalVisible(true);
                    } else if (activeBooking.driverSearchVisible) {
                        setDriverSearchVisible(true);
                    }
                }
            } catch (error) {
                console.error('Error restoring booking:', error);
            } finally {
                isInitialized.current = true;
            }
        };

        restoreActiveBooking();
    }, []);

    // Save booking state to AsyncStorage for persistence
    useEffect(() => {
        const saveBookingState = async () => {
            if (!isInitialized.current || !userId) return;

            const storageKey = `activeBooking_${userId}`;

            if (bookingId) {
                const bookingState = {
                    bookingId,
                    bookingAccepted,
                    driverSearchVisible,
                    fromLocation,
                    toLocation,
                    fromText,
                    toText,
                };
                await AsyncStorage.setItem(storageKey, JSON.stringify(bookingState));
                console.log('💾 Saved booking state for user:', userId);
            } else {
                // Clear saved booking if no active booking
                await AsyncStorage.removeItem(storageKey);
            }
        };

        saveBookingState();
    }, [bookingId, bookingAccepted, driverSearchVisible, fromLocation, toLocation, fromText, toText, userId]);

    const resetBookingState = async () => {
        setBookingId(null);
        setBookingAccepted(false);
        setDriverSearchVisible(false);
        setDriverArrivalVisible(false);
        setShowDriverDetails(false);
        setShowChat(false);

        if (userId) {
            await AsyncStorage.removeItem(`activeBooking_${userId}`);
        }
    };

    return {
        bookingId,
        setBookingId,
        bookingAccepted,
        setBookingAccepted,
        driverSearchVisible,
        setDriverSearchVisible,
        driverArrivalVisible,
        setDriverArrivalVisible,
        showDriverDetails,
        setShowDriverDetails,
        showChat,
        setShowChat,
        fromLocation,
        setFromLocation,
        toLocation,
        setToLocation,
        fromText,
        setFromText,
        toText,
        setToText,
        passengerPickedUp,
        setPassengerPickedUp,
        driverId,
        setDriverId,
        userId, // Expose userId too
        resetBookingState,
    };
};
