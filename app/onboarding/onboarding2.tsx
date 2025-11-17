import ArrowButton from '@/components/ArrowButton';
import SkipButton from '@/components/SkipButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function OnboardingTwo() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Skip button (top-right) */}
      <SkipButton onPress={() => router.push('/auth/Location')}>
        <ThemedText style={styles.skipText}>Skip</ThemedText>
      </SkipButton>

      {/* Image on top */}
      <Image source={require('@/assets/images/5.png')} style={styles.image} contentFit="contain" />

      {/* Title */}
      <ThemedText type="title" style={styles.title}>
        At anytime
      </ThemedText>

      {/* Subtitle */}
      <ThemedText style={styles.subtitle}>
        Day or night, planned or spontaneous, you can always count on a ride that fits your schedule and keeps you moving.
      </ThemedText>

      {/* Arrow Button */}
      <ArrowButton ringProgress={0.65} onPress={() => router.push('/onboarding/onboarding3')} />
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
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#534889',
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

