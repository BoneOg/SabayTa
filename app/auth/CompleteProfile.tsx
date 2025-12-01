import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from "../../config"; // Ensure this is your config file

export default function CompleteProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    mobile: '',
    email: '',
    street: '',
    city: '',
    district: '',
  });
  const [isLoading, setIsLoading] = useState(false); // For save button loading

  // Fetch user data from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setProfile(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            mobile: user.phone ? user.phone.replace('+63', '') : '', // Remove +63 for display
          }));
        } else {
          Alert.alert('Error', 'No user data found. Please sign up first.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };
    fetchUserData();
  }, []);

  // Handle saving profile to backend
  const handleSave = async () => {
    // Client-side validation
    if (!profile.name || !profile.email || !profile.mobile || !profile.street || !profile.city || !profile.district) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found. Please log in.');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: `+63${profile.mobile}`, // Prepend +63 for backend
          street: profile.street,
          city: profile.city,
          district: profile.district,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        router.push('/auth/Login'); // Navigate after save
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection.');
      console.error('Save profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Profile</Text>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          {/* If you want to allow changing the profile pic, add logic here */}
          <Entypo name="camera" size={20} color="#534889" style={styles.cameraIcon} />
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#D0D0D0"
        value={profile.name}
        onChangeText={txt => setProfile(p => ({ ...p, name: txt }))}
      />
      <View style={styles.rowInput}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCode}>+63</Text>
        </View>
        <TextInput
          style={[styles.input, styles.mobileInput]}
          placeholder="Your mobile number"
          placeholderTextColor="#D0D0D0"
          keyboardType="phone-pad"
          value={profile.mobile}
          onChangeText={txt => setProfile(p => ({ ...p, mobile: txt }))}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#D0D0D0"
        keyboardType="email-address"
        value={profile.email}
        onChangeText={txt => setProfile(p => ({ ...p, email: txt }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Street"
        placeholderTextColor="#D0D0D0"
        value={profile.street}
        onChangeText={txt => setProfile(p => ({ ...p, street: txt }))}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#D0D0D0"
        value={profile.city}
        onChangeText={txt => setProfile(p => ({ ...p, city: txt }))}
      />
      <TextInput
        style={styles.input}
        placeholder="District"
        placeholderTextColor="#D0D0D0"
        value={profile.district}
        onChangeText={txt => setProfile(p => ({ ...p, district: txt }))}
      />

      <View style={styles.buttonRow}>
        <Button
          label="Cancel"
          variant="outline"
          style={styles.halfButton}
          onPress={() => router.back()}
        />
        <Button
          label={isLoading ? "Saving..." : "Save"}
          style={styles.halfButton}
          onPress={handleSave}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  title: { fontFamily: 'Poppins', fontSize: 22, color: '#414141', fontWeight: '600', marginBottom: 4, marginTop: 4, textAlign: 'center' },
  avatarWrapper: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, backgroundColor: '#D0D0D0', borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { position: 'absolute', bottom: -10, right: 0 },
  input: {
    fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1,
    borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6,
    paddingVertical: 12, paddingHorizontal: 14, marginVertical: 7,
  },
  rowInput: { flexDirection: 'row', alignItems: 'center', marginVertical: 7 },
  countryCodeBox: { borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 10, marginRight: 8, backgroundColor: '#fff' },
  countryCode: { fontFamily: 'Poppins', color: '#414141', fontSize: 15 },
  mobileInput: { flex: 1, marginLeft: 0 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  halfButton: { flex: 1 },
});
