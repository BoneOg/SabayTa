import Button from '@/components/Button';
import BackButton from '@/components/ui/BackButton';
import CustomModal from '@/components/ui/CustomModal';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
  const [showPassword, setShowPassword] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please enter your credentials');
      setErrorModalVisible(true);
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
      catch {
        setErrorMessage('Server error. Please try again.');
        setErrorModalVisible(true);
        return;
      }

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        // Route based on user role
        if (data.user.role === 'admin') {
          router.replace('/admin');
        } else if (data.user.role === 'driver') {
          router.replace('/driver/home');
        } else {
          router.replace('/user/home');
        }
      } else {
        setErrorMessage(data.message || 'Login failed');
        setErrorModalVisible(true);
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again.');
      setErrorModalVisible(true);
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Your Password"
            placeholderTextColor="#D0D0D0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome
              name={showPassword ? "eye" : "eye-slash"}
              size={20}
              color="#534889"
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Pressable onPress={() => router.push('/auth/ForgotPassword')}><Text style={styles.forgotText}>Forgot password?</Text></Pressable>
        </View>

        <Button label={isLoading ? "Signing In..." : "Sign in"} onPress={handleLogin} disabled={isLoading} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/auth/SignUp')}><Text style={styles.signUpLink}>Sign up</Text></Pressable>
        </View>

        <CustomModal
          visible={errorModalVisible}
          title="Login Failed"
          message={errorMessage}
          onClose={() => setErrorModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: Platform.OS === 'android' ? 50 : 20, backgroundColor: '#fff' },
  title: { fontFamily: 'Poppins', fontSize: 24, color: '#414141', marginVertical: 16, fontWeight: '600' },
  input: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1, borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6, paddingVertical: 12, paddingHorizontal: 14, marginVertical: 7 },
  passwordContainer: { position: 'relative', marginVertical: 7 },
  passwordInput: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1, borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6, paddingVertical: 12, paddingHorizontal: 14, paddingRight: 50 },
  eyeIcon: { position: 'absolute', right: 14, top: 12 },
  forgotText: { color: '#E35A5A', fontFamily: 'Poppins', fontSize: 13, marginBottom: 24 },
  socialContainer: { marginVertical: 12 },
  socialButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 16, marginVertical: 6, backgroundColor: '#fff' },
  socialText: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', marginLeft: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18, gap: 4 },
  footerText: { fontFamily: 'Poppins', fontSize: 13, color: '#414141' },
  signUpLink: { color: '#534889', textDecorationLine: 'underline', fontFamily: 'Poppins', fontSize: 15 }
});
