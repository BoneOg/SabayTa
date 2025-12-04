import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

const { height } = Dimensions.get('window');

export default function OfferARideMap() {
  const [region, setRegion] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Real-time location tracking
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Enable location permission in settings.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

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
    return () => subscription?.remove();
  }, []);

  // Automatically open bottom sheet modal
  useEffect(() => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  if (!region) {
    return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
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

      {/* Search Bar */}
      <View style={[styles.searchContainer, { bottom: 10 }]}>
        <Ionicons name="search" size={22} color="#534889" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Where would you go?"
          placeholderTextColor="#D0D0D0"
        />
        <TouchableOpacity>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#534889" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal */}
      {modalVisible && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity
            style={styles.dimBackground}
            activeOpacity={1}
            onPress={closeModal}
          />
          <Animated.View style={[styles.modalContainer, { top: slideAnim }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={closeModal}>
                <FontAwesome name="close" size={22} color="#414141" />
              </TouchableOpacity>
            </View>

            {/* Inputs with icons */}
            <View style={styles.inputWrapper}>
              <MaterialIcons name="my-location" size={20} color="#494949ff" style={styles.inputIcon} />
              <TextInput placeholder="From" placeholderTextColor="#494949ff" style={styles.input} />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#494949ff" style={styles.inputIcon} />
              <TextInput placeholder="To" placeholderTextColor="#494949ff" style={styles.input} />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="time-outline" size={20} color="#494949ff" style={styles.inputIcon} />
              <TextInput placeholder="Time" placeholderTextColor="#494949ff" style={styles.input} />
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
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
  searchInput: { flex: 1, fontFamily: 'Poppins', color: '#414141', fontSize: 17, paddingHorizontal: 6, backgroundColor: 'transparent' },
  searchIcon: { marginRight: 7 },
  arrowIcon: { marginLeft: 7 },
  locationCircleOuter: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E5D6F9', alignItems: 'center', justifyContent: 'center' },
  locationCircleMid: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#CCB2F2', alignItems: 'center', justifyContent: 'center' },
  locationCircleInner: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#534889', alignItems: 'center', justifyContent: 'center' },
  dimBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  modalContainer: { position: 'absolute', left: 0, width: '100%', height: height * 0.5, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins',
    textAlign: 'center',
    flex: 1, // ensures it takes up available space
  },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#F8F8F8', borderRadius: 10, borderWidth: 1, borderColor: '#D0D0D0' },
  inputIcon: { paddingHorizontal: 10 },
  input: { flex: 1, paddingVertical: 8, paddingHorizontal: 0, fontSize: 16, color: '#414141', fontFamily: 'Poppins' },
});
