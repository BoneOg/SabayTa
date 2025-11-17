import React, { useState } from 'react';
import Button from '@/components/Button';
import { View, Text, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#414141" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
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
          label="Save"
          style={styles.halfButton}
          onPress={() => router.push('/auth/Login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 30, marginBottom: 4 },
  backText: { fontFamily: 'Poppins', color: '#414141', fontSize: 17, marginLeft: 2 },
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
