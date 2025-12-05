import { useRef, useState } from 'react';
import { Animated, TextInput } from 'react-native';
import { useLocationSearch } from '../../LocationSearch';
import { SelectedLocation } from './useBookingState';

export interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

export const useLocationSelection = (
    region: any,
    setFromLocation: (location: SelectedLocation | null) => void,
    setToLocation: (location: SelectedLocation | null) => void,
    setFromText: (text: string) => void,
    setToText: (text: string) => void,
    setSelectingLocation: (value: 'from' | 'to' | null) => void,
    setModalVisible: (visible: boolean) => void,
    pinSelectionAnim: Animated.Value
) => {
    const { debouncedFetchSuggestions, getAddressFromCoords } = useLocationSearch();
    const searchInputRef = useRef<TextInput>(null);

    // Search Modal State
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [activeSearchField, setActiveSearchField] = useState<'from' | 'to' | null>(null);
    const [searchText, setSearchText] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState<NominatimResult[]>([]);

    const openSearchModal = (type: 'from' | 'to', fromText: string, toText: string) => {
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

    const confirmPinLocation = async (draggedRegion: any) => {
        if (!activeSearchField || !draggedRegion) return;

        const address = await getAddressFromCoords(draggedRegion.latitude, draggedRegion.longitude);
        const selected = { lat: draggedRegion.latitude, lon: draggedRegion.longitude, name: address };

        if (activeSearchField === 'from') {
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

    return {
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
    };
};
