import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const options = {
  tabBarStyle: { display: 'none' },
  headerShown: false,
};

const ContactUs = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const isSendDisabled = useMemo(() => !name || !email || !mobile || !message, [name, email, mobile, message]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={20} color='#1C1B1F' />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Contact Us</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Have a question? Get in touch.</Text>

        {/* Contact Info */}
        <View style={styles.contactBox}>
          <Text style={styles.contactLabel}>Address</Text>
          <Text style={styles.contactText}>University of Science and Technology of Southern Philippines</Text>
          <Text style={styles.contactText}>Call: +63 917 555 1234</Text>
          <Text style={styles.contactText}>Email: support@sabayta.com</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#A0A0A0"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Mobile Number Row */}
          <View style={styles.mobileRow}>
            <Text style={styles.countryCode}>+63</Text>

            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Your mobile number"
              placeholderTextColor="#A0A0A0"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Write your text"
            placeholderTextColor="#A0A0A0"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, isSendDisabled && styles.buttonDisabled]}
            disabled={isSendDisabled}
          >
            <Text style={styles.sendText}>Send Message</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#1C1B1F',
  },

  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1B1F',
  },

  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#414141',
    textAlign: 'center',
    marginBottom: 18,
  },

  contactBox: {
    alignItems: 'center',
    color: '#3C3C3C',
    marginBottom: 24,
  },

  contactLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#3C3C3C',
    marginBottom: 4,
  },

  contactText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: '#3C3C3C',
    marginVertical: 2,
  },

  form: {
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    marginVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
    paddingVertical: 16,
  },

  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    marginVertical: 7,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  flagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },

  countryCode: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#414141',
    marginRight: 6,
  },

  messageInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  sendButton: {
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  sendText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },

  buttonDisabled: {
    opacity: 0.5,
  }
});

export default ContactUs;
