import Button from '@/components/Button';
import BackButton from '@/components/ui/BackButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PhoneVerificationLogin() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (value: string, idx: number) => {
    let arr = [...otp];
    arr[idx] = value;
    setOtp(arr);
  };

  return (
    <View style={styles.container}>
      <BackButton />
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
        Didn’t receive code? <Text style={styles.resendLink}>Resend again</Text>
      </Text>
      <Button label="Verify" onPress={() => router.push('/auth/SetNewPassword')} />
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
  title: { fontFamily: 'Poppins', fontSize: 22, color: '#414141', fontWeight: '600', marginBottom: 8, marginTop: 4 },
  subtitle: { fontFamily: 'Poppins', fontSize: 15, color: '#B8B8B8', marginBottom: 16 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 10 },
  otpInput: {
    width: 44, height: 44, borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 8,
    textAlign: 'center', fontSize: 18, color: '#414141', fontFamily: 'Poppins', backgroundColor: '#fff'
  },
  resendContainer: { fontFamily: 'Poppins', color: '#534889', fontSize: 14, marginBottom: 28 },
  resendLink: { color: '#534889', textDecorationLine: 'underline' },
});