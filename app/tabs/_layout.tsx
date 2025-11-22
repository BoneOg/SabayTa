import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Slot, useRouter, useSegments } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments(); // Get current route segments
  const currentRoute = segments[segments.length - 1]; // last segment is the current tab

  // Helper to determine if tab is active
  const isActive = (routeName: string) => currentRoute === routeName;

  return (
    <View style={styles.container}>
      {/* Main content */}
      <Slot />

      {/* Bottom Tabs */}
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {/* Home */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/home")}>
            <Ionicons
              name="home"
              size={22}
              color={isActive("home") ? "#534889" : "#B8B8B8"}
            />
            <Text style={[styles.tabLabel, { color: isActive("home") ? "#534889" : "#B8B8B8" }]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* Favorites */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/favorites")}>
            <Ionicons
              name="heart-outline"
              size={22}
              color={isActive("favorites") ? "#534889" : "#B8B8B8"}
            />
            <Text style={[styles.tabLabel, { color: isActive("favorites") ? "#534889" : "#B8B8B8" }]}>
              Favourite
            </Text>
          </TouchableOpacity>

          {/* Offer a Ride */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/offer_a_ride")}>
            <FontAwesome
              name="car"
              size={21}
              color={isActive("offer_a_ride") ? "#534889" : "#B8B8B8"}
            />
            <Text style={[styles.tabLabel, { color: isActive("offer_a_ride") ? "#534889" : "#B8B8B8" }]}>
              Offer a ride
            </Text>
          </TouchableOpacity>

          {/* History */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/history")}>
            <Ionicons
              name="time-outline"
              size={22}
              color={isActive("history") ? "#534889" : "#B8B8B8"}
            />
            <Text style={[styles.tabLabel, { color: isActive("history") ? "#534889" : "#B8B8B8" }]}>
              History
            </Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/profile")}>
            <Ionicons
              name="person-outline"
              size={22}
              color={isActive("profile") ? "#534889" : "#B8B8B8"}
            />
            <Text style={[styles.tabLabel, { color: isActive("profile") ? "#534889" : "#B8B8B8" }]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "visible",
    backgroundColor: "transparent",
    ...Platform.select({
      android: { elevation: 20 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
    }),
  },

  tabBar: {
    flexDirection: "row",
    height: 68,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabLabel: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#B8B8B8",
    marginTop: 4,
  },
});
