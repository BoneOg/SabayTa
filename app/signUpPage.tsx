import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.replace('/welcome_screen')}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#414141" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Sign up with your email or phone number</Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#D0D0D0"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#D0D0D0"
        keyboardType="email-address"
      />

      {/* Mobile Input */}
      <View style={styles.rowInput}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCode}>🇵🇭 +63</Text>
        </View>

        <TextInput
          style={[styles.input, styles.mobileInput]}
          placeholder="Your mobile number"
          placeholderTextColor="#D0D0D0"
          keyboardType="phone-pad"
        />
      </View>

      {/* Gender */}
      <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#D0D0D0"
      />

      {/* Terms */}
      <View style={styles.termsRow}>
        <Entypo name="check" size={16} color="#540383" />
        <Text style={styles.termsText}>
          By signing up, you agree to the{' '}
          <Text style={styles.linkText}>Terms of service</Text> and{' '}
          <Text style={styles.linkText}>Privacy policy</Text>.
        </Text>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push('/PhoneVerification')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
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
        <Entypo name="apple" size={20} color="#414141" />
        <Text style={styles.socialText}>Sign up with Apple</Text>
      </TouchableOpacity>

      {/* Clickable Sign In Link */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
        <Text style={styles.footerText}>Already have an account? </Text>

        <Pressable onPress={() => router.push('/Login')}>
          <Text style={styles.signInLink}>Sign in</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 4,
  },
  backText: {
    fontFamily: 'Poppins',
    color: '#414141',
    fontSize: 17,
    marginLeft: 2,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 20,
    color: '#414141',
    marginVertical: 16,
    fontWeight: '600',
  },
  input: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 7,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  countryCodeBox: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  countryCode: {
    fontFamily: 'Poppins',
    color: '#414141',
    fontSize: 15,
  },
  mobileInput: {
    flex: 1,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  termsText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#B8B8B8',
    marginLeft: 7,
  },
  linkText: {
    color: '#540383',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: '#540383',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
  },
  orText: {
    textAlign: 'center',
    color: '#B8B8B8',
    marginVertical: 8,
    fontFamily: 'Poppins',
  },
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
  socialText: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
    marginLeft: 15,
  },
  footerText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#414141',
  },
  signInLink: {
    color: '#540383',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins',
  },
});
