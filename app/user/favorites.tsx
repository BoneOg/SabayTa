import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
  const router = useRouter();

  // Load Poppins font
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    // Show a simple loading spinner while fonts load
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourite</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main Campus Card */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Ionicons name="location-sharp" size={24} color="#000000ff" style={{ marginRight: 8 }} />
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>Main Campus</Text>
              <Text style={styles.cardSubtext} numberOfLines={1} ellipsizeMode="tail">
                University of Science and Technology of Southern Philippines
              </Text>
            </View>
            <TouchableOpacity style={styles.removeButton}>
              <Ionicons name="remove-circle" size={22} color="#FF4D4D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Home Card */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Ionicons name="location-sharp" size={24} color="#000000ff" style={{ marginRight: 8 }} />
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>Home</Text>
              <Text style={styles.cardSubtext} numberOfLines={1} ellipsizeMode="tail">
                Bulua, Cagayan de Oro City, Misamis Oriental
              </Text>
            </View>
            <TouchableOpacity style={styles.removeButton}>
              <Ionicons name="remove-circle" size={22} color="#FF4D4D" />
            </TouchableOpacity>
          </View>
        </View>
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
    fontFamily: 'Poppins_400Regular', // changed to regular
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D0D0D0',
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
    color: '#000000ff',
    fontFamily: 'Poppins_400Regular', // changed to regular
  },
  cardSubtext: {
    fontSize: 12,
    marginTop: 4,
    color: '#414141',
    fontFamily: 'Poppins_400Regular',
  },
});
