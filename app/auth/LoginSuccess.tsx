import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/tabs/home'); // Navigates to home tab after login
    }, 1000); // 1-second delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="check-circle"
        size={60}
        color="#534889"
        style={{ alignSelf: 'center', marginBottom: 25 }}
      />
      <Text style={styles.title}>Login Successful!</Text>
      <Text style={styles.subtitle}>Welcome back, your password is updated.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontFamily: 'Poppins', fontSize: 22, color: '#414141', textAlign: 'center', fontWeight: '600', marginBottom: 10 },
  subtitle: { fontFamily: 'Poppins', fontSize: 15, color: '#B8B8B8', textAlign: 'center' },
});
