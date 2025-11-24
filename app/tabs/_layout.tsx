import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Slot, useRouter, useSegments } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];

  const isActive = (routeName: string) => currentRoute === routeName;
  const shouldShowTabBar = currentRoute !== 'notification';

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <Slot />

      {/* Bottom Tabs */}
      {shouldShowTabBar && (
        <View style={styles.tabBarWrapper}>
          <View style={styles.tabBar}>
            {/* Home */}
            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/home")}>
              <Ionicons name="home" size={22} color={isActive("home") ? "#534889" : "#B8B8B8"} />
              <Text
                style={[styles.tabLabel, { color: isActive("home") ? "#534889" : "#B8B8B8" }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Home
              </Text>
            </TouchableOpacity>

            {/* Favorites */}
            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/favorites")}>
              <MaterialIcons
                name="favorite"
                size={22}
                color={isActive("favorites") ? "#534889" : "#B8B8B8"}
              />
              <Text
                style={[styles.tabLabel, { color: isActive("favorites") ? "#534889" : "#B8B8B8" }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
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
              <Text
                style={[styles.tabLabel, { color: isActive("offer_a_ride") ? "#534889" : "#B8B8B8" }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Offer a ride
              </Text>
            </TouchableOpacity>

            {/* History */}
            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/history")}>
              <Ionicons
                name="time"
                size={22}
                color={isActive("history") ? "#534889" : "#B8B8B8"}
              />
              <Text
                style={[styles.tabLabel, { color: isActive("history") ? "#534889" : "#B8B8B8" }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                History
              </Text>
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/tabs/profile")}>
              <Ionicons
                name="person"
                size={22}
                color={isActive("profile") ? "#534889" : "#B8B8B8"}
              />
              <Text
                style={[styles.tabLabel, { color: isActive("profile") ? "#534889" : "#B8B8B8" }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    height: 70,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 4,
  },

tabItem: {
  flex: 1,
  minWidth: 60,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 6, // increase a bit for spacing
},
tabLabel: {
  fontSize: 10,
  fontFamily: 'Poppins',
  marginTop: 4, // spacing from icon
  textAlign: 'center',
  flexShrink: 1,
  includeFontPadding: false, // ensures Android doesn't add extra padding
  lineHeight: 14, // ensures text fits inside container
},
});
