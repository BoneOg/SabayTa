import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HelpAndSupportScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1C1B1F" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Help and Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.sectionTitle}>Need help?</Text>
        <Text style={styles.bodyText}>
          Need help? We’ve got you covered! SabayTa is here to make your ride-sharing experience smooth
          and safe.
        </Text>

        <Text style={styles.sectionTitle}>Booking Tips</Text>
        <Text style={styles.bodyText}>
          To book a ride, go to the Find a Ride tab, choose your destination, and tap Confirm Ride. To
          offer a ride, open the Offer a Ride tab, fill in your trip details, and post it for others to
          join.
        </Text>

        <Text style={styles.sectionTitle}>If something goes wrong</Text>
        <Text style={styles.bodyText}>
          If your driver doesn’t arrive on time, try contacting them via Message or Call Driver. If
          there’s no response, you can cancel and find another ride. For issues or safety concerns, go
          to Help & Support → Report an Issue, and our team will assist you. You can also edit or cancel
          your active rides under My Rides.
        </Text>

        <Text style={styles.sectionTitle}>Need to reach us?</Text>
        <Text style={styles.bodyText}>
          For further assistance, email us at support@sabayta.com or call (+63) 917 555 1234, available
          Monday–Saturday, 8:00 AM–6:00 PM.
        </Text>

        <Text style={styles.sectionTitle}>Ride safely</Text>
        <Text style={styles.bodyText}>
          Your safety matters to us. Always confirm your driver’s USTP ID, wear your helmet, and ride
          responsibly. Together, let’s make every SabayTa ride safe and reliable!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#1C1B1F',
    fontFamily: 'Poppins',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1B1F',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1B1F',
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#3C3C3C',
    fontFamily: 'Poppins',
    marginBottom: 18,
  },
});

export default HelpAndSupportScreen;

