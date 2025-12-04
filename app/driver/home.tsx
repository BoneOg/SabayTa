import { Poppins_400Regular, useFonts } from "@expo-google-fonts/poppins";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import DriverConfirmation from "../../components/driver_confirmation";
import { BASE_URL } from "../../config";
import ChooseBookedRider from "./booked/choose_booked_rider";

const { height } = Dimensions.get("window");

interface User {
  id: string;
  name: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  distance: string;
  estimatedTime: string;
  pickupCoords?: { latitude: number; longitude: number };
  destinationCoords?: { latitude: number; longitude: number };
}

export default function DriverHome() {
  const [driverLocation, setDriverLocation] = useState({
    latitude: 8.4590,
    longitude: 124.6322,
  });

  const [showUsers, setShowUsers] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[] | null
  >(null);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const modalSlideAnim = useRef(new Animated.Value(height * 0.3)).current;

  const [users, setUsers] = useState<User[]>([]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/bookings/pending`);
      const data = await response.json();

      if (response.ok) {
        const mappedUsers = data.map((booking: any) => ({
          id: booking._id,
          name: booking.userId?.name || "Unknown User",
          pickup: booking.pickupLocation.name,
          destination: booking.dropoffLocation.name,
          date: new Date(booking.createdAt).toLocaleDateString(),
          time: new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          distance: booking.distance,
          estimatedTime: booking.estimatedTime,
          pickupCoords: {
            latitude: booking.pickupLocation.lat,
            longitude: booking.pickupLocation.lon
          },
          destinationCoords: {
            latitude: booking.dropoffLocation.lat,
            longitude: booking.dropoffLocation.lon
          }
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const [fontsLoaded] = useFonts({ Poppins_400Regular });

  useEffect(() => {
    let subscriber: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Allow location access to use this feature"
        );
        return;
      }

      subscriber = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
        (location) => {
          setDriverLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    })();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);

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

  const fetchRoute = async (
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ) => {
    try {
      console.log("🚗 Fetching route from driver to rider...");
      console.log("Driver location:", start);
      console.log("Rider pickup location:", end);

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      console.log("📍 OSRM API Response:", data);

      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map(
          (coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );
        console.log(`✅ Route fetched successfully! ${coordinates.length} points`);
        setRouteCoordinates(coordinates);
      } else {
        console.log("❌ No routes found in response");
        Alert.alert("Error", "No route found.");
      }
    } catch (error) {
      console.error("❌ Error fetching route:", error);
      Alert.alert("Error", "Could not fetch route. Check your internet connection.");
    }
  };

  const handleUserSelect = (user: User) => {
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

  const handleAcceptBooking = () => {
    console.log("✅ Booking accepted for:", selectedUser?.name);
    setShowConfirmModal(false);
    // TODO: Add API call to accept booking
    Alert.alert("Success", `Booking accepted for ${selectedUser?.name}`);
  };

  const handleCancelBooking = () => {
    console.log("❌ Booking cancelled");
    setShowConfirmModal(false);
    setSelectedUser(null);
    setRouteCoordinates(null);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Driver marker */}
        <Marker coordinate={driverLocation} title="Your Location">
          <View style={styles.driverMarker}>
            <Ionicons name="location-sharp" size={24} color="#fff" />
          </View>
        </Marker>

        {/* Draw route if selected */}
        {routeCoordinates && (
          <>
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FF69B4"
              strokeWidth={5}
            />
            {/* Marker at the end of the path */}
            <Marker
              coordinate={routeCoordinates[routeCoordinates.length - 1]}
              title="Destination"
            >
              <View style={[styles.driverMarker, { backgroundColor: "#FF5733" }]}>
                <Ionicons name="location-sharp" size={24} color="#fff" />
              </View>
            </Marker>
          </>
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 30% Modal with tap outside to close */}
      {showModal && (
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modal30,
                { transform: [{ translateY: modalSlideAnim }] }
              ]}
            >
              <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', width: '100%' }}>
                <FontAwesome5
                  name="user-alt"
                  size={35}
                  color="#534889"
                  style={{ marginBottom: 10 }}
                />

                <Text style={styles.modalText}>Fetch a User</Text>

                <Text style={styles.modalSubText}>
                  Discover passengers waiting for a ride nearby.
                </Text>


                <TouchableOpacity style={styles.modalButton} onPress={handleStart}>
                  <Text style={styles.modalButtonText}>Start</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Slide-up Users */}
      <ChooseBookedRider
        users={users}
        showUsers={showUsers}
        slideAnim={slideAnim}
        onClose={handleCloseUsers}
        onUserSelect={handleUserSelect}
      />

      {/* Confirmation Modal - Overlay on Map */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
  menuButton: { padding: 8, backgroundColor: "#6A4C93AA", borderRadius: 8 },
  notificationButton: { padding: 8, backgroundColor: "#6A4C93AA", borderRadius: 8 },
  driverMarker: {
    backgroundColor: "#534889",
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    zIndex: 15,
  },
  modal30: {
    width: "100%",
    height: height * 0.35,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 70,
  },
  modalText: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular,",
    color: "#534889",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#534889",
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontFamily: "Poppins_400Regular,",
    fontSize: 16,
  },
  modalSubText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    marginBottom: 12,
    textAlign: "center",
  },
  // Confirmation Modal Styles
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  confirmModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmIconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  confirmTitle: {
    fontSize: 22,
    fontFamily: "Poppins_400Regular",
    fontWeight: "600",
    color: "#534889",
    textAlign: "center",
    marginBottom: 20,
  },
  confirmContent: {
    marginBottom: 20,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    marginBottom: 15,
  },
  confirmLabel: {
    fontWeight: "600",
    color: "#333",
  },
  confirmValue: {
    color: "#534889",
    fontWeight: "500",
  },
  confirmLocationContainer: {
    marginBottom: 12,
  },
  confirmLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  confirmLocationLabel: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    fontWeight: "600",
    color: "#666",
    marginLeft: 6,
  },
  confirmLocationText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    paddingLeft: 22,
    lineHeight: 20,
  },
  confirmSubText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  acceptBtn: {
    backgroundColor: "#534889",
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    fontWeight: "500",
  },
  acceptBtnText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#fff",
    fontWeight: "600",
  },
});
