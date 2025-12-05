import ProfileHeader from '@/components/ProfileHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const options = ['Change Password', 'Privacy Policy', 'Contact Us', 'Delete Account'];

const SettingsScreen = () => {
  const router = useRouter();

  const handlePress = (label: string) => {
    if (label === 'Change Password') {
      router.push('/user/profile/changepassword');
    }
    else if (label === 'Privacy Policy') {
      router.push('/user/profile/privacypolicy');
    }
    else if (label === 'Contact Us') {
      router.push('/user/profile/contactus');
    }
    else if (label === 'Delete Account') {
      router.push('/user/profile/deleteaccount');
    }
    else {
      Alert.alert(label, `${label} screen coming soon.`);
    }
  };


  return (
    <View style={styles.container}>
      <ProfileHeader onBack={() => router.back()} title="Settings" />

      <View style={styles.content}>

        {options.map((label) => (
          <TouchableOpacity key={label} style={styles.option} onPress={() => handlePress(label)}>
            <Text style={styles.optionText}>{label}</Text>
            <Ionicons name='chevron-forward' size={20} color='#6A1B9A' />
          </TouchableOpacity>
        ))}
      </View>
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
  },
  option: {
    borderWidth: 1,
    borderColor: '#D7C6F4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins',
    color: '#1C1B1F',
  },
});

export default SettingsScreen;

