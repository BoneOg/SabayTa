import { Poppins_400Regular, useFonts } from "@expo-google-fonts/poppins";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, StyleSheet, View } from "react-native";
import DriverConfirmation from "../../components/driver/DriverConfirmation";
import { DriverHeader } from "../../components/driver/DriverHeader";
import { DriverMapView } from "../../components/driver/DriverMapView";
import { FetchUserModal } from "../../components/driver/FetchUserModal";
import { useBookingManager } from "../../components/driver/hooks/useBookingManager";
import { useDriverLocation } from "../../components/driver/hooks/useDriverLocation";
import { useRouteCalculator } from "../../components/driver/hooks/useRouteCalculator";
import OnTheWay from "../../components/driver/OnTheWay";
import { BASE_URL } from "../../config";
import ChooseBookedRider from "./booked/choose_booked_rider";
import DriverChatScreen from "./chat";

const { height } = Dimensions.get("window");

export default function DriverHome() {
  // Custom Hooks
  const driverLocation = useDriverLocation();
  const driverLocationRef = useRef(driverLocation);

  // Update ref when location changes
  useEffect(() => {
    driverLocationRef.current = driverLocation;
  }, [driverLocation]);

  const { routeCoordinates, distance, duration, fetchRoute, clearRoute } = useRouteCalculator();
  const { users, selectedUser, setSelectedUser, fetchBookings, acceptBooking } = useBookingManager();

  // UI State
  const [showUsers, setShowUsers] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOnTheWay, setShowOnTheWay] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(height)).current;
  const modalSlideAnim = useRef(new Animated.Value(height * 0.3)).current;

  // Fonts
  const [fontsLoaded] = useFonts({ Poppins_400Regular });

  // Restore active booking on mount
  useEffect(() => {
    const restoreActiveBooking = async () => {
      try {
        const activeDriverBookingStr = await AsyncStorage.getItem('activeDriverBooking');
        if (activeDriverBookingStr) {
          const activeBooking = JSON.parse(activeDriverBookingStr);
          console.log('📦 Restoring driver booking:', activeBooking);

          if (activeBooking.selectedUser) setSelectedUser(activeBooking.selectedUser);
          if (activeBooking.showOnTheWay) {
            setShowOnTheWay(true);
            setShowModal(false);
            // Restore route
            if (activeBooking.selectedUser?.pickupCoords) {
              fetchRoute(driverLocation, activeBooking.selectedUser.pickupCoords);
            }
          }
        }
      } catch (error) {
        console.error('Error restoring driver booking:', error);
      }
    };

    restoreActiveBooking();
  }, []);

  // Save booking state whenever it changes
  useEffect(() => {
    const saveBookingState = async () => {
      if (showOnTheWay && selectedUser) {
        const bookingState = {
          selectedUser,
          showOnTheWay,
        };
        await AsyncStorage.setItem('activeDriverBooking', JSON.stringify(bookingState));
        console.log('💾 Saved driver booking state');
      } else {
        await AsyncStorage.removeItem('activeDriverBooking');
      }
    };

    saveBookingState();
  }, [showOnTheWay, selectedUser]);

  // Sync driver location to backend when OnTheWay (Accepted)
  useEffect(() => {
    let intervalId: any;

    const syncLocation = async () => {
      // Ensure we have a selected user (booking) and we are On The Way
      if (!selectedUser || !showOnTheWay) return;

      try {
        const loc = driverLocationRef.current;
        await fetch(`${BASE_URL}/api/bookings/${selectedUser.id}/location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: loc.latitude,
            longitude: loc.longitude
          })
        });
        console.log("📍 Synced driver location to backend");
      } catch (err) {
        console.error("Failed to sync location:", err);
      }
    };

    if (showOnTheWay && selectedUser) {
      // Initial sync
      syncLocation();

      // Periodic sync every 10s
      intervalId = setInterval(syncLocation, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showOnTheWay, selectedUser]);

  // Show modal on screen focus
  useFocusEffect(
    useCallback(() => {
      // Only show modal if not on an active booking
      if (!showOnTheWay) {
        setShowModal(true);
        modalSlideAnim.setValue(height * 0.3);
        Animated.timing(modalSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
      return () => {
        // Optional: cleanup if needed when losing focus
      };
    }, [showOnTheWay])
  );

  // Handlers
  const handleStart = () => {
    fetchBookings();
    setShowModal(false);
    setShowUsers(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseUsers = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setShowUsers(false));
  };

  const handleUserSelect = (user: any) => {
    console.log("👤 User selected:", user.name);
    console.log("📍 Pickup coordinates:", user.pickupCoords);
    console.log("🎯 Destination coordinates:", user.destinationCoords);

    setSelectedUser(user);
    handleCloseUsers();

    if (user.pickupCoords && user.destinationCoords) {
      console.log("🚗 Fetching route from user's pickup to destination");
      fetchRoute(user.pickupCoords, user.destinationCoords);
      // Show confirmation modal after route is displayed
      setTimeout(() => setShowConfirmModal(true), 500);
    } else {
      console.log("❌ Missing pickup or destination coordinates for user");
      Alert.alert("Error", "Pickup or destination coordinates not available.");
    }
  };

  const handleAcceptBooking = async () => {
    if (!selectedUser) return;

    console.log("✅ Accepting booking for:", selectedUser?.name);
    setShowConfirmModal(false);

    const success = await acceptBooking(selectedUser.id, driverLocation);

    if (success) {
      console.log("✅ Booking accepted! Updating route to show driver → user pickup location");
      // Update route to show driver's current location to user's pickup location
      if (selectedUser.pickupCoords) {
        fetchRoute(driverLocation, selectedUser.pickupCoords);
      }
      setShowOnTheWay(true);
    }
  };

  const handleCancelOnTheWay = async () => {
    console.log("❌ Cancelled on the way");
    setShowOnTheWay(false);
    setSelectedUser(null);
    clearRoute();
    await AsyncStorage.removeItem('activeDriverBooking'); // Clear saved booking
  };

  const handlePickedUp = async () => {
    console.log("✅ Rider picked up");
    setShowOnTheWay(false);
    await AsyncStorage.removeItem('activeDriverBooking'); // Clear saved booking
  };


  const handleCancelBooking = () => {
    console.log("❌ Booking cancelled");
    setShowConfirmModal(false);
    setSelectedUser(null);
    clearRoute();
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <DriverMapView
        driverLocation={driverLocation}
        routeCoordinates={routeCoordinates}
        onTheWay={showOnTheWay}
      />

      {/* Header */}
      <DriverHeader />

      {/* Fetch User Modal */}
      <FetchUserModal
        visible={showModal}
        slideAnim={modalSlideAnim}
        onClose={() => setShowModal(false)}
        onStart={handleStart}
      />

      {/* Slide-up Users */}
      <ChooseBookedRider
        users={users}
        showUsers={showUsers}
        slideAnim={slideAnim}
        onClose={handleCloseUsers}
        onUserSelect={handleUserSelect}
      />

      {/* Confirmation Modal */}
      <DriverConfirmation
        visible={showConfirmModal}
        selectedUser={selectedUser}
        distance={distance}
        duration={duration}
        onAccept={handleAcceptBooking}
        onCancel={handleCancelBooking}
      />

      {/* On The Way Modal */}
      {showOnTheWay && (
        <OnTheWay
          visible={showOnTheWay}
          riderName={selectedUser?.name || "Rider"}
          distance={distance}
          duration={duration}
          onCancel={handleCancelOnTheWay}
          onPickedUp={handlePickedUp}
          onChatPress={() => setShowChat(true)}
        />
      )}

      {/* Chat Screen */}
      {showChat && (
        <DriverChatScreen onClose={() => setShowChat(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
