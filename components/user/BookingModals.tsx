import React from 'react';
import { Animated } from 'react-native';
import { LocationModals } from '../Location';
import { SelectedLocation } from './hooks/useBookingState';
import { NominatimResult } from './hooks/useLocationSelection';

interface BookingModalsProps {
    modalVisible: boolean;
    closeModal: () => void;
    slideAnim: Animated.Value;
    isModalFull: boolean;
    fromText: string;
    toText: string;
    fromLocation: SelectedLocation | null;
    toLocation: SelectedLocation | null;
    handleConfirmLocation: () => void;
    openSearchModal: (type: 'from' | 'to') => void;
    searchModalVisible: boolean;
    setSearchModalVisible: (visible: boolean) => void;
    activeSearchField: 'from' | 'to' | null;
    searchText: string;
    handleSearchTextChange: (text: string) => void;
    clearSearchText: () => void;
    useCurrentLocation: () => void;
    searchSuggestions: NominatimResult[];
    selectLocationFromSearch: (item: NominatimResult) => void;
    openDropPin: () => void;
    searchInputRef: React.RefObject<any>;
}

export const BookingModals: React.FC<BookingModalsProps> = ({
    modalVisible,
    closeModal,
    slideAnim,
    isModalFull,
    fromText,
    toText,
    fromLocation,
    toLocation,
    handleConfirmLocation,
    openSearchModal,
    searchModalVisible,
    setSearchModalVisible,
    activeSearchField,
    searchText,
    handleSearchTextChange,
    clearSearchText,
    useCurrentLocation,
    searchSuggestions,
    selectLocationFromSearch,
    openDropPin,
    searchInputRef,
}) => {
    return (
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
    );
};
