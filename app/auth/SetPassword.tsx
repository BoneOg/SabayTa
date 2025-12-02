import Button from '@/components/Button';
import BackButton from '@/components/ui/BackButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Set password</Text>
      <Text style={styles.subtitle}>Set your password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Password"
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
      <Button label="Register" onPress={() => router.push('/auth/CompleteProfile')} />
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
  title: { fontFamily: 'Poppins', fontSize: 22, color: '#414141', fontWeight: '600', marginBottom: 6, marginTop: 4 },
  subtitle: { fontFamily: 'Poppins', fontSize: 15, color: '#B8B8B8', marginBottom: 16 },
  input: {
    fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1,
    borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6,
    paddingVertical: 12, paddingHorizontal: 14, marginVertical: 7,
  },
  hint: { fontFamily: 'Poppins', color: '#B8B8B8', fontSize: 12, marginBottom: 18, marginTop: 2 },
});
