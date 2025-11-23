import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import SideMenu from './side_menu';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<any>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const mapRef = useRef<MapView>(null);

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

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  const centerOnLocation = () => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 300);
    }
  };

  if (!region) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Fetching location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* SIDE MENU */}
      <SideMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        profilePicture="https://example.com/cat1.jpg"
        gmail="user@gmail.com"
      />

      {/* MAP */}
      <MapView 
        ref={mapRef} 
        style={StyleSheet.absoluteFill} 
        region={region} 
        showsUserLocation 
        showsMyLocationButton={false}
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

      {/* MENU BUTTON */}
      <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuVisible(true)}>
        <MaterialIcons name="menu" size={30} color="#000000ff" />
      </TouchableOpacity>

      {/* NOTIFICATION BUTTON */}
      <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/tabs/notification')}>
        <Ionicons name="notifications-outline" size={24} color="#000000ff" />
      </TouchableOpacity>

      {/* LOCATION BUTTON */}
      <TouchableOpacity style={styles.locationButton} onPress={centerOnLocation}>
        <Ionicons name="locate" size={24} color="#534889" />
      </TouchableOpacity>

      {/* SEARCH BAR */}
      <TouchableOpacity style={styles.destinationContainer} onPress={openModal}>
        <View style={styles.destinationInputWrapper}>
          <Ionicons name="search" size={20} color="#534889" style={styles.searchIconInside} />
          <Text style={{ color: '#a2a2a2ff', fontSize: 16, fontFamily: 'Poppins' }}>
            Where would you like to go?
          </Text>
        </View>
      </TouchableOpacity>

      {/* BOTTOM SHEET MODAL */}
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

            <TextInput placeholder="From" placeholderTextColor="#D0D0D0" style={styles.input} />
            <TextInput placeholder="To" placeholderTextColor="#D0D0D0" style={styles.input} />
            <TextInput placeholder="Time" placeholderTextColor="#D0D0D0" style={styles.input} />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  menuButton: {
    position: 'absolute',
    left: 20,
    transform: [{ translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(198,185,229,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 50,
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    transform: [{ translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(198,185,229,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 50,
  },

  locationCircleOuter: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E5D6F9', alignItems: 'center', justifyContent: 'center' },
  locationCircleMid: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#CCB2F2', alignItems: 'center', justifyContent: 'center' },
  locationCircleInner: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#534889', alignItems: 'center', justifyContent: 'center' },

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
    elevation: 2,
  },
  destinationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 12,
    right: 12,
    borderRadius: 14,
    backgroundColor: '#F8F6FC',
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    elevation: 2,
  },
  destinationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  searchIconInside: { marginRight: 8 },

  dimBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  modalContainer: { position: 'absolute', left: 0, width: '100%', height: height * 0.5, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontFamily: 'Poppins', fontWeight: 'bold' },
  input: { width: '100%', borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, fontSize: 16, color: '#414141', backgroundColor: '#F8F8F8', fontFamily: 'Poppins', marginBottom: 10 },
});
