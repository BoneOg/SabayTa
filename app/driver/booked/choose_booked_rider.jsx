import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function ChooseBookedRider({
    users,
    showUsers,
    slideAnim,
    onClose,
    onUserSelect
}) {
    if (!showUsers) return null;

    return (
        <Animated.View
            style={[styles.usersContainer, { transform: [{ translateY: slideAnim }] }]}
        >
            <View style={styles.usersHeader}>
                <Text style={styles.usersHeaderText}>Booked Users</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {users.map((user) => (
                    <TouchableOpacity key={user.id} onPress={() => onUserSelect(user)}>
                        <View style={styles.userCard}>
                            <Ionicons name="person" size={40} color="#534889" style={styles.userIcon} />
                            <View style={styles.cardContent}>
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

                                {/* Locations - Vertical Layout */}
                                <View style={styles.locationContainer}>
                                    <View style={styles.locationRowVertical}>
                                        <View style={styles.locationHeader}>
                                            <Ionicons
                                                name="location-sharp"
                                                size={18}
                                                color="green"
                                                style={styles.locationIcon}
                                            />
                                            <Text style={styles.locationLabel}>From</Text>
                                        </View>
                                        <Text style={styles.locationText} numberOfLines={2} ellipsizeMode="tail">{user.pickup}</Text>
                                    </View>

                                    <View style={styles.dividerLine} />

                                    <View style={styles.locationRowVertical}>
                                        <View style={styles.locationHeader}>
                                            <Ionicons
                                                name="location-sharp"
                                                size={18}
                                                color="red"
                                                style={styles.locationIcon}
                                            />
                                            <Text style={styles.locationLabel}>To</Text>
                                        </View>
                                        <Text style={styles.locationText} numberOfLines={2} ellipsizeMode="tail">{user.destination}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    usersContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#ffffffff",
        zIndex: 20,
        elevation: 10,
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
    scrollContainer: {
        padding: 15,
        paddingBottom: 50,
        alignItems: "center"
    },
    userCard: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#ffffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 10,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 80,
    },
    userIcon: {
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    closeButton: {
        position: "absolute",
        right: 20
    },
    name: {
        fontSize: 18,
        fontFamily: "Poppins_400Regular",
        color: "#333",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15
    },
    icon: {
        marginRight: 6
    },
    dateTime: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#666"
    },
    locationContainer: {
        marginBottom: 5,
    },
    locationRowVertical: {
        marginBottom: 10,
    },
    locationHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    locationIcon: {
        marginRight: 6
    },
    locationLabel: {
        fontSize: 13,
        fontFamily: "Poppins_400Regular",
        color: "#888",
        fontWeight: "600",
    },
    locationText: {
        fontSize: 13,
        fontFamily: "Poppins_400Regular,",
        color: "#333",
        lineHeight: 18,
        paddingLeft: 24,
    },
    dividerLine: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 8,
    },
});
