import ArrowButton from '@/components/ArrowButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function OnboardingOne() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Skip button (top-right) */}
      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/enable_location')}>
        <ThemedText style={styles.skipText}>Skip</ThemedText>
      </TouchableOpacity>

      {/* Image on top */}
      <Image source={require('@/assets/images/4.png')} style={styles.image} contentFit="contain" />

      {/* Title */}
      <ThemedText type="title" style={styles.title}>
        Anywhere you are
      </ThemedText>

      {/* Subtitle */}
      <ThemedText style={styles.subtitle}>
        Wherever campus life takes you — from classrooms to coffee runs to weekend adventures — your ride is never too far
        away.
      </ThemedText>

      {/* Arrow Button */}
      <ArrowButton onPress={() => router.push('/onboarding/onboarding2')} />
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
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000ff',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000000ff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000000ff',
    lineHeight: 22,
    marginBottom: 30, // space before arrow
  },
});

