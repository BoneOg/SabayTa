import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter, useSegments } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DriverLayout() {
    const router = useRouter();
    const segments = useSegments();
    const currentRoute = segments[segments.length - 1] || "home";

    const isActive = (routeName: string) => currentRoute === routeName;

    const hiddenRoutes = new Set([
        "notification",
    ]);
    const shouldShowTabBar = !hiddenRoutes.has(currentRoute);

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <Slot />

            {/* Bottom Tabs */}
            {shouldShowTabBar && (
                <View style={styles.tabBarWrapper}>
                    <View style={styles.tabBar}>
                        {/* Home */}
                        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/driver/home")}>
                            <Ionicons name="home" size={22} color={isActive("home") ? "#534889" : "#B8B8B8"} />
                            <Text numberOfLines={1} style={[styles.tabLabel, { color: isActive("home") ? "#534889" : "#B8B8B8" }]}>
                                Home
                            </Text>
                        </TouchableOpacity>

                        {/* History */}
                        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/driver/history")}>
                            <Ionicons
                                name="time"
                                size={22}
                                color={isActive("history") ? "#534889" : "#B8B8B8"}
                            />
                            <Text numberOfLines={1} style={[styles.tabLabel, { color: isActive("history") ? "#534889" : "#B8B8B8" }]}>
                                History
                            </Text>
                        </TouchableOpacity>

                        {/* Profile */}
                        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/driver/profile")}>
                            <Ionicons
                                name="person"
                                size={22}
                                color={isActive("profile") ? "#534889" : "#B8B8B8"}
                            />
                            <Text numberOfLines={1} style={[styles.tabLabel, { color: isActive("profile") ? "#534889" : "#B8B8B8" }]}>
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
        zIndex: 50,
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
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 2,
    },
    tabLabel: {
        fontSize: 10,
        fontFamily: "Poppins",
        marginTop: 4,
        textAlign: "center",
        width: '100%',
    },
});
