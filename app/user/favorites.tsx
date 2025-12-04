import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../config';

interface FavoriteLocation {
  _id: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  placeId: string;
  createdAt: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
              <View style={styles.cardContent}>
                <Ionicons name="location-sharp" size={24} color="#534889" style={{ marginRight: 12 }} />
                <View style={styles.titleContainer}>
                  <Text style={styles.cardTitle}>{favorite.placeName}</Text>
                  <Text style={styles.cardSubtext} numberOfLines={2} ellipsizeMode="tail">
                    {favorite.placeAddress}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => confirmRemove(favorite._id, favorite.placeName)}
                >
                  <Ionicons name="heart" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 20 : 20,
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
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins_700Bold',
    marginTop: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
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
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 18,
  },
});
