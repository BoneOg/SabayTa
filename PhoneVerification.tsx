import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PhoneVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (value, idx) => {
    let arr = [...otp];
    arr[idx] = value;
    setOtp(arr);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#414141" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Phone verification</Text>
      <Text style={styles.subtitle}>Enter your OTP code</Text>
      <View style={styles.otpRow}>
        {otp.map((char, idx) => (
          <TextInput
            key={idx}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="number-pad"
            value={char}
            onChangeText={val => handleOtpChange(val, idx)}
          />
        ))}
      </View>
      <Text style={styles.resendContainer}>
        Didn’t receive code?{' '}
        <Text style={styles.resendLink}>Resend again</Text>
      </Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push('/SetPassword')}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 30, marginBottom: 4 },
  backText: { fontFamily: 'Poppins', color: '#414141', fontSize: 17, marginLeft: 2 },
  title: { fontFamily: 'Poppins', fontSize: 22, color: '#414141', fontWeight: '600', marginBottom: 8, marginTop: 4 },
  subtitle: { fontFamily: 'Poppins', fontSize: 15, color: '#B8B8B8', marginBottom: 16 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 10 },
  otpInput: {
    width: 44, height: 44, borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 8,
    textAlign: 'center', fontSize: 18, color: '#414141', fontFamily: 'Poppins', backgroundColor: '#fff'
  },
  resendContainer: { fontFamily: 'Poppins', color: '#B8B8B8', fontSize: 14, marginBottom: 28 },
  resendLink: { color: '#540383', textDecorationLine: 'underline' },
  actionButton: { backgroundColor: '#540383', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontFamily: 'Poppins', fontWeight: '700', fontSize: 16 },
});
