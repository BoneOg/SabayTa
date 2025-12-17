import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../config';

// Define types
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

interface FavoriteLocation {
    _id: string;
    placeName: string;
    placeAddress: string;
    latitude: number;
    longitude: number;
    placeId: string;
    customLabel: string;
    iconName: string;
}

interface LocationModalsProps {
    // Main Modal Props
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

    // Search Modal Props
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
    searchInputRef: React.RefObject<TextInput | null>;
    selectedSearchItem?: NominatimResult | null;
}

export const LocationModals = ({
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
    selectedSearchItem
}: LocationModalsProps) => {
    const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
    const [favoritedPlaces, setFavoritedPlaces] = useState<Set<string>>(new Set());
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    useEffect(() => {
        if (searchModalVisible) {
            fetchFavorites();
        }
    }, [searchModalVisible]);

    const fetchFavorites = async () => {
        try {
            setLoadingFavorites(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFavorites(data.favorites || []);
                const placeIds = new Set<string>(data.favorites.map((fav: FavoriteLocation) => fav.placeId));
                setFavoritedPlaces(placeIds);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoadingFavorites(false);
        }
    };

    const toggleFavorite = async (item: NominatimResult) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const placeId = item.place_id.toString();
            const isFavorited = favoritedPlaces.has(placeId);

            if (isFavorited) {
                // Remove from favorites
                const favorite = favorites.find(fav => fav.placeId === placeId);
                if (favorite) {
                    const response = await fetch(`${BASE_URL}/api/favorites/${favorite._id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        setFavorites(favorites.filter(fav => fav._id !== favorite._id));
                        const newFavorited = new Set(favoritedPlaces);
                        newFavorited.delete(placeId);
                        setFavoritedPlaces(newFavorited);
                    }
                }
            } else {
                // Add to favorites
                const response = await fetch(`${BASE_URL}/api/favorites`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        placeName: item.display_name.split(',')[0],
                        placeAddress: item.display_name,
                        latitude: parseFloat(item.lat),
                        longitude: parseFloat(item.lon),
                        placeId: placeId,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    setFavorites([data.favorite, ...favorites]);
                    const newFavorited = new Set(favoritedPlaces);
                    newFavorited.add(placeId);
                    setFavoritedPlaces(newFavorited);
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const selectFavorite = (favorite: FavoriteLocation) => {
        const nominatimResult: NominatimResult = {
            place_id: parseInt(favorite.placeId),
            lat: favorite.latitude.toString(),
            lon: favorite.longitude.toString(),
            display_name: favorite.placeAddress,
        };
        selectLocationFromSearch(nominatimResult);
    };

    return (
        <>
            {/* MODAL */}
            {modalVisible && (
                <View style={StyleSheet.absoluteFill}>
                    <TouchableOpacity style={styles.dimBackground} activeOpacity={1} onPress={closeModal} />
                    <Animated.View style={[styles.modalContainer, { top: slideAnim }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Address</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <FontAwesome name="close" size={22} color="#414141" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            {/* FROM INPUT */}
                            <View style={{ position: 'relative', marginBottom: 10 }}>
                                <TouchableOpacity style={styles.inputWithIcon} onPress={() => openSearchModal('from')}>
                                    <MaterialIcons name="my-location" size={20} color="#494949ff" style={{ marginRight: 8 }} />
                                    <Text style={[styles.input, { paddingVertical: 12 }]}>
                                        {fromText || "From"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* TO INPUT */}
                            <View style={{ position: 'relative', marginTop: 10 }}>
                                <TouchableOpacity style={styles.inputWithIcon} onPress={() => openSearchModal('to')}>
                                    <Ionicons name="location-outline" size={20} color="#494949ff" style={{ marginRight: 8 }} />
                                    <Text style={[styles.input, { paddingVertical: 12 }]}>
                                        {toText || "To"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* CONFIRM BUTTON */}
                            {!isModalFull && fromLocation && toLocation && (
                                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                                    <Text style={styles.confirmButtonText}>Confirm Location</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </Animated.View>
                </View>
            )}

            {/* NEW SEARCH MODAL */}
            {searchModalVisible && (
                <View style={styles.fullScreenModal}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.searchModalHeader}>
                            <TouchableOpacity onPress={() => setSearchModalVisible(false)} style={styles.closeSearchButton}>
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.searchModalTitle}>
                                {activeSearchField === 'from' ? "Set Pickup Location" : "Set Drop Off Location"}
                            </Text>
                        </View>

                        <View style={styles.searchInputContainer}>
                            <View style={styles.searchInputWrapper}>
                                <Ionicons name="search" size={20} color="#534889" style={{ marginRight: 8 }} />

                                <TextInput
                                    ref={searchInputRef}
                                    style={styles.searchInput}
                                    placeholder="Search location"
                                    value={searchText}
                                    onChangeText={handleSearchTextChange}
                                    autoFocus={true}
                                />

                                {/* Heart Icon for Selected Search Item */}
                                {selectedSearchItem && (
                                    <TouchableOpacity
                                        style={{ marginRight: 12, marginLeft: 8 }}
                                        onPress={() => toggleFavorite(selectedSearchItem)}
                                    >
                                        <Ionicons
                                            name={favoritedPlaces.has(selectedSearchItem.place_id.toString()) ? "heart" : "heart-outline"}
                                            size={22}
                                            color={favoritedPlaces.has(selectedSearchItem.place_id.toString()) ? "#534889" : "#666"}
                                        />
                                    </TouchableOpacity>
                                )}

                                {searchText.length > 0 && (
                                    <TouchableOpacity onPress={clearSearchText}>
                                        <Ionicons name="close-circle" size={20} color="#a2a2a2" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {activeSearchField === 'from' && (
                            <TouchableOpacity style={styles.currentLocationRow} onPress={useCurrentLocation}>
                                <View style={styles.currentLocationIcon}>
                                    <MaterialIcons name="my-location" size={22} color="#534889" />
                                </View>
                                <Text style={styles.currentLocationText}>Use my current location</Text>
                            </TouchableOpacity>
                        )}

                        <ScrollView style={styles.searchResultsList} keyboardShouldPersistTaps="handled">
                            {/* Favorites Section */}
                            {favorites.length > 0 && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons name="heart" size={18} color="#534889" />
                                        <Text style={styles.sectionHeaderText}>Favorites</Text>
                                    </View>
                                    {favorites.map((favorite) => (
                                        <TouchableOpacity
                                            key={favorite._id}
                                            style={styles.searchResultItem}
                                            onPress={() => selectFavorite(favorite)}
                                        >
                                            <View style={styles.searchResultIcon}>
                                                <Ionicons name={favorite.iconName as any || "location-outline"} size={20} color="#414141" />
                                            </View>
                                            <View style={styles.searchResultTextContainer}>
                                                <Text style={styles.favoriteTitle}>
                                                    {favorite.customLabel || favorite.placeName}
                                                </Text>
                                                <Text style={styles.favoriteAddress} numberOfLines={1}>
                                                    {favorite.placeAddress}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite({
                                                        place_id: parseInt(favorite.placeId),
                                                        lat: favorite.latitude.toString(),
                                                        lon: favorite.longitude.toString(),
                                                        display_name: favorite.placeAddress,
                                                    });
                                                }}
                                                style={styles.favoriteButton}
                                            >
                                                <Ionicons name="heart" size={22} color="#534889" />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}

                            {/* Search Results */}
                            {searchSuggestions.length > 0 && (
                                <>
                                    {favorites.length > 0 && (
                                        <View style={styles.sectionHeader}>
                                            <Ionicons name="search" size={18} color="#534889" />
                                            <Text style={styles.sectionHeaderText}>Search Results</Text>
                                        </View>
                                    )}
                                    {searchSuggestions.map((item) => (
                                        <TouchableOpacity
                                            key={item.place_id}
                                            style={styles.searchResultItem}
                                            onPress={() => selectLocationFromSearch(item)}
                                        >
                                            <View style={styles.searchResultIcon}>
                                                <Ionicons name="location-outline" size={20} color="#414141" />
                                            </View>
                                            <Text style={styles.searchResultText}>{item.display_name}</Text>
                                            <TouchableOpacity
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(item);
                                                }}
                                                style={styles.favoriteButton}
                                            >
                                                <Ionicons
                                                    name={favoritedPlaces.has(item.place_id.toString()) ? "heart" : "heart-outline"}
                                                    size={22}
                                                    color={favoritedPlaces.has(item.place_id.toString()) ? "#FF6B6B" : "#999"}
                                                />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </ScrollView>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.keyboardAvoidingContainer}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
                        >
                            <TouchableOpacity style={styles.chooseMapButton} onPress={openDropPin}>
                                <Ionicons name="map-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.chooseMapText}>Choose from map</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    dimBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
    modalContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 15, paddingBottom: 20, zIndex: 10 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 15 },
    modalTitle: { fontSize: 18, textAlign: 'center', flex: 1, marginTop: 8 },
    input: { flex: 1, fontSize: 16, color: '#414141', paddingVertical: 8 },
    inputWithIcon: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 10, paddingHorizontal: 12, height: 45, backgroundColor: '#F8F8F8' },
    confirmButton: { backgroundColor: '#534889', padding: 14, borderRadius: 14, marginTop: 20, marginHorizontal: 0, alignItems: 'center', justifyContent: 'center' },
    confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    fullScreenModal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 2000 },
    searchModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    closeSearchButton: { padding: 5 },
    searchModalTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
    searchInputContainer: { padding: 15, paddingBottom: 10 },
    searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 14, paddingHorizontal: 16, height: 54 },
    searchInput: { flex: 1, fontSize: 16, color: '#333' },
    currentLocationRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    currentLocationIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F6FC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    currentLocationText: { fontSize: 16, color: '#333', fontWeight: '500' },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#F8F6FC',
        gap: 8,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#534889',
    },
    searchResultsList: { flex: 1 },
    searchResultItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    searchResultIcon: { marginRight: 12 },
    searchResultTextContainer: {
        flex: 1,
    },
    searchResultText: { flex: 1, fontSize: 15, color: '#333' },
    favoriteTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    favoriteAddress: {
        fontSize: 13,
        color: '#666',
    },
    favoriteButton: {
        padding: 8,
        marginLeft: 8,
    },
    keyboardAvoidingContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    chooseMapButton: { flexDirection: 'row', backgroundColor: '#534889', padding: 15, alignItems: 'center', justifyContent: 'center', margin: 15, borderRadius: 12 },
    chooseMapText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

