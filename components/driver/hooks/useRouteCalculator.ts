import { useState } from "react";
import { Alert } from "react-native";

export const useRouteCalculator = () => {
    const [routeCoordinates, setRouteCoordinates] = useState<
        { latitude: number; longitude: number }[] | null
    >(null);
    const [distance, setDistance] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);

    const fetchRoute = async (
        start: { latitude: number; longitude: number },
        end: { latitude: number; longitude: number }
    ) => {
        try {
            console.log("🚗 Fetching route from driver to rider...");
            console.log("Driver location:", start);
            console.log("Rider pickup location:", end);

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            console.log("📍 OSRM API Response:", data);

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map(
                    (coord: number[]) => ({
                        latitude: coord[1],
                        longitude: coord[0],
                    })
                );

                const distanceKm = (route.distance / 1000).toFixed(2);
                const durationMin = Math.round(route.duration / 60);

                setDistance(`${distanceKm} km`);
                setDuration(`${durationMin} min`);

                console.log(`✅ Route fetched successfully! ${coordinates.length} points`);
                console.log(`📏 Distance: ${distanceKm} km, Duration: ${durationMin} min`);
                setRouteCoordinates(coordinates);
            } else {
                console.log("❌ No routes found in response");
                Alert.alert("Error", "No route found.");
            }
        } catch (error) {
            console.error("❌ Error fetching route:", error);
            Alert.alert("Error", "Could not fetch route. Check your internet connection.");
        }
    };

    const clearRoute = () => {
        setRouteCoordinates(null);
        setDistance(null);
        setDuration(null);
    };

    return { routeCoordinates, distance, duration, fetchRoute, clearRoute };
};
