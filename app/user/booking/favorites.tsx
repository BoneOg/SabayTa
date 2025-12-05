import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../../config';

interface FavoriteLocation {
    _id: string;
    placeName: string;
    placeAddress: string;
    latitude: number;
    longitude: number;
    placeId: string;
    customLabel: string;
    iconName: string;
    createdAt: string;
}

interface IconOption {
    name: string;
    label: string;
    library: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons';
}

const ICON_OPTIONS: IconOption[] = [
    { name: 'location-sharp', label: 'Location', library: 'Ionicons' },
    { name: 'home', label: 'Home', library: 'Ionicons' },
    { name: 'briefcase', label: 'Work', library: 'Ionicons' },
    { name: 'school', label: 'School', library: 'Ionicons' },
    { name: 'cafe', label: 'Cafe', library: 'Ionicons' },
    { name: 'restaurant', label: 'Restaurant', library: 'Ionicons' },
    { name: 'fitness', label: 'Gym', library: 'Ionicons' },
    { name: 'medical', label: 'Hospital', library: 'Ionicons' },
    { name: 'cart', label: 'Shopping', library: 'Ionicons' },
    { name: 'airplane', label: 'Airport', library: 'Ionicons' },
    { name: 'train', label: 'Train', library: 'Ionicons' },
    { name: 'bus', label: 'Bus', library: 'Ionicons' },
    { name: 'heart', label: 'Favorite', library: 'Ionicons' },
    { name: 'star', label: 'Star', library: 'Ionicons' },
    { name: 'pin', label: 'Pin', library: 'Ionicons' },
    { name: 'flag', label: 'Flag', library: 'Ionicons' },
];

const renderIcon = (iconOption: IconOption, size: number = 24, color: string = '#534889') => {
    const { name, library } = iconOption;

    switch (library) {
        case 'Ionicons':
            return <Ionicons name={name as any} size={size} color={color} />;
        case 'MaterialIcons':
            return <MaterialIcons name={name as any} size={size} color={color} />;
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
        default:
            return <Ionicons name="location-sharp" size={size} color={color} />;
    }
};

