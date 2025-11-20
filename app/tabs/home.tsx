import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

export default function HomeScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<any>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location permission in settings.');
        return;
      }

      // Get initial location
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Watch location changes
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (location) => {
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
    };

    startLocationTracking();

    return () => {
      if (subscription) subscription.remove(); // clean up
    };
  }, []);

  if (!region) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Fetching location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} region={region} showsUserLocation showsMyLocationButton>
        <Marker coordinate={region}>
          <View style={styles.locationCircleOuter}>
            <View style={styles.locationCircleMid}>
              <View style={styles.locationCircleInner}>
                <Ionicons name="location" size={32} color="#fff" />
              </View>
            </View>
          </View>
        </Marker>

        <Circle center={region} radius={400} strokeWidth={0} fillColor="rgba(98,44,155,0.10)" />
      </MapView>

      <TouchableOpacity style={styles.menuButton}>
        <MaterialIcons name="menu" size={30} color="#000000ff" />
      </TouchableOpacity>

      <View style={[styles.searchContainer, { bottom: 10 }]}>
        <Ionicons name="search" size={22} color="#534889" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Where would you go?" placeholderTextColor="#D0D0D0" />
        <TouchableOpacity>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#534889" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  menuButton: {
    position: 'absolute',
    left: 20,
    transform: [{ translateY: -22 }],  // Center vertically (half of height 44)
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(198,185,229,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 50,
  },

  searchContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F8F6FC',
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontFamily: 'Poppins',
    color: '#414141',
    fontSize: 17,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
  },

  searchIcon: { marginRight: 7 },
  arrowIcon: { marginLeft: 7 },

  locationCircleOuter: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E5D6F9', alignItems: 'center', justifyContent: 'center' },
  locationCircleMid: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#CCB2F2', alignItems: 'center', justifyContent: 'center' },
  locationCircleInner: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#534889', alignItems: 'center', justifyContent: 'center' },
});
