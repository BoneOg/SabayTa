import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

interface SelectedLocation {
    lat: number;
    lon: number;
    name: string;
}

interface MapComponentProps {
    mapRef: React.RefObject<MapView>;
    region: any;
    onRegionChangeComplete?: (region: any) => void;
    fromLocation?: SelectedLocation | null;
    toLocation?: SelectedLocation | null;
    routeCoords?: { latitude: number; longitude: number }[];
    selectingLocation?: 'from' | 'to' | null;
}

export const MapComponent = ({
    mapRef,
    region,
    onRegionChangeComplete,
    fromLocation,
    toLocation,
    routeCoords = [],
    selectingLocation
}: MapComponentProps) => {
    return (
        <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={region}
            showsMyLocationButton={false}
            onRegionChangeComplete={onRegionChangeComplete}
            userInterfaceStyle="light"
        >
            {/* User location marker - Hide if From location is selected */}
            {!fromLocation && (
                <Marker coordinate={region}>
                    <View style={styles.userMarker}>
                        <Ionicons name="location-sharp" size={24} color="#fff" />
                    </View>
                </Marker>
            )}

            {/* FROM/TO route Polyline */}
            {routeCoords.length > 0 && (
                <Polyline
                    coordinates={routeCoords}
                    strokeColor="#534889"
                    strokeWidth={5}
                    lineCap="round"
                    lineJoin="round"
                />
            )}

            {/* Markers for FROM and TO */}
            {fromLocation && (
                <Marker coordinate={{ latitude: fromLocation.lat, longitude: fromLocation.lon }} title="From">
                    <View style={[styles.userMarker, { backgroundColor: "#534889" }]}>
                        <Ionicons name="location-sharp" size={24} color="#fff" />
                    </View>
                </Marker>
            )}
            {toLocation && (
                <Marker coordinate={{ latitude: toLocation.lat, longitude: toLocation.lon }} title="To">
                    <View style={[styles.userMarker, { backgroundColor: "#EA4335" }]}>
                        <Ionicons name="location-sharp" size={24} color="#fff" />
                    </View>
                </Marker>
            )}
        </MapView>
    );
};

const styles = StyleSheet.create({
    userMarker: {
        backgroundColor: "#534889",
        padding: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#fff",
    },
});
