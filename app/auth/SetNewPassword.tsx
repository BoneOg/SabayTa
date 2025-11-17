import { MaterialIcons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SetNewPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#414141" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Set New password</Text>
      <Text style={styles.subtitle}>Set your new password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your New Password"
        placeholderTextColor="#D0D0D0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#D0D0D0"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Text style={styles.hint}>Atleast 1 number or a special character</Text>
      <Button label="Save" onPress={() => router.push('/auth/Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 4 },
  backText: { fontFamily: 'Poppins', color: '#414141', fontSize: 17, marginLeft: 2 },
  title: { fontFamily: 'Poppins', fontSize: 22, color: '#414141', fontWeight: '600', marginBottom: 6, marginTop: 4 },
  subtitle: { fontFamily: 'Poppins', fontSize: 15, color: '#B8B8B8', marginBottom: 16 },
  input: {
    fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1,
    borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6,
    paddingVertical: 12, paddingHorizontal: 14, marginVertical: 7,
  },
  hint: { fontFamily: 'Poppins', color: '#B8B8B8', fontSize: 12, marginBottom: 18, marginTop: 2 },
});
