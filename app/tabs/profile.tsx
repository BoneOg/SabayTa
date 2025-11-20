import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  return (
    <View style={styles.container}>
      {/* Header - Fixed at the top */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuContainer}>
          <MaterialIcons name="menu" size={30} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Centered Content */}
        <View style={styles.centeredContent}>
          {/* Profile Image */}
          <Image
            source={require('@/assets/images/cat5.jpg')}
            style={styles.profileImage}
          />

          {/* Name */}
          <Text style={styles.name}>{name}</Text>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#D0D0D0"
            keyboardType="email-address"
          />

          {/* Mobile Input with Philippine Flag */}
          <View style={styles.rowInput}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.countryCode}>🇵🇭 +63</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              placeholderTextColor="#D0D0D0"
              keyboardType="phone-pad"
            />
          </View>

          {/* Gender Input */}
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder="Gender"
            placeholderTextColor="#D0D0D0"
          />

          {/* Address Input */}
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            placeholderTextColor="#D0D0D0"
            multiline
          />

          {/* Log Out Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push('/auth/Login')}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: Platform.OS === 'android' ? 20 : 20  // Reduced padding for status bar to make header appear more at the top
  },

header: {
  height: 60,
  justifyContent: 'center', // vertically center the text
  alignItems: 'center',     // horizontally center the text
  position: 'relative',
},
  menuContainer: {
    position: 'absolute',
    left: 20,
    transform: [{ translateY: -22 }],  // Center vertically (half of height 44)
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(198,185,229,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
  },
headerTitle: {
  fontSize: 24,
  color: '#000000',
  fontFamily: 'Poppins',
},

  scrollContainer: {
    flexGrow: 1,
  },

  centeredContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#D0D0D0',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Poppins',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#414141',
    backgroundColor: '#F8F8F8',
    fontFamily: 'Poppins',
    marginBottom: 15,
  },

  // Mobile input row
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },

  countryCodeBox: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },

  countryCode: {
    fontFamily: 'Poppins',
    color: '#414141',
    fontSize: 15,
  },

  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#414141',
    backgroundColor: '#F8F8F8',
    fontFamily: 'Poppins',
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#622C9B',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },

  logoutText: {
    color: '#622C9B',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});
