import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  highlighted: boolean;
}

const notifications: { [key: string]: NotificationItem[] } = {
  Today: [
    {
      id: '1',
      title: 'Message Notification:',
      content: "You've received a new message from [User Name].",
      timestamp: '15 min ago.',
      highlighted: true,
    },
    {
      id: '2',
      title: 'System Alert',
      content: 'You can now view your travel history',
      timestamp: '30 min ago.',
      highlighted: false,
    },
  ],
  Yesterday: [
    {
      id: '3',
      title: 'Safety Tips',
      content: "Always confirm your driver's USTP ID before riding.",
      timestamp: '10:00pm',
      highlighted: true,
    },
    {
      id: '4',
      title: 'Ride History Reminder:',
      content: 'Check your ride history to track your shared expenses.',
      timestamp: '7:30 pm',
      highlighted: false,
    },
    {
      id: '5',
      title: 'Ride Safely Reminder:',
      content: 'Always wear your helmet and bring your USTP ID before heading out. Safety first, Iskolar!',
      timestamp: '6:00 pm',
      highlighted: false,
    },
    {
      id: '6',
      title: 'Weather Advisory:',
      content: 'Heads up! Possible rain ahead. Ride carefully and keep safe on the road.',
      timestamp: '3:35 pm',
      highlighted: true,
    },
  ],
};

export default function NotificationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/tabs/home")}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Today Section */}
        <Text style={styles.sectionTitle}>Today</Text>
        {notifications.Today.map((notification) => (
          <View
            key={notification.id}
            style={[
              styles.notificationCard,
              notification.highlighted && styles.notificationCardHighlighted,
            ]}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationContent}>{notification.content}</Text>
            <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
          </View>
        ))}

        {/* Yesterday Section */}
        <Text style={[styles.sectionTitle, styles.sectionTitleMargin]}>Yesterday</Text>
        {notifications.Yesterday.map((notification) => (
          <View
            key={notification.id}
            style={[
              styles.notificationCard,
              notification.highlighted && styles.notificationCardHighlighted,
            ]}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationContent}>{notification.content}</Text>
            <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
    fontFamily: 'Poppins',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    fontFamily: 'Poppins',
  },
  sectionTitleMargin: {
    marginTop: 30,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 6,
  },
  notificationCardHighlighted: {
    backgroundColor: 'rgba(198,185,229,0.5)',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  notificationContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
    fontFamily: 'Poppins',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Poppins',
  },
});

