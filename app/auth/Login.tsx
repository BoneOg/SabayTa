import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { BASE_URL } from "../../config";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter your credentials');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: username, password })
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } 
      catch { Alert.alert('Error', 'Server error. Please try again.'); return; }

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        router.push(data.user.role === 'admin' ? '/admin' : '/user/home');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <BackButton />

        <Text style={styles.title}>Sign in with your email or {'\n'} phone number</Text>

        <TextInput style={styles.input} placeholder="Email or Phone Number" placeholderTextColor="#D0D0D0" value={username} onChangeText={setUsername} />
        <TextInput style={styles.input} placeholder="Enter Your Password" placeholderTextColor="#D0D0D0" secureTextEntry value={password} onChangeText={setPassword} />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Pressable onPress={() => router.push('/auth/ForgotPassword')}><Text style={styles.forgotText}>Forgot password?</Text></Pressable>
        </View>

        <Button label={isLoading ? "Signing In..." : "Sign in"} onPress={handleLogin} disabled={isLoading} />

        {/* Social login */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}><FontAwesome name="google" size={20} color="#414141" /><Text style={styles.socialText}>Sign in with Gmail</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}><FontAwesome name="facebook" size={20} color="#414141" /><Text style={styles.socialText}>Sign in with Facebook</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}><FontAwesome name="apple" size={20} color="#414141" /><Text style={styles.socialText}>Sign in with Apple</Text></TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/auth/SignUp')}><Text style={styles.signUpLink}>Sign up</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: Platform.OS === 'android' ? 50 : 20, backgroundColor: '#fff' },
  title: { fontFamily: 'Poppins', fontSize: 24, color: '#414141', marginVertical: 16, fontWeight: '600' },
  input: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1, borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6, paddingVertical: 12, paddingHorizontal: 14, marginVertical: 7 },
  forgotText: { color: '#E35A5A', fontFamily: 'Poppins', fontSize: 13, marginBottom: 24 },
  socialContainer: { marginVertical: 12 },
  socialButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 16, marginVertical: 6, backgroundColor: '#fff' },
  socialText: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', marginLeft: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18, gap: 4 },
  footerText: { fontFamily: 'Poppins', fontSize: 13, color: '#414141' },
  signUpLink: { color: '#534889', textDecorationLine: 'underline', fontFamily: 'Poppins', fontSize: 15 }
});
