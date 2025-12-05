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
}

export const DriverMapView = ({ driverLocation, routeCoordinates }: DriverMapViewProps) => {
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
            {/* Driver marker */}
            <Marker coordinate={driverLocation} title="Your Location">
                <View style={styles.driverMarker}>
                    <Ionicons name="location-sharp" size={24} color="#fff" />
                </View>
            </Marker>

            {/* Draw route if selected */}
            {routeCoordinates && (
                <>
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#FF69B4"
                        strokeWidth={5}
                    />
                    {/* Marker at the end of the path */}
                    <Marker
                        coordinate={routeCoordinates[routeCoordinates.length - 1]}
                        title="Destination"
                    >
                        <View style={[styles.driverMarker, { backgroundColor: "#FF5733" }]}>
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
