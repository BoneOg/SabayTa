import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const fromLocation = params.from as string || 'Unknown';
    const toLocation = params.to as string || 'Unknown';
    const distance = params.distance as string || '5.2 km';
    const time = params.time as string || '15 mins';

    const handleConfirmRide = () => {
        router.push({
            pathname: '/user/home',
            params: {
                action: 'search_driver',
                fromLat: params.fromLat,
                fromLon: params.fromLon,
                fromName: fromLocation,
                toLat: params.toLat,
                toLon: params.toLon,
                toName: toLocation,
                distance: distance,
                time: time
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Details</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.routeContainer}>
                    <View style={styles.routeItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="location" size={20} color="#34A853" />
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>From</Text>
                            <Text style={styles.locationText} numberOfLines={2}>{fromLocation}</Text>
                        </View>
                    </View>

                    <View style={styles.routeLine} />

                    <View style={styles.routeItem}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FEE8E8' }]}>
                            <Ionicons name="location" size={20} color="#EA4335" />
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>To</Text>
                            <Text style={styles.locationText} numberOfLines={2}>{toLocation}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="straighten" size={24} color="#534889" />
                        <Text style={styles.detailLabel}>Distance</Text>
                        <Text style={styles.detailValue}>{distance}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <MaterialIcons name="access-time" size={24} color="#534889" />
                        <Text style={styles.detailLabel}>Estimated Time</Text>
                        <Text style={styles.detailValue}>{time}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRide}>
                    <Text style={styles.confirmButtonText}>Confirm Ride</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15, // Reduced top padding
        paddingBottom: 15, // Reduced bottom padding
        borderBottomWidth: 1,
        borderBottomColor: '#eee', // Lighter border color to match modal
    },
    backButton: {
        padding: 5, // Added padding for touch area
        marginRight: 10, // Reduced margin
    },
    headerTitle: {
        fontSize: 18, // Slightly smaller font to match modal title
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 5,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    routeContainer: {
        backgroundColor: '#F8F6FC',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 15,
        color: '#000',
        fontWeight: '500',
    },
    routeLine: {
        width: 2,
        height: 30,
        backgroundColor: '#D0D0D0',
        marginLeft: 19,
        marginVertical: 8,
    },
    detailsCard: {
        backgroundColor: '#F8F6FC',
        borderRadius: 15,
        padding: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    detailLabel: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        marginLeft: 15,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#534889',
    },
    footer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'transparent',
        zIndex: 1000,
    },
    confirmButton: {
        backgroundColor: '#534889',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16, // Match modal button text size
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: '85%',
        alignItems: 'center',
    },
    checkmarkContainer: {
        marginBottom: 20,
    },
    checkmarkBadge: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1E8FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    doneButton: {
        backgroundColor: '#534889',
        paddingVertical: 14,
        paddingHorizontal: 80,
        borderRadius: 14,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#E35A5A',
        paddingVertical: 16,
        paddingHorizontal: 64,
        borderRadius: 14,
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
