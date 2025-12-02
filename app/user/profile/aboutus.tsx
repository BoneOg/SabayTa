import BackButton from '@/components/ui/BackButton';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const AboutUsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BackButton style={{ marginBottom: 0 }} />
          <Text style={styles.title}>About Us</Text>
          <View style={{ width: 40 }} />
        </View>

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

  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1B1F',
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