export default function FavoritesScreen() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedFavorite, setSelectedFavorite] = useState<FavoriteLocation | null>(null);
    const [customLabel, setCustomLabel] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<IconOption>(ICON_OPTIONS[0]);

    // Load Poppins font
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            fetchFavorites();
        }
    }, [fontsLoaded]);

    const fetchFavorites = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${BASE_URL}/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFavorites(data.favorites || []);
            } else {
                console.error('Failed to fetch favorites:', data.message);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchFavorites();
    };

    const openEditModal = (favorite: FavoriteLocation) => {
        setSelectedFavorite(favorite);
        setCustomLabel(favorite.customLabel || '');
        const iconOption = ICON_OPTIONS.find(opt => opt.name === favorite.iconName) || ICON_OPTIONS[0];
        setSelectedIcon(iconOption);
        setEditModalVisible(true);
    };

    const updateFavorite = async () => {
        if (!selectedFavorite) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/favorites/${selectedFavorite._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customLabel: customLabel,
                    iconName: selectedIcon.name,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setFavorites(favorites.map(fav =>
                    fav._id === selectedFavorite._id ? data.favorite : fav
                ));
                setEditModalVisible(false);
                Alert.alert('Success', 'Favorite updated successfully');
            } else {
                Alert.alert('Error', data.message || 'Failed to update favorite');
            }
        } catch (error) {
            console.error('Error updating favorite:', error);
            Alert.alert('Error', 'Failed to update favorite');
        }
    };

    const removeFavorite = async (favoriteId: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/favorites/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setFavorites(favorites.filter(fav => fav._id !== favoriteId));
                Alert.alert('Success', 'Removed from favorites');
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to remove favorite');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            Alert.alert('Error', 'Failed to remove favorite');
        }
    };

    const confirmRemove = (favoriteId: string, placeName: string) => {
        Alert.alert(
            'Remove Favorite',
            `Remove "${placeName}" from favorites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeFavorite(favoriteId)
                },
            ]
        );
    };

    const getDisplayName = (favorite: FavoriteLocation) => {
        return favorite.customLabel || favorite.placeName;
    };

    const getIconForFavorite = (favorite: FavoriteLocation) => {
        const iconOption = ICON_OPTIONS.find(opt => opt.name === favorite.iconName) || ICON_OPTIONS[0];
        return iconOption;
    };

    if (!fontsLoaded || loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#534889" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favourite</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#534889']} />
                }
            >
                {favorites.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={80} color="#D0D0D0" />
                        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                        <Text style={styles.emptyText}>
                            Add locations to your favorites by tapping the heart icon when searching for places
                        </Text>
                    </View>
                ) : (
                    favorites.map((favorite) => (
                        <View key={favorite._id} style={styles.card}>
                            <TouchableOpacity
                                style={styles.cardContent}
                                onPress={() => openEditModal(favorite)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.cardMainRow}>
                                    <View style={styles.titleContainer}>
                                        <View style={styles.titleRow}>
                                            <View style={styles.iconContainer}>
                                                {renderIcon(getIconForFavorite(favorite), 24, '#534889')}
                                            </View>
                                            <Text style={styles.cardTitle}>{getDisplayName(favorite)}</Text>
                                        </View>
                                        <Text style={styles.cardSubtext} numberOfLines={2} ellipsizeMode="tail">
                                            {favorite.placeAddress}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => confirmRemove(favorite._id, getDisplayName(favorite))}
                                    >
                                        <Ionicons name="heart" size={24} color="#534889" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.customizeText}>Customize</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Favorite</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#414141" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            {/* Custom Label Input */}
                            <Text style={styles.sectionLabel}>Custom Label (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Home, Work, Gym"
                                value={customLabel}
                                onChangeText={setCustomLabel}
                                placeholderTextColor="#999"
                            />

                            {/* Icon Selection */}
                            <Text style={styles.sectionLabel}>Select Icon</Text>
                            <View style={styles.iconGrid}>
                                {ICON_OPTIONS.map((iconOption) => (
                                    <TouchableOpacity
                                        key={iconOption.name}
                                        style={[
                                            styles.iconOption,
                                            selectedIcon.name === iconOption.name && styles.iconOptionSelected
                                        ]}
                                        onPress={() => setSelectedIcon(iconOption)}
                                    >
                                        {renderIcon(iconOption, 28, selectedIcon.name === iconOption.name ? '#fff' : '#534889')}
                                        <Text style={[
                                            styles.iconLabel,
                                            selectedIcon.name === iconOption.name && styles.iconLabelSelected
                                        ]}>
                                            {iconOption.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={updateFavorite}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 20,
        color: '#000',
        fontFamily: 'Poppins_400Regular',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 500,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Poppins_700Bold',
        marginTop: 16,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'column',
    },
    cardMainRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    iconContainer: {
        marginRight: 12,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    customizeText: {
        fontSize: 16,
        color: '#534889',
        fontFamily: 'Poppins_400Regular',
    },
    removeButton: {
        marginLeft: 10,
        padding: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        fontFamily: 'Poppins_700Bold',
        flex: 1,
    },
    cardSubtext: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'Poppins_400Regular',
        lineHeight: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
        color: '#000',
    },
    modalContent: {
        padding: 20,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins_700Bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        backgroundColor: '#F8F8F8',
        marginBottom: 20,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    iconOption: {
        width: '22%',
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        padding: 8,
    },
    iconOptionSelected: {
        backgroundColor: '#534889',
        borderColor: '#534889',
    },
    iconLabel: {
        fontSize: 10,
        color: '#666',
        fontFamily: 'Poppins_400Regular',
        marginTop: 4,
        textAlign: 'center',
    },
    iconLabelSelected: {
        color: '#fff',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins_700Bold',
        color: '#666',
    },
    saveButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#534889',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins_700Bold',
        color: '#fff',
    },
});
