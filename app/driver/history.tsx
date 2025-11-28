import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface RideCardProps {
    name: string;
    date: string;
    time: string;
    from: string;
    to: string;
}

const HistoryCard: React.FC<RideCardProps> = ({ name, date, time, from, to }) => {
    return (
        <View style={styles.card}>
            {/* Name */}
            <Text style={styles.name}>{name}</Text>

            {/* Date and Time */}
            <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color="#555" style={styles.icon} />
                <Text style={styles.dateTime}>{date} at {time}</Text>
            </View>

            {/* Locations */}
            <View style={styles.locationContainer}>
                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={20} color="green" style={styles.locationIcon} />
                    <View>
                        <Text style={styles.locationLabel}>From</Text>
                        <Text style={styles.locationText}>{from}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={20} color="red" style={styles.locationIcon} />
                    <View>
                        <Text style={styles.locationLabel}>To</Text>
                        <Text style={styles.locationText}>{to}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default function DriverHistory() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>History</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <HistoryCard
                    name="Gracielle Mieh C. Layam"
                    date="Oct 8, 2025"
                    time="8:00 AM"
                    from="Carmen Orora..."
                    to="USTP"
                />
                <HistoryCard
                    name="Althea L. Navales"
                    date="Oct 8, 2025"
                    time="10:00 AM"
                    from="Bulua Gaisano"
                    to="USTP"
                />
                <HistoryCard
                    name="Rogin U. Lagrosas"
                    date="Oct 8, 2025"
                    time="11:00 AM"
                    from="SNR Bulua"
                    to="USTP"
                />
                <HistoryCard
                    name="Juan Dela Cruz"
                    date="Oct 9, 2025"
                    time="7:30 AM"
                    from="Cogon Market"
                    to="Limketkai Center"
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50, // Status bar spacing
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#534889',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for bottom tab bar
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#6A4C93", // Purple border
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
        marginBottom: 20,
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
