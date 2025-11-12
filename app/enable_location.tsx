import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function EnableLocationScreen() {
  const router = useRouter();

  const requestLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status === Location.PermissionStatus.GRANTED) {
        const location = await Location.getCurrentPositionAsync({});
        console.log('User location:', location.coords);
        router.push('/welcome_screen');
      } else if (status === Location.PermissionStatus.DENIED) {
        // Open device settings if previously denied
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:'); // iOS settings
        } else {
          Linking.openSettings(); // Android settings
        }
      } else {
        // Undetermined or other -> request permission
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus === Location.PermissionStatus.GRANTED) {
          const location = await Location.getCurrentPositionAsync({});
          console.log('User location:', location.coords);
          router.push('/welcome_screen');
        } else {
          console.log('Permission still denied');
        }
      }
    } catch (error) {
      console.log('Error fetching location:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/Map.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.modal}>
        <Image
          source={require('@/assets/images/Location.png')}
          style={styles.locationImage}
          contentFit="contain"
        />
        <ThemedText type="title" style={styles.title}>
          Enable your location
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose your location to start finding requests around you
        </ThemedText>
        <TouchableOpacity style={styles.enableButton} onPress={requestLocation}>
          <ThemedText style={styles.enableButtonText}>Enable my location</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/welcome_screen')}>
          <ThemedText style={styles.skipText}>Skip for now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '5%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: '60%',
  },
  locationImage: { width: 120, height: 170, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#000' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#555', lineHeight: 22, marginBottom: 25 },
  enableButton: { backgroundColor: '#622C9B', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30, marginBottom: 15 },
  enableButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  skipText: { fontSize: 16, color: '#622C9B', textDecorationLine: 'underline', textAlign: 'center' },
});
