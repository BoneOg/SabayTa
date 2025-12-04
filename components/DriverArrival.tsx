import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DriverArrivalProps {
    isSearching: boolean;
    visible?: boolean;
    onMessagePress?: () => void;
    onDetailsPress?: () => void;
    onArrivalShow?: () => void;
    onClose?: () => void;
}

export const DriverArrival = ({
    isSearching,
    visible = false,
    onMessagePress,
    onDetailsPress,
    onArrivalShow,
    onClose,
}: DriverArrivalProps) => {
    const [showArrival, setShowArrival] = useState(false);
    const slideAnim = new Animated.Value(500);

    useEffect(() => {
        if (isSearching) {
            // Show the arrival modal 2 seconds after search starts
            const timer = setTimeout(() => {
                setShowArrival(true);
                // Call the callback to hide the loading modal
                onArrivalShow?.();
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setShowArrival(false);
        }
    }, [isSearching, onArrivalShow]);

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
});
