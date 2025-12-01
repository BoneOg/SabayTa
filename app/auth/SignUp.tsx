import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !phone || !gender || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: `+63${phone}`,
          gender,
          password
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Signup response not JSON:", text);
        Alert.alert("Error", "Server error. Please try again.");
        return;
      }

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        Alert.alert('Success', 'Account created successfully!');
        router.push('/auth/Login');

      } else {
        Alert.alert('Error', data.message || 'Signup failed.');
      }

    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton onPress={() => router.replace('/auth/Welcome')} />
      <Text style={styles.title}>Sign up with your email or phone number</Text>

      <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#D0D0D0" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#D0D0D0" keyboardType="email-address" value={email} onChangeText={setEmail} />

      <View style={styles.rowInput}>
        <View style={styles.countryCodeBox}><Text style={styles.countryCode}>🇵🇭 +63</Text></View>
        <TextInput style={[styles.input, styles.mobileInput]} placeholder="Your mobile number" placeholderTextColor="#D0D0D0" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      </View>

      <TextInput style={styles.input} placeholder="Gender" placeholderTextColor="#D0D0D0" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#D0D0D0" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#D0D0D0" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <View style={styles.termsRow}>
        <Entypo name="check" size={16} color="#534889" />
        <Text style={styles.termsText}>By signing up, you agree to the <Text style={styles.linkText}>Terms of service</Text> and <Text style={styles.linkText}>Privacy policy</Text>.</Text>
      </View>

      <Button label={isLoading ? "Signing Up..." : "Sign Up"} onPress={handleSignUp} style={{ marginVertical: 10 }} disabled={isLoading} />

      {/* Social login buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}><FontAwesome name="google" size={20} color="#414141" /><Text style={styles.socialText}>Sign up with Gmail</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}><FontAwesome name="facebook" size={20} color="#414141" /><Text style={styles.socialText}>Sign up with Facebook</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}><FontAwesome name="apple" size={20} color="#414141" /><Text style={styles.socialText}>Sign up with Apple</Text></TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.push('/auth/Login')}><Text style={styles.signInLink}>Sign in</Text></Pressable>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 50 : 20 },
  title: { fontFamily: 'Poppins', fontSize: 24, color: '#414141', marginVertical: 16, fontWeight: '600' },
  input: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', borderWidth: 1, borderColor: '#D0D0D0', backgroundColor: '#fff', borderRadius: 6, paddingVertical: 12, paddingHorizontal: 14, marginVertical: 7 },
  rowInput: { flexDirection: 'row', alignItems: 'center', marginVertical: 7 },
  countryCodeBox: { borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 10, marginRight: 8, backgroundColor: '#fff' },
  countryCode: { fontFamily: 'Poppins', color: '#414141', fontSize: 15 },
  mobileInput: { flex: 1 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  termsText: { fontFamily: 'Poppins', fontSize: 12, color: '#B8B8B8', marginLeft: 7 },
  linkText: { color: '#534889', textDecorationLine: 'underline' },
  socialContainer: { marginVertical: 12 },
  socialButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 16, marginVertical: 6, backgroundColor: '#fff' },
  socialText: { fontFamily: 'Poppins', fontSize: 15, color: '#414141', marginLeft: 15 },
  footerText: { fontFamily: 'Poppins', fontSize: 13, color: '#414141' },
  signInLink: { color: '#534889', textDecorationLine: 'underline', fontFamily: 'Poppins' }
});
