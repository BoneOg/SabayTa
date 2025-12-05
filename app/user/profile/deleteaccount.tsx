import ProfileHeader from '@/components/ProfileHeader';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const DeleteAccount = () => {
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Account deletion is not available in preview mode.'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ProfileHeader onBack={() => router.back()} title="Delete Account" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Body Text */}
        <Text style={styles.bodyText}>
          Are you sure you want to delete your account? Please review how this action will affect your profile.
        </Text>

        <Text style={styles.bodyText}>
          Deleting your account will remove all your personal information from our database.
          Your email address will be permanently reserved and cannot be used to create a new
          SabayTa account.
        </Text>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} activeOpacity={0.9} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default DeleteAccount;

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
    fontSize: 16,
    lineHeight: 22,
    color: '#3C3C3C',
    fontFamily: 'Poppins',
    marginBottom: 18,
  },
  deleteButton: {
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});
