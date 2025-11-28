import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface RideCardProps {
    name: string;
    date: string;
    time: string;
    from: string;
    to: string;
    status: 'cancelled' | 'completed';
}

const HistoryCard: React.FC<RideCardProps> = ({ name, date, time, from, to, status }) => {
    return (
        <View style={styles.card}>
            {/* Name and Status */}
            <View style={styles.nameRow}>
                <Text style={styles.name}>{name}</Text>
                <View style={[styles.statusBadge, status === 'cancelled' ? styles.cancelledBadge : styles.completedBadge]}>
                    <Text style={styles.statusText}>{status === 'cancelled' ? 'Cancelled' : 'Completed'}</Text>
                </View>
            </View>

            {/* Date and Time */}
            <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color="#555" style={styles.icon} />
                <Text style={styles.dateTime}>{date} at {time}</Text>
            </View>

            {/* Locations - Stacked Vertically */}
            <View style={styles.locationContainer}>
                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={18} color="green" style={styles.locationIcon} />
                    <View style={styles.locationTextContainer}>
                        <Text style={styles.locationLabel}>From</Text>
                        <Text style={styles.locationText}>{from}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={18} color="red" style={styles.locationIcon} />
                    <View style={styles.locationTextContainer}>
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
                    status="completed"
                />
                <HistoryCard
                    name="Althea L. Navales"
                    date="Oct 8, 2025"
                    time="10:00 AM"
                    from="Bulua Gaisano"
                    to="USTP"
                    status="cancelled"
                />
                <HistoryCard
                    name="Rogin U. Lagrosas"
                    date="Oct 8, 2025"
                    time="11:00 AM"
                    from="SNR Bulua"
                    to="USTP"
                    status="completed"
                />
                <HistoryCard
                    name="Juan Dela Cruz"
                    date="Oct 9, 2025"
                    time="7:30 AM"
                    from="Cogon Market"
                    to="Limketkai Center"
                    status="cancelled"
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
        padding: 14,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "#6A4C93", // Purple border
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    cancelledBadge: {
        backgroundColor: "#FF4747",
    },
    completedBadge: {
        backgroundColor: "#41B341",
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#fff",
        textTransform: "capitalize",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    icon: {
        marginRight: 6,
    },
    dateTime: {
        fontSize: 13,
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
        marginTop: 1,
    },
    locationTextContainer: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 11,
        color: "#888",
        marginBottom: 1,
    },
    locationText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#333",
    },
});
