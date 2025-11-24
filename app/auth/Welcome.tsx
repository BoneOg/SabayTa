import Button from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

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
        <Button label="Create Account" onPress={() => router.push('/auth/SignUp')} />

        {/* Login Button */}
        <Button
          label="Log In"
          variant="outline"
          onPress={() => router.push('/auth/Login')}
        />
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
    width: width * 0.9, // increased from 0.6 to 0.8
    height: width * 0.58, // height adjusted proportionally
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Poppins',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 40,
    fontFamily: 'Poppins',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
});
