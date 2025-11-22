import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
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
  View,
} from 'react-native';

export default function SignUpPage() {
  const router = useRouter();

  // NEW: Student / Rider selection
  const [selectedRole, setSelectedRole] = useState<'student' | 'rider' | null>(null);

  // State for proof attachment (shown only when rider is selected)
  const [proofFile, setProofFile] = useState<DocumentPicker.DocumentResult | null>(null);

  const pickProofDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'], // Allow images and PDFs
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        setProofFile(result);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Back Button */}
      <BackButton onPress={() => router.replace('/auth/Welcome')} />

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

      {/* NEW: Student or Rider Option Box */}
      <Text style={styles.label}>Sign up as:</Text>
      <View style={styles.roleContainer}>
        <Pressable
          style={[
            styles.roleOption,
            selectedRole === 'student' && styles.roleSelected,
          ]}
          onPress={() => setSelectedRole('student')}
        >
          <Text
            style={[
              styles.roleText,
              selectedRole === 'student' && styles.roleTextSelected,
            ]}
          >
            Student
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.roleOption,
            selectedRole === 'rider' && styles.roleSelected,
          ]}
          onPress={() => setSelectedRole('rider')}
        >
          <Text
            style={[
              styles.roleText,
              selectedRole === 'rider' && styles.roleTextSelected,
            ]}
          >
            Rider
          </Text>
        </Pressable>
      </View>

      {/* Conditional Proof Attachment for Rider */}
      {selectedRole === 'rider' && (
        <View style={styles.proofContainer}>
          <Text style={styles.proofLabel}>Attach proof that you are still a student:</Text>
          <TouchableOpacity style={styles.attachButton} onPress={pickProofDocument}>
            <FontAwesome name="paperclip" size={20} color="#534889" />
            <Text style={styles.attachText}>
              {proofFile ? `Attached: ${proofFile.name}` : 'Attach Document'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Terms */}
      <View style={styles.termsRow}>
        <Entypo name="check" size={16} color="#534889" />
        <Text style={styles.termsText}>
          By signing up, you agree to the{' '}
          <Text style={styles.linkText}>Terms of service</Text> and{' '}
          <Text style={styles.linkText}>Privacy policy</Text>.
        </Text>
      </View>

      {/* Sign Up Button */}
      <Button
        label="Sign Up"
        onPress={() => router.push('/auth/PhoneVerification')}
        style={{ marginVertical: 10 }}
      />

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

      {/* Footer: Sign In */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
        <Text style={styles.footerText}>Already have an account? </Text>

        <Pressable onPress={() => router.push('/auth/Login')}>
          <Text style={styles.signInLink}>Sign in</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 20,
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
  label: {
    fontFamily: 'Poppins',
    fontSize: 15,
    marginTop: 10,
    color: '#414141',
  },
  roleContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleSelected: {
    borderColor: '#534889',
    backgroundColor: '#EEE9FF',
  },
  roleText: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
  },
  roleTextSelected: {
    color: '#534889',
    fontWeight: '600',
  },
  proofContainer: {
    marginVertical: 10,
  },
  proofLabel: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
    marginBottom: 5,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  attachText: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
    marginLeft: 10,
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
    color: '#534889',
    textDecorationLine: 'underline',
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
    color: '#534889',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins',
  },
});
