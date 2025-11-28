import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { height } = Dimensions.get("window");

interface User {
  id: number;
  name: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
}

export default function FetchAUser() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const slideAnim = useRef(new Animated.Value(height)).current; // start off-screen

  useEffect(() => {
    // Example booked users
    setUsers([
      { id: 1, name: "Alice", pickup: "CDO City Hall", destination: "USTP", date: "Nov 28, 2025", time: "8:00 AM" },
      { id: 2, name: "Bob", pickup: "SM CDO", destination: "Agora", date: "Nov 28, 2025", time: "10:00 AM" },
      { id: 3, name: "Charlie", pickup: "Bulua", destination: "Gusa", date: "Nov 28, 2025", time: "11:00 AM" },
    ]);

    // Animate modal slide-up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.back(); // go back to previous page
    });
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
<SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Booked Users</Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.name}>{user.name}</Text>

              {/* Date and Time */}
              <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color="#555" style={styles.icon} />
                <Text style={styles.dateTime}>{user.date} at {user.time}</Text>
              </View>

              {/* Locations */}
              <View style={styles.locationContainer}>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={20} color="green" style={styles.locationIcon} />
                  <View>
                    <Text style={styles.locationLabel}>From</Text>
                    <Text style={styles.locationText}>{user.pickup}</Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={20} color="red" style={styles.locationIcon} />
                  <View>
                    <Text style={styles.locationLabel}>To</Text>
                    <Text style={styles.locationText}>{user.destination}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
 container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: "transparent", // was #fff
    zIndex: 20,
    elevation: 10,
},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#622C9B",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 50,
  },
  userCard: {
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
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 6,
  },
  dateTime: {
    fontSize: 14,
    color: "#666",
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationLabel: {
    fontSize: 12,
    color: "#888",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
