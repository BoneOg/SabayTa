import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
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

export default function UserHistory() {
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
      const response = await fetch(`${BASE_URL}/api/bookings/history/${user._id}`);

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#534889" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No history</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins',
    textAlign: 'center',
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
