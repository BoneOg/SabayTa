import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get("window"); // Get screen height for animation

// Helper function to simulate distance/time calculation
const calculateRandomArrival = () => {
    // Generates a time between 2 and 7 minutes
    const randomTime = Math.floor(Math.random() * 6) + 2;
    // Generates a distance between 0.3 and 1.5 km
    const randomDistance = (Math.random() * 1.2 + 0.3).toFixed(1);

    const arrivalTime = `${randomTime} mins`;
    const arrivalDistance = `${randomDistance} km away`;

    return { arrivalTime, arrivalDistance };
};

interface DriverArrivalProps {
    isSearching: boolean;
    visible?: boolean;
    onMessagePress?: () => void;
    onDetailsPress?: () => void;
    onArrivalShow?: () => void;
    onClose?: () => void;
    onCancelPress?: () => void;
    // Dynamic props (now nullable/optional, allowing the local state to take over)
    arrivalTime?: string | null;
    arrivalDistance?: string | null;
    driverName?: string;
    rating?: number;
    totalRatings?: number;
    profileImage?: string;
}

export const DriverArrival = ({
    visible = false,
    onMessagePress,
    onDetailsPress,
    onClose,
    onCancelPress,
    // Alias the incoming props to use for internal state initialization
    arrivalTime: propArrivalTime,
    arrivalDistance: propArrivalDistance,
    driverName = "Your Driver",
    rating = 5.0,
    totalRatings = 0,
    profileImage,
}: DriverArrivalProps) => {
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Internal state to hold the time and distance
    const [localArrivalTime, setLocalArrivalTime] = useState(propArrivalTime || 'Calculating...');
    const [localArrivalDistance, setLocalArrivalDistance] = useState(propArrivalDistance || 'Calculating...');

    // Initial slide down value adjusted for better positioning (Off-screen)
    const slideAnim = new Animated.Value(height);
    const MODAL_HEIGHT = 200; // Estimated height for the new content layout

    // Effect for sliding animation and for calculating distance/time
    useEffect(() => {
        // --- 1. Animation Logic ---
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height, // Slide completely off screen
                duration: 300,
                useNativeDriver: true,
            }).start();
        }

        // --- 2. Calculation Logic ---
        // Check if the component is visible AND the props were not provided (i.e., they are null or undefined)
        if (visible && (!propArrivalTime || !propArrivalDistance)) {
            const { arrivalTime, arrivalDistance } = calculateRandomArrival();
            setLocalArrivalTime(arrivalTime);
            setLocalArrivalDistance(arrivalDistance);
        } else if (visible) {
            // If props were provided, ensure the local state reflects them
            setLocalArrivalTime(propArrivalTime || 'N/A');
            setLocalArrivalDistance(propArrivalDistance || 'N/A');
        }

    }, [visible, propArrivalTime, propArrivalDistance]); // Dependencies ensure calculation runs when props change

    const handleCancelPress = () => {
        setShowCancelModal(true);
    };

    const handleDetailsPress = () => {
        // Close the modal first
        onClose?.();
        // Then execute the original details action
        onDetailsPress?.();
    };

    const handleMessagePress = () => {
        // Close the modal first
        onClose?.();
        onMessagePress?.();
    }

    const confirmCancel = () => {
        setShowCancelModal(false);
        setTimeout(() => {
            onCancelPress?.();
        }, 300);
    };

    // Use absolute positioning with translateY to animate the content from below the screen
    // The `MODAL_OFFSET` style in the stylesheet handles the final resting position.
    if (!visible && (slideAnim as any).__getValue() > MODAL_HEIGHT) return null;

    return (
        <View style={styles.driverArrivalOverlay}>
            <Animated.View
                style={[
                    styles.driverArrivalContent,
                    // The translateY animation pushes the view up from the bottom
                    { transform: [{ translateY: slideAnim }] },
                ]}
                // Prevent tapping the content from closing the overlay
                onStartShouldSetResponder={() => true}
            >
                {/* 1. Driver Info Section (Top part of the card) */}
                <View style={styles.driverInfoContainer}>
                    <View style={styles.driverProfileSection}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.driverImage}
                            resizeMode="cover"
                        />
                        <View style={styles.driverNameSection}>
                            {/* Title matched to OnTheWay style */}
                            <Text style={styles.subtitle}>{driverName}</Text>
                            <View style={styles.ratingContainer}>
                                <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
                                <Text style={styles.ratingText}>{rating.toFixed(1)} ({totalRatings} reviews)</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 2. Arrival Status and ETA (STYLED TO MATCH OnTheWay infoRow) */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="map-marker-distance" size={16} color="#534889" />
                        {/* Use local state for rendering */}
                        <Text style={styles.infoText}>{localArrivalDistance}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="clock-time-three-outline" size={16} color="#534889" />
                        {/* Use local state for rendering */}
                        <Text style={styles.infoText}>{localArrivalTime}</Text>
                    </View>
                </View>

                {/* 3. Action Buttons (Bottom part of the card) */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancelPress}
                    >
                        <MaterialCommunityIcons name="close-circle-outline" size={20} color="#E53935" />
                        <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={handleDetailsPress} // Uses new handler to close modal
                    >
                        <MaterialCommunityIcons name="information-outline" size={20} color="#534889" />
                        <Text style={[styles.buttonText, styles.detailsButtonText]}>Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={handleMessagePress} // Uses new handler to close modal
                    >
                        <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Chat</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Cancel Confirmation Modal */}
            <Modal
                visible={showCancelModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCancelModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cancel Trip</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to cancel this trip?</Text>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => setShowCancelModal(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Keep Trip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalConfirmButton]}
                                onPress={confirmCancel}
                            >
                                <Text style={styles.modalConfirmButtonText}>Cancel Trip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    driverArrivalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
        zIndex: 3000,
    },
    driverArrivalContent: {
        // POSITIONING MATCHES ONTHEWAY COMPONENT
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20, // Match OnTheWay border radius
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Match OnTheWay shadow
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    // Styles for the main info text/titles (New/Modified)
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'left',
        marginBottom: 5,
    },
    driverInfoContainer: {
        marginBottom: 10,
    },
    driverProfileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverImage: {
        width: 50, // Slightly smaller image to fit better
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    driverNameSection: {
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
    },
    // --- Info Row Styling Matching OnTheWay ---
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f5f5f5', // Matches OnTheWay infoRow background
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    // --- End Info Row Styling ---

    // --- Action Button Styling Matching OnTheWay ---
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12, // Adjusted padding
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E53935',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    cancelButtonText: {
        color: '#E53935',
        fontSize: 12,
        fontWeight: '600',
    },
    detailsButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#622C9B',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    messageButton: {
        flex: 1,
        backgroundColor: '#534889', // Matched OnTheWay chat button color
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    detailsButtonText: {
        color: '#622C9B',
        fontSize: 12,
        fontWeight: '600',
    },
    // --- End Action Button Styling ---

    // Modal styles are kept consistent with the original
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 25,
        paddingVertical: 30,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 25,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCancelButton: {
        backgroundColor: '#F0F0F0',
    },
    modalCancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    modalConfirmButton: {
        backgroundColor: '#FF3B30',
    },
    modalConfirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});