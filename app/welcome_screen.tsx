import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* SabayTa Logo */}
      <Image
        source={require('@/assets/images/SabayTa_logo...png')}
        style={styles.logo}
        contentFit="contain"
      />

      {/* Title */}
      <ThemedText type="title" style={styles.title}>
        Welcome
      </ThemedText>

      {/* Subtext */}
      <ThemedText style={styles.subtitle}>
        Share the ride, together we glide
      </ThemedText>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>

        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push('/signUpPage')}
        >
          <ThemedText style={styles.createAccountButtonText}>Create Account</ThemedText>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/Login')}
        >
          <ThemedText style={styles.loginButtonText}>Log In</ThemedText>
        </TouchableOpacity>

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 500,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 40,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },

  /* BUTTONS SAME WIDTH + RADIUS 10 */
  createAccountButton: {
    backgroundColor: '#622C9B',
    width: '100%', // full same width
    paddingVertical: 14,
    borderRadius: 10, // changed
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  loginButton: {
    width: '100%', // full same width
    borderColor: '#622C9B',
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 10, // changed
  },
  loginButtonText: {
    color: '#622C9B',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
