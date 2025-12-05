import { Ionicons, FontAwesome } from '@expo/vector-icons';
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
    driverLocation?: { latitude: number; longitude: number } | null;
    showDriverRoute?: boolean;
}

export const MapComponent = ({
    mapRef,
    region,
    onRegionChangeComplete,
    fromLocation,
    toLocation,
    routeCoords = [],
    selectingLocation,
    driverLocation,
    showDriverRoute
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
            {/* User location marker - Hide if From location is selected or driver is on the way */}
            {!fromLocation && !showDriverRoute && (
                <Marker coordinate={region}>
                    <View style={styles.userMarker}>
                        <Ionicons name="location-sharp" size={24} color="#fff" />
                    </View>
                </Marker>
            )}

            {/* FROM/TO route Polyline - only show when driver is NOT on the way */}
            {routeCoords.length > 0 && !showDriverRoute && (
                <Polyline
                    coordinates={routeCoords}
                    strokeColor="#534889"
                    strokeWidth={5}
                    lineCap="round"
                    lineJoin="round"
                />
            )}

            {/* Driver to Pickup route Polyline - show when driver is on the way */}
            {routeCoords.length > 0 && showDriverRoute && (
                <Polyline
                    coordinates={routeCoords}
                    strokeColor="#FF69B4"
                    strokeWidth={5}
                    lineCap="round"
                    lineJoin="round"
                />
            )}

            {/* Markers for FROM and TO - only show when driver is NOT on the way */}
            {fromLocation && !showDriverRoute && (
                <Marker coordinate={{ latitude: fromLocation.lat, longitude: fromLocation.lon }} title="From">
                    <View style={[styles.userMarker, { backgroundColor: "#534889" }]}>
                        <Ionicons name="location-sharp" size={24} color="#fff" />
                    </View>
                </Marker>
            )}
            {toLocation && !showDriverRoute && (
                <Marker coordinate={{ latitude: toLocation.lat, longitude: toLocation.lon }} title="To">
                    <View style={[styles.userMarker, { backgroundColor: "#EA4335" }]}>
                        <Ionicons name="location-sharp" size={24} color="#fff" />
                    </View>
                </Marker>
            )}

            {/* Pickup location marker when driver is on the way */}
            {fromLocation && showDriverRoute && (
                <Marker coordinate={{ latitude: fromLocation.lat, longitude: fromLocation.lon }} title="Pickup Location">
                    <View style={[styles.userMarker, { backgroundColor: "#EA4335" }]}>
                        <Ionicons name="location-sharp" size={24} color="#fff" />
                    </View>
                </Marker>
            )}

            {/* Driver location marker when booking is accepted */}
            {driverLocation && showDriverRoute && (
                <Marker
                    key={`driver-${driverLocation.latitude}-${driverLocation.longitude}`}
                    coordinate={driverLocation}
                    title="Driver"
                >
                    <View style={[styles.userMarker, { backgroundColor: "#534889" }]}>
                        <FontAwesome name="motorcycle" size={24} color="#fff" />
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
