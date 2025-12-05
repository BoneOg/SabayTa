import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import MapView from 'react-native-maps';

// Custom Hooks & Components
import { useHomeAnimations } from '../../../components/animations/HomeAnimations';
import { PinSelectionUI } from '../../../components/PinSelectionUI';
import { useRouteCalculator } from '../../../components/RouteCalculator';
import { BookingModals } from '../../../components/user/BookingModals';
import { BookingSearchBar } from '../../../components/user/BookingSearchBar';
import { DriverComponents } from '../../../components/user/DriverComponents';
import { useBookingActions } from '../../../components/user/hooks/useBookingActions';
import { useBookingPolling } from '../../../components/user/hooks/useBookingPolling';
import { useBookingState } from '../../../components/user/hooks/useBookingState';
import { useLocationSelection } from '../../../components/user/hooks/useLocationSelection';
import { useModalAnimations } from '../../../components/user/hooks/useModalAnimations';

interface BookingComponentProps {
    region: any;
    mapRef: React.RefObject<MapView>;
    selectingLocation: 'from' | 'to' | null;
    setSelectingLocation: (value: 'from' | 'to' | null) => void;
    draggedRegion: any;
    setDraggedRegion: (region: any) => void;
    onLocationChange?: (from: any, to: any) => void;
    onRouteChange?: (coords: { latitude: number; longitude: number }[]) => void;
    onDriverLocationChange?: (location: { latitude: number; longitude: number } | null) => void;
    onDriverRouteChange?: (show: boolean) => void;
    onBookingAccepted?: (accepted: boolean) => void;
}

export const BookingComponent = ({
    region,
    mapRef,
    selectingLocation,
    setSelectingLocation,
    draggedRegion,
    setDraggedRegion,
    onLocationChange,
    onRouteChange,
    onDriverLocationChange,
    onDriverRouteChange,
    onBookingAccepted
}: BookingComponentProps) => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Custom Hooks
    const { slideAnim, pinSelectionAnim } = useHomeAnimations();
    const { fetchRoute } = useRouteCalculator();

    // Booking State Hook
    const {
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
        resetBookingState,
    } = useBookingState();

    // Route State
    const [routeCoords, setRouteCoords] = React.useState<{ latitude: number; longitude: number }[]>([]);
    const [tripDetails, setTripDetails] = React.useState<{ distance: string; duration: string } | null>(null);

    // Modal State
    const [modalVisible, setModalVisible] = React.useState(false);

    // Location Selection Hook
    const {
        searchInputRef,
        searchModalVisible,
        setSearchModalVisible,
        activeSearchField,
        searchText,
        searchSuggestions,
        openSearchModal,
        handleSearchTextChange,
        clearSearchText,
        selectLocationFromSearch,
        useCurrentLocation,
        openDropPin,
        cancelDropPin,
        confirmPinLocation,
    } = useLocationSelection(
        region,
        setFromLocation,
        setToLocation,
        setFromText,
        setToText,
        setSelectingLocation,
        setModalVisible,
        pinSelectionAnim
    );

    // Modal Animations Hook
    const { isModalFull } = useModalAnimations(
        modalVisible,
        fromLocation,
        toLocation,
        slideAnim
    );

    // Booking Actions Hook
    const { handleCreateBooking, handleCancelBooking } = useBookingActions(
        bookingId,
        setBookingId,
        setDriverSearchVisible,
        setDriverArrivalVisible,
        setBookingAccepted,
        resetBookingState,
        onDriverRouteChange,
        onDriverLocationChange
    );

    // Booking Polling Hook
    useBookingPolling({
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
        resetBookingState,
    });



    // Notify parent of booking acceptance
    useEffect(() => {
        if (onBookingAccepted) {
            onBookingAccepted(bookingAccepted);
        }
    }, [bookingAccepted]);

    // Notify parent of location changes
    useEffect(() => {
        if (onLocationChange) {
            onLocationChange(fromLocation, toLocation);
        }
    }, [fromLocation, toLocation]);

    // Notify parent of route changes
    useEffect(() => {
        console.log("🗺️ Route coords changed, length:", routeCoords.length);
        if (routeCoords.length > 0) {
            console.log("   Start:", routeCoords[0]);
            console.log("   End:", routeCoords[routeCoords.length - 1]);
        }
        if (onRouteChange) {
            onRouteChange(routeCoords);
        }
    }, [routeCoords]);

    // Driver Search & Booking Logic
    useEffect(() => {
        if (params.action === 'search_driver') {
            setDriverSearchVisible(true);
            handleCreateBooking(params);
        }
    }, [params.action]);

    // Route Calculation
    useEffect(() => {
        if (fromLocation && toLocation && !bookingAccepted && !driverArrivalVisible) {
            fetchRoute(fromLocation, toLocation, setRouteCoords, setTripDetails, mapRef);
        }
    }, [fromLocation, toLocation, fetchRoute, bookingAccepted, driverArrivalVisible]);

    // Modal Controls
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    // Confirm Location Handler
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

    return (
        <>
            {/* PIN SELECTION UI */}
            <PinSelectionUI
                selectingLocation={selectingLocation}
                pinSelectionAnim={pinSelectionAnim}
                onCancel={cancelDropPin}
                onConfirm={() => confirmPinLocation(draggedRegion)}
            />

            {/* SEARCH BAR OR DRIVER ON THE WAY BAR */}
            <BookingSearchBar
                selectingLocation={selectingLocation}
                bookingAccepted={bookingAccepted}
                passengerPickedUp={passengerPickedUp}
                fromLocation={fromLocation}
                toLocation={toLocation}
                onSearchPress={openModal}
                onDriverBarPress={() => setDriverArrivalVisible(true)}
            />

            {/* MODALS */}
            <BookingModals
                modalVisible={modalVisible}
                closeModal={closeModal}
                slideAnim={slideAnim}
                isModalFull={isModalFull}
                fromText={fromText}
                toText={toText}
                fromLocation={fromLocation}
                toLocation={toLocation}
                handleConfirmLocation={handleConfirmLocation}
                openSearchModal={(type) => openSearchModal(type, fromText, toText)}
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

            {/* DRIVER COMPONENTS */}
            <DriverComponents
                driverSearchVisible={driverSearchVisible}
                driverArrivalVisible={driverArrivalVisible}
                showDriverDetails={showDriverDetails}
                showChat={showChat}
                onCancelBooking={handleCancelBooking}
                onCloseDriverArrival={() => setDriverArrivalVisible(false)}
                onMessagePress={() => setShowChat(true)}
                onDetailsPress={() => setShowDriverDetails(true)}
                onCloseDriverDetails={() => setShowDriverDetails(false)}
                onCloseChat={() => setShowChat(false)}
            />
        </>
    );
};
