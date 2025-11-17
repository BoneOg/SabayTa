import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Back */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#414141" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Sign in with your email or phone number</Text>

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Email or Phone Number"
        placeholderTextColor="#D0D0D0"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Enter Your Password"
        placeholderTextColor="#D0D0D0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
        <TouchableOpacity onPress={() => router.push('/auth/PhoneVerificationLogin')}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push('/tabs/home')}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      {/* Social Buttons */}
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="google" size={20} color="#414141" />
        <Text style={styles.socialText}>Sign up with Gmail</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="facebook" size={20} color="#414141" />
        <Text style={styles.socialText}>Sign up with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="apple" size={20} color="#414141" />
        <Text style={styles.socialText}>Sign up with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 4 },
  backText: { fontFamily: 'Poppins', color: '#414141', fontSize: 17, marginLeft: 2 },
  title: { fontFamily: 'Poppins', fontSize: 20, color: '#414141', marginVertical: 16, fontWeight: '600' },
  input: {
    fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1,
    borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6,
    paddingVertical: 12, paddingHorizontal: 14, marginVertical: 7,
  },
  signInButton: {
    backgroundColor: '#534889',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontFamily: 'Poppins', fontWeight: '700', fontSize: 15 },
  forgotText: { color: '#E35A5A', fontFamily: 'Poppins', fontSize: 13 },
  orText: { textAlign: 'center', color: '#B8B8B8', marginVertical: 8, fontFamily: 'Poppins' },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  socialText: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', marginLeft: 15 },
  footerText: { textAlign: 'center', fontFamily: 'Poppins', fontSize: 13, color: '#414141', marginTop: 18 },
  signUpLink: { color: '#534889', textDecorationLine: 'underline', fontFamily: 'Poppins' },
});
