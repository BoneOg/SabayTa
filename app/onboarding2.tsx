import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Skip button (top-right) */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/enable_location')}
      >
        <ThemedText style={styles.skipText}>Skip</ThemedText>
      </TouchableOpacity>

      {/* SabayTa Logo */}
      <Image
        source={require('@/assets/images/SabayTa_logo...png')}
        style={styles.image}
        contentFit="contain"
      />

      {/* Title */}
      <ThemedText type="title" style={styles.title}>
        Book your ride
      </ThemedText>

      {/* Subtitle */}
      <ThemedText style={styles.subtitle}>
        With just a few taps, connect with trusted student drivers, share the ride, and get there safely and easily — it’s that simple
      </ThemedText>

      {/* Go Button */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => router.push('/enable_location')}
      >
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <ThemedText style={styles.goText}>Go</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,       // reduced top padding
    paddingHorizontal: 20,
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
    color: '#555',
  },
  image: {
    width: 500,      // bigger logo
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
  arrowButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#622C9B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F0AEDA',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#622C9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
