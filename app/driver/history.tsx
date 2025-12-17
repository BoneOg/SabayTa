import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { BASE_URL } from "../../config";

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
            {/* Header with Name and Status */}
            <View style={styles.header}>
                <View style={styles.nameContainer}>
                    <Ionicons name="person-circle-outline" size={20} color="#6A4C93" />
                    <Text style={styles.name}>{name}</Text>
                </View>
                <View style={[styles.statusBadge, status === 'cancelled' ? styles.cancelledBadge : styles.completedBadge]}>
                    <Text style={styles.statusText}>{status === 'cancelled' ? 'Cancelled' : 'Completed'}</Text>
                </View>
            </View>

            {/* Date and Time */}
            <View style={styles.dateTimeContainer}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.dateTimeText}>{date}</Text>
                <View style={styles.dot} />
                <Ionicons name="time-outline" size={14} color="#888" />
                <Text style={styles.dateTimeText}>{time}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Route Section */}
            <View style={styles.routeContainer}>
                {/* From Location */}
                <View style={styles.locationRow}>
                    <View style={styles.iconContainer}>
                        <View style={styles.fromDot} />
                    </View>
                    <View style={styles.locationContent}>
                        <Text style={styles.locationLabel}>Pickup</Text>
                        <Text style={styles.locationText} numberOfLines={2}>{from}</Text>
                    </View>
                </View>

                {/* Connecting Line */}
                <View style={styles.connectingLine} />

                {/* To Location */}
                <View style={styles.locationRow}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="location-sharp" size={20} color="#FF4757" />
                    </View>
                    <View style={styles.locationContent}>
                        <Text style={styles.locationLabel}>Dropoff</Text>
                        <Text style={styles.locationText} numberOfLines={2}>{to}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default function DriverHistory() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) {
                console.error('No user found in storage');
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);
            const response = await fetch(`${BASE_URL}/api/bookings/driver-history/${user._id}`);

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                console.error('Failed to fetch history');
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>Ride History</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6A4C93" />
                    <Text style={styles.loadingText}>Loading history...</Text>
                </View>
            ) : bookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="time-outline" size={64} color="#DDD" />
                    <Text style={styles.emptyTitle}>No Ride History</Text>
                    <Text style={styles.emptySubtitle}>Your completed and cancelled rides will appear here</Text>
                </View>
            ) : (
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {bookings.map((booking) => (
                        <HistoryCard
                            key={booking._id}
                            name={booking.userId?.name || 'Unknown User'}
                            date={formatDate(booking.updatedAt)}
                            time={formatTime(booking.updatedAt)}
                            from={booking.pickupLocation?.name || 'Unknown'}
                            to={booking.dropoffLocation?.name || 'Unknown'}
                            status={booking.status}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    headerBar: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        color: '#1A1A1A',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#888',
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 20,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    cancelledBadge: {
        backgroundColor: "#FF4757",
    },
    completedBadge: {
        backgroundColor: "#2ECC71",
    },
    statusText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#fff",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    dateTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 12,
    },
    dateTimeText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: "#BBB",
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
        marginBottom: 16,
    },
    routeContainer: {
        gap: 0,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    iconContainer: {
        width: 24,
        alignItems: "center",
        paddingTop: 2,
    },
    fromDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#2ECC71",
        borderWidth: 3,
        borderColor: "#A8E6CF",
    },
    connectingLine: {
        width: 2,
        height: 20,
        backgroundColor: "#DDD",
        marginLeft: 11,
        marginVertical: 4,
    },
    locationContent: {
        flex: 1,
        gap: 4,
    },
    locationLabel: {
        fontSize: 11,
        color: "#888",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    locationText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#333",
        lineHeight: 18,
    },
});