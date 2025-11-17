import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';

export default function EnableLocationScreen() {
  const router = useRouter();

const requestLocation = async () => {
  try {
    // 1. Check existing permission
    let { status } = await Location.getForegroundPermissionsAsync();

    // 2. If NOT granted, request permission
    if (status !== Location.PermissionStatus.GRANTED) {
      const permission = await Location.requestForegroundPermissionsAsync();
      status = permission.status;
    }

    // 3. After checking and possibly requesting, if GRANTED → navigate
    if (status === Location.PermissionStatus.GRANTED) {
      const location = await Location.getCurrentPositionAsync({});
      console.log("User location:", location.coords);
      router.push("/auth/welcome_screen");
      return;
    }

    // 4. If denied permanently → open settings
    if (status === Location.PermissionStatus.DENIED) {
      if (Platform.OS === "ios") {
        Linking.openURL("app-settings:");
      } else {
        Linking.openSettings();
      }
    }
  } catch (error) {
    console.log("Error fetching location:", error);
  }
};

  const region = {
    latitude: 8.4822,
    longitude: 124.6472,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <ThemedView style={styles.container}>
      {/* Live map as background */}
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />
      <View style={styles.overlay} />
      <View style={styles.modal}>
        {/* Location illustration (keep this for branding) */}
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
        <TouchableOpacity onPress={() => router.push('/auth/welcome_screen')}>
          <ThemedText style={styles.skipText}>Skip for now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
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
  enableButton: { backgroundColor: '#534889', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30, marginBottom: 15 },
  enableButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  skipText: { fontSize: 16, color: '#534889', textDecorationLine: 'underline', textAlign: 'center' },
});
