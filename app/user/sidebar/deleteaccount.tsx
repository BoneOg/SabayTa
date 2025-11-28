import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1C1B1F" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Delete Account</Text>
          <View style={{ width: 40 }} />
        </View>

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
    </SafeAreaView>
  );
};

export default DeleteAccount;

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
    marginBottom: 20,
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
