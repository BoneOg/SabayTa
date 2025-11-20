import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Slot, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Main content */}
      <Slot />

      {/* Bottom Tabs */}
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {/* Home */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/home")}>
            <Ionicons name="home" size={22} color="#534889" />
            <Text style={[styles.tabLabel, { color: "#534889" }]}>Home</Text>
          </TouchableOpacity>

          {/* Favorites */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/favorites")}>
            <Ionicons name="heart-outline" size={22} color="#B8B8B8" />
            <Text style={styles.tabLabel}>Favourite</Text>
          </TouchableOpacity>

          {/* Offer a Ride */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/offer_a_ride")}>
            <FontAwesome name="car" size={21} color="#B8B8B8" />
            <Text style={styles.tabLabel}>Offer a ride</Text>
          </TouchableOpacity>

          {/* History */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/history")}>
            <Ionicons name="time-outline" size={22} color="#B8B8B8" />
            <Text style={styles.tabLabel}>History</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/profile")}>
            <Ionicons name="person-outline" size={22} color="#B8B8B8" />
            <Text style={styles.tabLabel}>Profile</Text>
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
      android: { elevation: 20 }, // maximum elevation on Android
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -8 }, // more vertical shadow
        shadowOpacity: 0.35, // stronger shadow
        shadowRadius: 12, // bigger blur
      },
    }),
  },

  tabBar: {
    flexDirection: "row",
    height: 68,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 20, // only top corners
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
