import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

interface DriverMapViewProps {
    driverLocation: {
        latitude: number;
        longitude: number;
    };
    routeCoordinates: { latitude: number; longitude: number }[] | null;
    onTheWay?: boolean;
}

export const DriverMapView = ({ driverLocation, routeCoordinates, onTheWay }: DriverMapViewProps) => {
    return (
        <MapView
            style={StyleSheet.absoluteFillObject}
            region={{
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
            userInterfaceStyle="light"
        >
            {/* Driver marker - always show as purple */}
            <Marker coordinate={driverLocation} title="Your Location">
                <View style={styles.driverMarker}>
                    <Ionicons name="location-sharp" size={24} color="#fff" />
                </View>
            </Marker>

            {/* Draw route and pickup marker when on the way */}
            {onTheWay && routeCoordinates && routeCoordinates.length > 0 && (
                <>
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#FF69B4"
                        strokeWidth={5}
                        lineCap="round"
                        lineJoin="round"
                    />
                    {/* Pickup Location Marker (Red) */}
                    <Marker
                        coordinate={routeCoordinates[routeCoordinates.length - 1]}
                        title="Pickup Location"
                    >
                        <View style={[styles.driverMarker, { backgroundColor: "red" }]}>
                            <Ionicons name="location-sharp" size={24} color="#fff" />
                        </View>
                    </Marker>
                </>
            )}

            {/* Show route for booking preview (not on the way) */}
            {!onTheWay && routeCoordinates && routeCoordinates.length > 0 && (
                <>
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#FF69B4"
                        strokeWidth={5}
                        lineCap="round"
                        lineJoin="round"
                    />
                    {/* Start marker (Pickup) */}
                    <Marker
                        coordinate={routeCoordinates[0]}
                        title="Pickup"
                    >
                        <View style={[styles.driverMarker, { backgroundColor: "green" }]}>
                            <Ionicons name="location-sharp" size={24} color="#fff" />
                        </View>
                    </Marker>
                    {/* End marker (red) - destination */}
                    <Marker
                        coordinate={routeCoordinates[routeCoordinates.length - 1]}
                        title="To"
                    >
                        <View style={[styles.driverMarker, { backgroundColor: "red" }]}>
                            <Ionicons name="location-sharp" size={24} color="#fff" />
                        </View>
                    </Marker>
                </>
            )}
        </MapView>
    );
};

const styles = StyleSheet.create({
    driverMarker: {
        backgroundColor: "#534889",
        padding: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#fff",
    },
});
