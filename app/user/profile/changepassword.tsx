import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackButton from '../../../components/BackButton';

const ChangePassword = () => {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [oldVisible, setOldVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Disable save button if any field is empty OR new password != confirm password
  const isSaveDisabled = useMemo(
    () =>
      !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword,
    [oldPassword, newPassword, confirmPassword]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <BackButton style={{ marginBottom: 0 }} />

          <Text style={styles.title}>Change Password</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          {/* Old Password */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!oldVisible}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity onPress={() => setOldVisible(!oldVisible)}>
              <Ionicons
                name={oldVisible ? "eye" : "eye-off"}
                size={20}
                color="#534889"
              />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!newVisible}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setNewVisible(!newVisible)}>
              <Ionicons
                name={newVisible ? "eye" : "eye-off"}
                size={20}
                color="#534889"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!confirmVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)}>
              <Ionicons
                name={confirmVisible ? "eye" : "eye-off"}
                size={20}
                color="#534889"
              />
            </TouchableOpacity>
          </View>

          {/* Warning if new & confirm passwords do not match */}
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <Text style={styles.passwordWarningText}>Passwords do not match</Text>
          )}

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaveDisabled && styles.buttonDisabled]}
            disabled={isSaveDisabled}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },

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

  form: {
    marginTop: 10,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    marginVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
    paddingVertical: 16,
  },

  saveButton: {
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  passwordWarningText: {
    color: '#E35A5A',
    fontFamily: 'Poppins',
    fontSize: 13,
    marginBottom: 24,
    textAlign: 'right',
  },
});

export default ChangePassword;
