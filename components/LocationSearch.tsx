import { useCallback, useRef } from 'react';

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

const MINDANAO_BBOX = {
    minLon: 121.5,
    minLat: 5.0,
    maxLon: 127.5,
    maxLat: 9.5
};

export const useLocationSearch = () => {
    const searchTimeoutRef = useRef<number | null>(null);

    const fetchSuggestions = async (
        text: string,
        setSuggestions: React.Dispatch<React.SetStateAction<NominatimResult[]>>
    ) => {
        if (text.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${text}&limit=10&viewbox=${MINDANAO_BBOX.minLon},${MINDANAO_BBOX.maxLat},${MINDANAO_BBOX.maxLon},${MINDANAO_BBOX.minLat}&bounded=1`;

            const response = await fetch(url);
            const data: NominatimResult[] = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            setSuggestions([]);
        }
    };

    const debouncedFetchSuggestions = useCallback(
        (text: string, setSuggestions: React.Dispatch<React.SetStateAction<NominatimResult[]>>) => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

            searchTimeoutRef.current = setTimeout(() => {
                fetchSuggestions(text, setSuggestions);
            }, 500);
        },
        []
    );

    const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            return data?.display_name ?? 'Unknown Location';
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Unknown Location';
        }
    };

    return {
        debouncedFetchSuggestions,
        getAddressFromCoords
    };
};
