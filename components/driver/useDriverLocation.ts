import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useDriverLocation = () => {
    const [driverLocation, setDriverLocation] = useState({
        latitude: 8.4590,
        longitude: 124.6322,
    });

    useEffect(() => {
        let subscriber: Location.LocationSubscription;

        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "Allow location access to use this feature"
                );
                return;
            }

            subscriber = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
                (location) => {
                    setDriverLocation({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                }
            );
        })();

        return () => {
            if (subscriber) subscriber.remove();
        };
    }, []);

    return driverLocation;
};
