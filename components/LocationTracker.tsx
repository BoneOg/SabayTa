import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export const CDO_COORDS = {
    latitude: 8.4590,
    longitude: 124.6322,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

export const useLocationTracker = () => {
    const [region, setRegion] = useState<any>(null);
    const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied' | 'not-asked'>('checking');

    const startWatching = async () => {
        try {
            const loc = await Location.getCurrentPositionAsync({});
            const initialRegion = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setRegion(initialRegion);

            await Location.watchPositionAsync(
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
            console.error("Could not get current position, using default region.", e);
            setRegion(CDO_COORDS);
        }
    };

    const requestPermissions = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Location permission denied. Defaulting to Cagayan de Oro.');
            setPermissionStatus('denied');
            setRegion(CDO_COORDS);
            return false;
        }
        setPermissionStatus('granted');
        await startWatching();
        return true;
    };

    useEffect(() => {
        const checkPermission = async () => {
            try {
                console.log('Checking location permissions...');
                const { status } = await Location.getForegroundPermissionsAsync();
                console.log('Current permission status:', status);

                if (status === 'granted') {
                    console.log('Permission granted, starting location tracking');
                    setPermissionStatus('granted');
                    await startWatching();
                } else {
                    console.log('Permission not granted, setting status to not-asked');
                    setPermissionStatus('not-asked');
                    // Set default region immediately so app doesn't hang
                    setRegion(CDO_COORDS);
                }
            } catch (error) {
                console.error("Error checking permissions:", error);
                setPermissionStatus('not-asked');
                setRegion(CDO_COORDS);
            }
        };

        checkPermission();
    }, []);

    return { region, setRegion, requestPermissions, permissionStatus };
};
