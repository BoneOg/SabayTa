import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const CDO_COORDS = {
    latitude: 8.4590,
    longitude: 124.6322,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

export const useLocationTracker = () => {
    const [region, setRegion] = useState<any>(null);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startLocationTracking = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Location permission denied. Defaulting to Cagayan de Oro.');
                setRegion(CDO_COORDS);
                return;
            }

            try {
                const loc = await Location.getCurrentPositionAsync({});
                const initialRegion = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setRegion(initialRegion);

                subscription = await Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.High, distanceInterval: 1 },
                    (location) => {
                        setRegion({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        });
                    }
                );
            } catch (e) {
                console.error("Could not get current position, staying at default region.", e);
            }
        };

        startLocationTracking();
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return { region, setRegion };
};
