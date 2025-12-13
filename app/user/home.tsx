import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { BASE_URL } from '../../config';

// Custom Hooks & Components
import { CDO_COORDS, useLocationTracker } from '../../components/LocationTracker';
import { MapComponent } from '../../components/Map';
import CustomModal from '../../components/ui/CustomModal';
import { VerificationBlockModal } from '../../components/user/VerificationBlockModal';
import { BookingComponent } from './booking/book';

interface SelectedLocation {
  lat: number;
  lon: number;
  name: string;
}

export default function HomeScreen() {
  const router = useRouter();

  // Custom Hooks
  const { region, setRegion, requestPermissions, permissionStatus } = useLocationTracker();

  // Refs
  const mapRef = useRef<MapView>(null) as React.RefObject<MapView>;

  // State
  const [draggedRegion, setDraggedRegion] = useState<any>(null);
  const [selectingLocation, setSelectingLocation] = useState<'from' | 'to' | null>(null);
  const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(null);
  const [toLocation, setToLocation] = useState<SelectedLocation | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  // Show permission modal when permission is not asked
  useEffect(() => {
    console.log('Permission status:', permissionStatus);
    if (permissionStatus === 'not-asked') {
      console.log('Showing permission modal');
      setPermissionModalVisible(true);
    }
  }, [permissionStatus]);
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showDriverRoute, setShowDriverRoute] = useState(false);
  const [isBookingAccepted, setIsBookingAccepted] = useState(false);
  const [passengerPickedUp, setPassengerPickedUp] = useState(false);

  // Verification State
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'verified' | 'rejected'>('verified');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);

  // Check student verification status on mount
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsCheckingVerification(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/student-verification/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Verification status:', data);

        if (data.hasVerification) {
          setVerificationStatus(data.verificationStatus);
          // Show modal if not verified
          if (data.verificationStatus !== 'verified') {
            setShowVerificationModal(true);
          }
        } else {
          // No verification submitted yet
          setVerificationStatus('none');
          setShowVerificationModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setIsCheckingVerification(false);
    }
  };

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

  // Handle permission modal actions
  const handleAllowPermission = async () => {
    setPermissionModalVisible(false);
    await requestPermissions();
  };

  const handleDenyPermission = () => {
    setPermissionModalVisible(false);
    // Keep using default CDO coordinates
    setRegion(CDO_COORDS);
  };

  if (!region) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Poppins' }}>Loading map...</Text>
      </View>
    );
  }

  // ====================================================================
  // RENDER
  // ====================================================================
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* MAP */}
        <MapComponent
          mapRef={mapRef}
          region={region}
          onRegionChangeComplete={setDraggedRegion}
          fromLocation={fromLocation}
          toLocation={toLocation}
          routeCoords={routeCoords}
          selectingLocation={selectingLocation}
          driverLocation={driverLocation}
          showDriverRoute={showDriverRoute}
          passengerPickedUp={passengerPickedUp}
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
          onDriverLocationChange={setDriverLocation}
          onDriverRouteChange={setShowDriverRoute}
          onBookingAccepted={setIsBookingAccepted}
          onPassengerPickedUp={setPassengerPickedUp}
        />

        {/* BUTTONS */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/user/notification')}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.locationButton,
            {
              bottom: isBookingAccepted
                ? 220  // Driver on the way bar (approx 180 + margin)
                : selectingLocation
                  ? 200 // Pin selection mode
                  : 160 // Search bar (80 + 55 + margin)
            }
          ]}
          onPress={centerOnLocation}
        >
          <Ionicons name="locate" size={24} color="#534889" />
        </TouchableOpacity>

        {/* LOCATION PERMISSION MODAL */}
        <CustomModal
          visible={permissionModalVisible}
          title="Enable Location Access"
          message="SabayTa needs access to your location to connect you with nearby drivers and track your rides in real-time. Please allow location access to ensure a seamless and safe experience."
          variant="twoButtons"
          buttonText="Allow"
          secondaryButtonText="Deny"
          onClose={handleAllowPermission}
          onSecondaryPress={handleDenyPermission}
        />

        {/* STUDENT VERIFICATION BLOCK MODAL */}
        <VerificationBlockModal
          visible={showVerificationModal && !isCheckingVerification}
          verificationStatus={verificationStatus}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#534889',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
