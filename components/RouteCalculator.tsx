import { useCallback } from 'react';

interface SelectedLocation {
    lat: number;
    lon: number;
    name: string;
}

export const useRouteCalculator = () => {
    const fetchRoute = useCallback(async (
        start: SelectedLocation,
        end: SelectedLocation,
        setRouteCoords: (coords: { latitude: number; longitude: number }[]) => void,
        setTripDetails: (details: { distance: string; duration: string }) => void,
        mapRef?: React.RefObject<any>
    ) => {
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                setRouteCoords(coordinates);

                if (mapRef?.current) {
                    mapRef.current.fitToCoordinates(coordinates, {
                        edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
                        animated: true,
                    });
                }

                // Calculate distance and duration
                const distKm = (data.routes[0].distance / 1000).toFixed(1);
                const durMins = Math.round(data.routes[0].duration / 60);
                setTripDetails({
                    distance: `${distKm} km`,
                    duration: `${durMins} mins`
                });
            }
        } catch (error) {
            console.error("Error fetching route:", error);
            // Fallback to straight line if API fails
            setRouteCoords([
                { latitude: start.lat, longitude: start.lon },
                { latitude: end.lat, longitude: end.lon }
            ]);
        }
    }, []);

    return { fetchRoute };
};
