import ArrowButton from '@/components/ArrowButton';
import SkipButton from '@/components/SkipButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function OnboardingThree() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Skip button (top-right) */}
      <SkipButton onPress={() => router.push('/auth/enable_location')}>
        <ThemedText style={styles.skipText}>Skip</ThemedText>
      </SkipButton>

      {/* SabayTa Logo */}
      <Image source={require('@/assets/images/SabayTa_logo...png')} style={styles.image} contentFit="contain" />

      {/* Title */}
      <ThemedText type="title" style={styles.title}>
        Book your ride
      </ThemedText>

      {/* Subtitle */}
      <ThemedText style={styles.subtitle}>
        With just a few taps, connect with trusted student drivers, share the ride, and get there safely and easily — it’s that
        simple
      </ThemedText>

      {/* Go Button */}
      <ArrowButton ringProgress={1} onPress={() => router.push('/auth/enable_location')}>
        <ThemedText style={styles.goText}>Go</ThemedText>
      </ArrowButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10, // reduced top padding
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#534889',
  },
  image: {
    width: 500, // bigger logo
    height: 300,
    marginBottom: 15,
    marginTop: 0,
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
    marginBottom: 30,
  },
  goText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

