import { useState } from "react";
import { Alert } from "react-native";

export const useRouteCalculator = () => {
    const [routeCoordinates, setRouteCoordinates] = useState<
        { latitude: number; longitude: number }[] | null
    >(null);

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
                const coordinates = data.routes[0].geometry.coordinates.map(
                    (coord: number[]) => ({
                        latitude: coord[1],
                        longitude: coord[0],
                    })
                );
                console.log(`✅ Route fetched successfully! ${coordinates.length} points`);
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
    };

    return { routeCoordinates, fetchRoute, clearRoute };
};
