import ProfileHeader from '@/components/ProfileHeader';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const AboutUsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ProfileHeader onBack={() => router.back()} title="About Us" />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.bodyText}>
          SabayTa is a student-centered ride-sharing platform created by USTP students for the USTP
          community. It aims to provide a safe, affordable, and convenient commuting solution by
          connecting students who own motorcycles with those who need a ride. Through this system,
          students can share gas expenses, reduce travel costs, and promote sustainability on and off
          campus.
        </Text>
        <Text style={styles.bodyText}>
          Our mission is to make daily commuting easier and more reliable for every USTP student. We
          believe that by working together, we can transform everyday rides into opportunities for
          connection, collaboration, and care for the environment.
        </Text>
        <Text style={styles.bodyText}>
          With features like Offer a Ride and Find a Ride, SabayTa empowers students to travel
          efficiently while building a sense of community. Whether you're a driver willing to help
          others or a passenger looking for a safe ride, SabayTa makes every trip worthwhile because
          in USTP, no student rides alone.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 20 : 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#3C3C3C',
    fontFamily: 'Poppins',
    marginBottom: 18,
  },
});

export default AboutUsScreen;

