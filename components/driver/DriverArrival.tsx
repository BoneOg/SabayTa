import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DriverArrivalProps {
    isSearching: boolean;
    visible?: boolean;
    onMessagePress?: () => void;
    onDetailsPress?: () => void;
    onArrivalShow?: () => void;
    onClose?: () => void;
    onCancelPress?: () => void;
}

export const DriverArrival = ({
    isSearching,
    visible = false,
    onMessagePress,
    onDetailsPress,
    onArrivalShow,
    onClose,
    onCancelPress,
}: DriverArrivalProps) => {
    const [showArrival, setShowArrival] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const slideAnim = new Animated.Value(500);

    useEffect(() => {
        // Driver arrival only shows when visible prop is true (set when driver accepts)
        if (visible) {
            setShowArrival(true);
        } else {
            setShowArrival(false);
        }
    }, [visible]);

    useEffect(() => {
        if (showArrival || visible) {
            // Animate slide up
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        } else {
            // Animate slide down
            Animated.timing(slideAnim, {
                toValue: 500,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [showArrival, visible]);

    const handleCancelPress = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        setShowCancelModal(false);
        // Delay the onCancelPress call to allow modal animation to complete
        setTimeout(() => {
            onCancelPress?.();
        }, 300);
    };

    if (!showArrival && !visible) return null;

    const screenHeight = Dimensions.get('window').height;
    const modalHeight = screenHeight * 0.4;

    const handleOverlayPress = () => {
        onClose?.();
    };

    return (
        <TouchableOpacity
            style={styles.driverArrivalOverlay}
            onPress={handleOverlayPress}
            activeOpacity={1}
        >
            <Animated.View
                style={[
                    styles.driverArrivalContent,
                    { height: modalHeight, transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* Driver Info Container */}
                <View style={styles.driverInfoContainer}>
                    {/* Driver Image and Name */}
                    <View style={styles.driverProfileSection}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.driverImage}
                            resizeMode="cover"
                        />
                        <View style={styles.driverNameSection}>
                            <Text style={styles.driverName}>Sergio Ramirez</Text>
                            <View style={styles.ratingContainer}>
                                <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
                                <Text style={styles.ratingText}>4.9 (245 reviews)</Text>
                            </View>
                        </View>
                    </View>

                    {/* Arrival Time and Distance */}
                    <View style={styles.arrivalTimeSection}>
                        <View style={styles.timeInfoContainer}>
                            <Text style={styles.arrivalLabel}>Arriving in</Text>
                            <Text style={styles.arrivalTime}>5 mins</Text>
                        </View>
                        <View style={styles.distanceContainer}>
                            <MaterialCommunityIcons name="map-marker-distance" size={18} color="#622C9B" />
                            <Text style={styles.distanceText}>0.8 km away</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
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
                        onPress={onDetailsPress}
                    >
                        <MaterialCommunityIcons name="information-outline" size={20} color="#622C9B" />
                        <Text style={[styles.buttonText, styles.detailsButtonText]}>Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={onMessagePress}
                    >
                        <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Message</Text>
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
        </TouchableOpacity>
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
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        justifyContent: 'space-between',
    },
    driverInfoContainer: {
        flex: 1,
    },
    driverProfileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    driverImage: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: 15,
    },
    driverNameSection: {
        flex: 1,
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 3,
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
    arrivalTimeSection: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeInfoContainer: {
        alignItems: 'flex-start',
        paddingVertical: 20,
    },
    arrivalLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    arrivalTime: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#622C9B',
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    distanceText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E53935',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    cancelButtonText: {
        color: '#E53935',
    },
    detailsButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#622C9B',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    messageButton: {
        flex: 1,
        backgroundColor: '#622C9B',
        paddingVertical: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    detailsButtonText: {
        color: '#622C9B',
    },
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
