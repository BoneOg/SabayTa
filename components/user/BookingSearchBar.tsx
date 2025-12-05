import React from 'react';
import { DriverOnTheWayBar } from '../DriverOnTheWayBar';
import { SearchBar } from '../SearchBar';
import { SelectedLocation } from './hooks/useBookingState';

interface BookingSearchBarProps {
    selectingLocation: 'from' | 'to' | null;
    bookingAccepted: boolean;
    fromLocation: SelectedLocation | null;
    toLocation: SelectedLocation | null;
    onSearchPress: () => void;
    onDriverBarPress: () => void;
}

export const BookingSearchBar: React.FC<BookingSearchBarProps> = ({
    selectingLocation,
    bookingAccepted,
    fromLocation,
    toLocation,
    onSearchPress,
    onDriverBarPress,
}) => {
    if (selectingLocation) return null;

    if (bookingAccepted) {
        return <DriverOnTheWayBar onPress={onDriverBarPress} />;
    }

    return (
        <SearchBar
            fromLocation={fromLocation}
            toLocation={toLocation}
            onPress={onSearchPress}
        />
    );
};
