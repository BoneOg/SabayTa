import { Poppins_400Regular, useFonts } from "@expo-google-fonts/poppins";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const { height } = Dimensions.get("window");

interface User {
  id: number;
  name: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  pickupCoords?: { latitude: number; longitude: number };
}

export default function DriverHome() {
  const [driverLocation, setDriverLocation] = useState({
    latitude: 8.4590,
    longitude: 124.6322,
  });

  const [showUsers, setShowUsers] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[] | null
  >(null);

  const slideAnim = useRef(new Animated.Value(height)).current;

  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Alice",
      pickup: "CDO City Hall",
      destination: "USTP",
      date: "Nov 28, 2025",
      time: "8:00 AM",
      pickupCoords: { latitude: 8.4545, longitude: 124.6312 },
    },
    {
      id: 2,
      name: "Bob",
      pickup: "SM CDO",
      destination: "Agora",
      date: "Nov 28, 2025",
      time: "10:00 AM",
      pickupCoords: { latitude: 8.4853, longitude: 124.6489 },
    },
    {
      id: 3,
      name: "Charlie",
      pickup: "Bulua",
      destination: "Gusa",
      date: "Nov 28, 2025",
      time: "11:00 AM",
      pickupCoords: { latitude: 8.4780, longitude: 124.6350 },
    },
  ]);

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

  const handleStart = () => {
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

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    handleCloseUsers();

    if (user.pickupCoords) {
      setRouteCoordinates([driverLocation, user.pickupCoords]);
    } else {
      Alert.alert("Error", "Pickup coordinates not available.");
    }
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
              strokeColor="pink"
              strokeWidth={4}
            />
            {/* Marker at the end of the path */}
            <Marker
              coordinate={routeCoordinates[routeCoordinates.length - 1]}
              title="Pickup Location"
            >
              <FontAwesome6 name="location-dot" size={28} color="white" />
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

      {/* 25% Modal with tap outside to close */}
      {showModal && (
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity activeOpacity={1} style={styles.modal25}>
              <Ionicons
                name="person-circle"
                size={60}
                color="#622C9B"
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.modalText}>Fetch a User</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleStart}>
                <Text style={styles.modalButtonText}>Start</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Slide-up Users */}
      {showUsers && (
        <Animated.View
          style={[styles.usersContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.usersHeader}>
            <Text style={styles.usersHeaderText}>Booked Users</Text>
            <TouchableOpacity onPress={handleCloseUsers} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {users.map((user) => (
              <TouchableOpacity key={user.id} onPress={() => handleUserSelect(user)}>
                <View style={styles.userCard}>
                  <Text style={styles.name}>{user.name}</Text>

                  {/* Date and Time */}
                  <View style={styles.row}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#555"
                      style={styles.icon}
                    />
                    <Text style={styles.dateTime}>
                      {user.date} at {user.time}
                    </Text>
                  </View>

                  {/* Locations */}
                  <View style={styles.locationContainer}>
                    <View style={styles.locationRow}>
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="green"
                        style={styles.locationIcon}
                      />
                      <View>
                        <Text style={styles.locationLabel}>From</Text>
                        <Text style={styles.locationText}>{user.pickup}</Text>
                      </View>
                    </View>

                    <View style={styles.locationRow}>
                      <Ionicons
                        name="location-sharp"
                        size={20}
                        color="red"
                        style={styles.locationIcon}
                      />
                      <View>
                        <Text style={styles.locationLabel}>To</Text>
                        <Text style={styles.locationText}>{user.destination}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
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
    backgroundColor: "#622C9B",
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
  modal25: {
    width: "100%",
    height: height * 0.25,
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
  },
  modalText: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular,",
    color: "#622C9B",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#622C9B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontFamily: "Poppins_400Regular,",
    fontSize: 16,
  },
  usersContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: "#f2f2f2",
    zIndex: 20,
    elevation: 10,
    justifyContent: "center",
  },
  usersHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: "relative",
  },
  usersHeaderText: {
    fontSize: 20,
    fontFamily: "Poppins_400Regular,",
    color: "#060606ff",
    marginTop: 10,
  },
  scrollContainer: { padding: 15, paddingBottom: 50, alignItems: "center" },
  userCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#6A4C93",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: { position: "absolute", right: 20 },
  name: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular,",
    color: "#333",
    marginBottom: 8,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  icon: { marginRight: 6 },
  dateTime: { fontSize: 14, fontFamily: "Poppins_400Regular", color: "#666" },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  locationRow: { flexDirection: "row", alignItems: "flex-start", width: "48%" },
  locationIcon: { marginRight: 8, marginTop: 2 },
  locationLabel: { fontSize: 12, fontFamily: "Poppins_400Regular", color: "#888" },
  locationText: { fontSize: 14, fontFamily: "Poppins_400Regular,", color: "#333" },
});
