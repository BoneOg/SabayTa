import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { BASE_URL } from '../../config';

const { height } = Dimensions.get('window');

export default function DriverTrackingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mapRef = useRef<MapView>(null);
    const [showDriverDetails, setShowDriverDetails] = useState(false);
    const [showArrivalModal, setShowArrivalModal] = useState(false);
    const [showDestinationModal, setShowDestinationModal] = useState(false);
    const [passengerPickedUp, setPassengerPickedUp] = useState(false);
    const [bookingId, setBookingId] = useState(params.bookingId as string || null);

    // Real booking data from backend
    const [driverLocation, setDriverLocation] = useState({ latitude: 8.4595, longitude: 124.6330 });
    const [userLocation, setUserLocation] = useState({ latitude: 8.4590, longitude: 124.6322 });
    const [destination, setDestination] = useState({ latitude: 8.4650, longitude: 124.6400 });
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number, longitude: number }[]>([]);

    // Dynamic Booking Data
    const [driver, setDriver] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Poll for booking status to detect when passenger is picked up
    useEffect(() => {
        if (!bookingId) return;

        const pollBookingStatus = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/bookings/${bookingId}`);
                const data = await response.json();

                if (data.booking) {
                    const booking = data.booking;

                    // Update driver location if available
                    if (booking.driverLocation?.latitude && booking.driverLocation?.longitude) {
                        setDriverLocation({
                            latitude: booking.driverLocation.latitude,
                            longitude: booking.driverLocation.longitude
                        });
                    }

                    // Store Driver Info if assigned
                    if (booking.driverId && typeof booking.driverId === 'object') {
                        setDriver(booking.driverId);
                    }

                    // Store User ID (for chat)
                    if (booking.userId && typeof booking.userId === 'object') {
                        setCurrentUserId(booking.userId._id);
                    } else if (booking.userId && typeof booking.userId === 'string') {
                        setCurrentUserId(booking.userId);
                    }

                    // Update pickup and dropoff locations
                    if (booking.pickupLocation) {
                        setUserLocation({
                            latitude: booking.pickupLocation.lat,
                            longitude: booking.pickupLocation.lon
                        });
                    }

                    if (booking.dropoffLocation) {
                        setDestination({
                            latitude: booking.dropoffLocation.lat,
                            longitude: booking.dropoffLocation.lon
                        });
                    }

                    // Check if passenger was picked up
                    if (booking.passengerPickedUp && !passengerPickedUp) {
                        console.log("✅ Passenger picked up - updating user UI and fetching route");
                        setPassengerPickedUp(true);

                        // Fetch route from pickup to dropoff
                        if (booking.pickupLocation && booking.dropoffLocation) {
                            fetchRouteFromPickupToDropoff(
                                { latitude: booking.pickupLocation.lat, longitude: booking.pickupLocation.lon },
                                { latitude: booking.dropoffLocation.lat, longitude: booking.dropoffLocation.lon }
                            );
                        }
                    }
                }
            } catch (error) {
                console.error("Error polling booking status:", error);
            }
        };

        // Poll every 3 seconds
        const interval = setInterval(pollBookingStatus, 3000);
        pollBookingStatus(); // Initial call

        return () => clearInterval(interval);
    }, [bookingId, passengerPickedUp]);

    // Fetch route from pickup to dropoff using OSRM
    const fetchRouteFromPickupToDropoff = async (
        pickup: { latitude: number; longitude: number },
        dropoff: { latitude: number; longitude: number }
    ) => {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?overview=full&geometries=geojson`;

            console.log("🗺️ Fetching route from pickup to dropoff...");
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map((coord: number[]) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));

                setRouteCoordinates(coordinates);
                console.log(`✅ Route fetched! ${coordinates.length} points`);
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const handleMessage = () => {
        if (currentUserId && driver?._id) {
            router.push({
                pathname: '/user/chat',
                params: {
                    userId: currentUserId,
                    driverId: driver._id,
                    driverName: driver.name,
                    driverImage: driver.profileImage
                }
            });
        }
    };

    const handleDriverArrived = () => {
        setShowArrivalModal(false);
        setTimeout(() => {
            setShowDestinationModal(true);
        }, 3000);
    };

    const handleDestinationReached = () => {
        setShowDestinationModal(false);
        router.push('/user/rating');
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: 8.4590,
                    longitude: 124.6322,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker coordinate={driverLocation}>
                    <View style={[styles.marker, { backgroundColor: '#534889' }]}>
                        <Ionicons name="car" size={20} color="#fff" />
                    </View>
                </Marker>

                <Marker coordinate={userLocation}>
                    <View style={[styles.marker, { backgroundColor: '#34A853' }]}>
                        <Ionicons name="person" size={20} color="#fff" />
                    </View>
                </Marker>

                <Marker coordinate={destination}>
                    <View style={[styles.marker, { backgroundColor: '#EA4335' }]}>
                        <Ionicons name="location" size={20} color="#fff" />
                    </View>
                </Marker>

                <Polyline
                    coordinates={
                        passengerPickedUp && routeCoordinates.length > 0
                            ? routeCoordinates
                            : [driverLocation, userLocation, destination]
                    }
                    strokeColor="#534889"
                    strokeWidth={4}
                />
            </MapView>



            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                <Text style={styles.statusText}>
                    {passengerPickedUp ? "Driver is taking you to your destination" : "Your rider is 5 mins away"}
                </Text>

                <View style={styles.driverCard}>
                    <Image
                        source={{ uri: driver?.profileImage || 'https://i.pravatar.cc/150?img=12' }}
                        style={styles.driverImage}
                    />
                    <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>{driver?.name || "Searching for driver..."}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="location" size={14} color="#666" />
                            <Text style={styles.distanceText}>800m (6mins away)</Text>
                        </View>
                        {driver && (
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={14} color="#FFB800" />
                                <Text style={styles.ratingText}>{driver.averageRating || 'New'} ({driver.totalRatings || 0} reviews)</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => setShowDriverDetails(true)}
                    >
                        <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                        <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => setShowArrivalModal(true)}
                >
                    <Text style={styles.confirmButtonText}>Confirm Ride</Text>
                </TouchableOpacity>
            </View>

            {/* Driver Details Modal */}
            <Modal visible={showDriverDetails} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.detailsModal}>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowDriverDetails(false)}
                        >
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>

                        <Image
                            source={{ uri: driver?.profileImage || 'https://i.pravatar.cc/300?img=12' }}
                            style={styles.detailsDriverImage}
                        />

                        <Text style={styles.detailsDriverName}>{driver?.name || "Driver Name"}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFB800" />
                            <Text style={styles.detailsRating}>{driver?.averageRating || 'New'} ({driver?.totalRatings || 0} reviews)</Text>
                        </View>

                        <View style={styles.vehicleCard}>
                            <Image
                                source={{ uri: 'https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-blue-motorcycle-png-image_10149986.png' }}
                                style={styles.vehicleImage}
                            />
                            <View style={styles.vehicleInfo}>
                                <Text style={styles.vehicleLabel}>Model: {driver?.vehicle?.model || "Unknown"}</Text>
                                <Text style={styles.vehicleLabel}>Plate no.: {driver?.vehicle?.plateNumber || "Unknown"}</Text>
                                <Text style={styles.vehicleLabel}>Color: {driver?.vehicle?.color || "Unknown"}</Text>
                            </View>
                        </View>

                        <View style={styles.contactCard}>
                            <Text style={styles.contactTitle}>Contact Information :</Text>
                            {/* Note: In a real app, maybe hide email for privacy/safety */}
                            <View style={styles.contactRow}>
                                <MaterialIcons name="email" size={20} color="#000" />
                                <Text style={styles.contactText}>{driver?.email || "No email provided"}</Text>
                            </View>
                            <View style={styles.contactRow}>
                                <MaterialIcons name="phone" size={20} color="#000" />
                                <Text style={styles.contactText}>{driver?.phone || "No contact info"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Arrival Modal */}
            <Modal visible={showArrivalModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.alertModal}>
                        <View style={styles.alertIcon}>
                            <Ionicons name="checkmark-circle" size={80} color="#34A853" />
                        </View>
                        <Text style={styles.alertTitle}>Your Ride is Here!</Text>
                        <Text style={styles.alertMessage}>Your driver has arrived at your location</Text>
                        <TouchableOpacity style={styles.alertButton} onPress={handleDriverArrived}>
                            <Text style={styles.alertButtonText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Destination Modal */}
            <Modal visible={showDestinationModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.alertModal}>
                        <View style={styles.alertIcon}>
                            <Ionicons name="location" size={80} color="#534889" />
                        </View>
                        <Text style={styles.alertTitle}>Destination Reached!</Text>
                        <Text style={styles.alertMessage}>You have arrived at your destination</Text>
                        <TouchableOpacity style={styles.alertButton} onPress={handleDestinationReached}>
                            <Text style={styles.alertButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    marker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        paddingBottom: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#D0D0D0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 15,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    driverImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    distanceText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    ratingText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    detailsButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#534889',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#534889',
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageButton: {
        flex: 1,
        backgroundColor: '#534889',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    messageButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: '#534889',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    detailsModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        paddingBottom: 40,
        maxHeight: height * 0.85,
    },
    modalCloseButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    detailsDriverImage: {
        width: 200,
        height: 200,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 15,
    },
    detailsDriverName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 5,
    },
    detailsRating: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    vehicleCard: {
        backgroundColor: '#E8DEFF',
        borderRadius: 15,
        padding: 15,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 15,
    },
    vehicleLabel: {
        fontSize: 15,
        color: '#000',
        marginBottom: 5,
    },
    contactCard: {
        backgroundColor: '#E8DEFF',
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 14,
        color: '#000',
        marginLeft: 10,
    },
    alertModal: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        marginHorizontal: 30,
        marginBottom: height * 0.3,
        alignItems: 'center',
    },
    alertIcon: {
        marginBottom: 20,
    },
    alertTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    alertMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
    },
    alertButton: {
        backgroundColor: '#534889',
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 14,
    },
    alertButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
