import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';

// Custom Hooks & Components
import { useLocationTracker } from '../../components/LocationTracker';
import { MapComponent } from '../../components/Map';
import { BookingComponent } from './booking/book';

interface SelectedLocation {
  lat: number;
  lon: number;
  name: string;
}

export default function HomeScreen() {
  const router = useRouter();

  // Custom Hooks
  const { region } = useLocationTracker();

  // Refs
  const mapRef = useRef<MapView>(null) as React.RefObject<MapView>;

  // State
  const [draggedRegion, setDraggedRegion] = useState<any>(null);
  const [selectingLocation, setSelectingLocation] = useState<'from' | 'to' | null>(null);
  const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(null);
  const [toLocation, setToLocation] = useState<SelectedLocation | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);

  // ====================================================================
  // CALLBACKS FROM BOOKING COMPONENT
  // ====================================================================
  const handleLocationChange = (from: SelectedLocation | null, to: SelectedLocation | null) => {
    setFromLocation(from);
    setToLocation(to);
  };

  const handleRouteChange = (coords: { latitude: number; longitude: number }[]) => {
    setRouteCoords(coords);
  };

  // ====================================================================
  // MAP CONTROLS
  // ====================================================================
  const centerOnLocation = () => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion(
        { ...region, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        300
      );
    }
  };

  if (!region) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Fetching location...</Text>
      </SafeAreaView>
    );
  }

  // ====================================================================
  // RENDER
  // ====================================================================
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* MAP */}
        <MapComponent
          mapRef={mapRef}
          region={region}
          onRegionChangeComplete={setDraggedRegion}
          fromLocation={fromLocation}
          toLocation={toLocation}
          routeCoords={routeCoords}
          selectingLocation={selectingLocation}
        />

        {/* BOOKING COMPONENT - Contains all booking logic */}
        <BookingComponent
          region={region}
          mapRef={mapRef}
          selectingLocation={selectingLocation}
          setSelectingLocation={setSelectingLocation}
          draggedRegion={draggedRegion}
          setDraggedRegion={setDraggedRegion}
          onLocationChange={handleLocationChange}
          onRouteChange={handleRouteChange}
        />

        {/* BUTTONS */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/user/notification')}
        >
          <Ionicons name="notifications-outline" size={24} color="#000000ff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.locationButton, selectingLocation && { bottom: 200 }]}
          onPress={centerOnLocation}
        >
          <Ionicons name="locate" size={24} color="#534889" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    top: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(198,185,229,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationButton: {
    position: 'absolute',
    bottom: 150,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F6FC',
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
});
