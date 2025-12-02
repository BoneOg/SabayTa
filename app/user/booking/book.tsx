import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, TextInput } from 'react-native';
import MapView from 'react-native-maps';
import { BASE_URL } from '../../../config';

// Custom Hooks & Components
import { useHomeAnimations } from '../../../components/animations/HomeAnimations';
import { DriverSearchLoading } from '../../../components/Loading';
import { LocationModals } from '../../../components/Location';
import { useLocationSearch } from '../../../components/LocationSearch';
import { PinSelectionUI } from '../../../components/PinSelectionUI';
import { useRouteCalculator } from '../../../components/RouteCalculator';
import { SearchBar } from '../../../components/SearchBar';

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

interface SelectedLocation {
    lat: number;
    lon: number;
    name: string;
}

interface BookingComponentProps {
    region: any;
    mapRef: React.RefObject<MapView>;
    selectingLocation: 'from' | 'to' | null;
    setSelectingLocation: (value: 'from' | 'to' | null) => void;
    draggedRegion: any;
    setDraggedRegion: (region: any) => void;
    onLocationChange?: (from: SelectedLocation | null, to: SelectedLocation | null) => void;
    onRouteChange?: (coords: { latitude: number; longitude: number }[]) => void;
}

export const BookingComponent = ({
    region,
    mapRef,
    selectingLocation,
    setSelectingLocation,
    draggedRegion,
    setDraggedRegion,
    onLocationChange,
    onRouteChange
}: BookingComponentProps) => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Custom Hooks
    const { slideAnim, pinSelectionAnim } = useHomeAnimations();
    const { debouncedFetchSuggestions, getAddressFromCoords } = useLocationSearch();
    const { fetchRoute } = useRouteCalculator();

    // Refs
    const searchInputRef = useRef<TextInput>(null);

    // State
    const [modalVisible, setModalVisible] = useState(false);
    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(null);
    const [toLocation, setToLocation] = useState<SelectedLocation | null>(null);
    const [isModalFull, setIsModalFull] = useState(false);
    const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
    const [tripDetails, setTripDetails] = useState<{ distance: string; duration: string } | null>(null);

    // Driver Search State
    const [driverSearchVisible, setDriverSearchVisible] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    // Search Modal State
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [activeSearchField, setActiveSearchField] = useState<'from' | 'to' | null>(null);
    const [searchText, setSearchText] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState<NominatimResult[]>([]);

    // Notify parent of location changes
    useEffect(() => {
        if (onLocationChange) {
            onLocationChange(fromLocation, toLocation);
        }
    }, [fromLocation, toLocation]);

    // Notify parent of route changes
    useEffect(() => {
        if (onRouteChange) {
            onRouteChange(routeCoords);
        }
    }, [routeCoords]);

    // ====================================================================
    // DRIVER SEARCH & BOOKING LOGIC
    // ====================================================================
    useEffect(() => {
        if (params.action === 'search_driver') {
            setDriverSearchVisible(true);
            handleCreateBooking();
        }
    }, [params.action]);

    const handleCreateBooking = async () => {
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
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setDriverSearchVisible(false);
                setBookingId(null);
                Alert.alert("Cancelled", "Your booking has been cancelled.");
                router.setParams({ action: '' });
            } else {
                Alert.alert("Error", "Failed to cancel booking.");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            Alert.alert("Error", "Network error.");
        }
    };

    // ====================================================================
    // LOCATION SEARCH HANDLERS
    // ====================================================================
    const openSearchModal = (type: 'from' | 'to') => {
        setActiveSearchField(type);
        setSearchText(type === 'from' ? fromText : toText);
        setSearchSuggestions([]);
        setSearchModalVisible(true);
    };

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);
        debouncedFetchSuggestions(text, setSearchSuggestions);
    };

    const clearSearchText = () => {
        setSearchText('');
        setSearchSuggestions([]);
        searchInputRef.current?.focus();
    };

    const selectLocationFromSearch = (item: NominatimResult) => {
        const selected = {
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            name: item.display_name,
        };

        if (activeSearchField === 'from') {
            setFromLocation(selected);
            setFromText(item.display_name);
        } else {
            setToLocation(selected);
            setToText(item.display_name);
        }

        setSearchModalVisible(false);
        setActiveSearchField(null);
    };

    const useCurrentLocation = async () => {
        if (!region) return;
        const address = await getAddressFromCoords(region.latitude, region.longitude);
        const selected = { lat: region.latitude, lon: region.longitude, name: address };

        if (activeSearchField === 'from') {
            setFromLocation(selected);
            setFromText(address);
        } else {
            setToLocation(selected);
            setToText(address);
        }
        setSearchModalVisible(false);
        setActiveSearchField(null);
    };

    const openDropPin = () => {
        if (!activeSearchField) return;
        setSearchModalVisible(false);
        setModalVisible(false);
        setSelectingLocation(activeSearchField);

        // Animate pin selection UI to slide up
        Animated.spring(pinSelectionAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11
        }).start();
    };

    const cancelDropPin = () => {
        // Animate pin selection UI out
        Animated.timing(pinSelectionAnim, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            setSelectingLocation(null);
            setModalVisible(true);
            setSearchModalVisible(true);
        });
    };

    const confirmPinLocation = async () => {
        if (!selectingLocation || !draggedRegion) return;

        const address = await getAddressFromCoords(draggedRegion.latitude, draggedRegion.longitude);
        const selected = { lat: draggedRegion.latitude, lon: draggedRegion.longitude, name: address };

        if (selectingLocation === 'from') {
            setFromLocation(selected);
            setFromText(address);
        } else {
            setToLocation(selected);
            setToText(address);
        }

        // Animate pin selection UI out
        Animated.timing(pinSelectionAnim, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            setSelectingLocation(null);
            setModalVisible(true);
        });
    };

    // ====================================================================
    // ROUTE & NAVIGATION
    // ====================================================================
    useEffect(() => {
        if (fromLocation && toLocation) {
            fetchRoute(fromLocation, toLocation, setRouteCoords, setTripDetails, mapRef);
        }
    }, [fromLocation, toLocation, fetchRoute]);

    // Animate modal when it opens/closes or when content changes
    useEffect(() => {
        const { height } = Dimensions.get('window');
        if (modalVisible) {
            // Expand modal more when both locations are selected (to show Confirm button)
            const targetPosition = fromLocation && toLocation
                ? height * 0.50  // Show more of the modal (55% visible)
                : height * 0.58; // Show less (42% visible)

            Animated.spring(slideAnim, {
                toValue: targetPosition,
                useNativeDriver: false,
                tension: 65,
                friction: 11
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height, // Slide completely off screen
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    }, [modalVisible, fromLocation, toLocation]);

    const handleConfirmLocation = () => {
        if (fromLocation && toLocation) {
            closeModal();
            router.push({
                pathname: '/user/booking/details',
                params: {
                    from: fromLocation.name,
                    to: toLocation.name,
                    fromLat: fromLocation.lat,
                    fromLon: fromLocation.lon,
                    toLat: toLocation.lat,
                    toLon: toLocation.lon,
                    distance: tripDetails?.distance || '0 km',
                    time: tripDetails?.duration || '0 mins'
                }
            });
        } else {
            alert("Please select both From and To locations.");
        }
    };

    // ====================================================================
    // MODAL CONTROLS
    // ====================================================================
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    // ====================================================================
    // RENDER
    // ====================================================================
    return (
        <>
            {/* PIN SELECTION UI */}
            <PinSelectionUI
                selectingLocation={selectingLocation}
                pinSelectionAnim={pinSelectionAnim}
                onCancel={cancelDropPin}
                onConfirm={confirmPinLocation}
            />

            {/* SEARCH BAR */}
            {!selectingLocation && (
                <SearchBar
                    fromLocation={fromLocation}
                    toLocation={toLocation}
                    onPress={openModal}
                />
            )}

            {/* MODALS */}
            <LocationModals
                modalVisible={modalVisible}
                closeModal={closeModal}
                slideAnim={slideAnim}
                isModalFull={isModalFull}
                fromText={fromText}
                toText={toText}
                fromLocation={fromLocation}
                toLocation={toLocation}
                handleConfirmLocation={handleConfirmLocation}
                openSearchModal={openSearchModal}
                searchModalVisible={searchModalVisible}
                setSearchModalVisible={setSearchModalVisible}
                activeSearchField={activeSearchField}
                searchText={searchText}
                handleSearchTextChange={handleSearchTextChange}
                clearSearchText={clearSearchText}
                useCurrentLocation={useCurrentLocation}
                searchSuggestions={searchSuggestions}
                selectLocationFromSearch={selectLocationFromSearch}
                openDropPin={openDropPin}
                searchInputRef={searchInputRef}
            />

            {/* DRIVER SEARCH LOADING */}
            <DriverSearchLoading
                visible={driverSearchVisible}
                onCancel={handleCancelBooking}
            />
        </>
    );
};
