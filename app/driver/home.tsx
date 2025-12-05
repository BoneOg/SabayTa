import { Poppins_400Regular, useFonts } from "@expo-google-fonts/poppins";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Alert, Animated, Dimensions, StyleSheet, View } from "react-native";
import DriverConfirmation from "../../components/driver/DriverConfirmation";
import { DriverHeader } from "../../components/driver/DriverHeader";
import { DriverMapView } from "../../components/driver/DriverMapView";
import { FetchUserModal } from "../../components/driver/FetchUserModal";
import { useBookingManager } from "../../components/driver/useBookingManager";
import { useDriverLocation } from "../../components/driver/useDriverLocation";
import { useRouteCalculator } from "../../components/driver/useRouteCalculator";
import ChooseBookedRider from "./booked/choose_booked_rider";

const { height } = Dimensions.get("window");

export default function DriverHome() {
  // Custom Hooks
  const driverLocation = useDriverLocation();
  const { routeCoordinates, fetchRoute, clearRoute } = useRouteCalculator();
  const { users, selectedUser, setSelectedUser, fetchBookings, acceptBooking } = useBookingManager();

  // UI State
  const [showUsers, setShowUsers] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(height)).current;
  const modalSlideAnim = useRef(new Animated.Value(height * 0.3)).current;

  // Fonts
  const [fontsLoaded] = useFonts({ Poppins_400Regular });

  // Show modal on screen focus
  useFocusEffect(
    useCallback(() => {
      setShowModal(true);
      modalSlideAnim.setValue(height * 0.3);
      Animated.timing(modalSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
      return () => {
        // Optional: cleanup if needed when losing focus
      };
    }, [])
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

    if (user.destinationCoords) {
      console.log("🚗 Fetching route to DESTINATION (where rider wants to go)");
      fetchRoute(driverLocation, user.destinationCoords);
      // Show confirmation modal after route is displayed
      setTimeout(() => setShowConfirmModal(true), 500);
    } else {
      console.log("❌ No destination coordinates available for user");
      Alert.alert("Error", "Destination coordinates not available.");
    }
  };

const handleAcceptBooking = async () => {
    if (!selectedUser) return;

    console.log("✅ Accepting booking for:", selectedUser?.name);
    setShowConfirmModal(false);

    const success = await acceptBooking(selectedUser.id, driverLocation);

    if (success) {
        console.log("Route stays on map.");
    }
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
        onAccept={handleAcceptBooking}
        onCancel={handleCancelBooking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
