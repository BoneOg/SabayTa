import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface OnTheWayProps {
    visible: boolean;
    riderName: string;
    distance: string | null;
    duration: string | null;
    passengerPickedUp?: boolean;
    onCancel: () => void;
    onPickedUp: () => void;
    onCompleteTrip?: () => void;
    onChatPress: () => void;
}

export default function OnTheWay({
    visible,
    riderName,
    distance,
    duration,
    passengerPickedUp = false,
    onCancel,
    onPickedUp,
    onCompleteTrip,
    onChatPress,
}: OnTheWayProps) {
    const [slideAnim] = useState(new Animated.Value(0));
    const slideWidth = width - 120;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx > 0 && gestureState.dx <= slideWidth) {
                slideAnim.setValue(gestureState.dx);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx > slideWidth * 0.7) {
                Animated.timing(slideAnim, {
                    toValue: slideWidth,
                    duration: 200,
                    useNativeDriver: false,
                }).start(() => {
                    // Call appropriate handler based on state
                    if (passengerPickedUp) {
                        onCompleteTrip?.();
                    } else {
                        onPickedUp();
                    }
                    slideAnim.setValue(0);
                });
            } else {
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    if (!visible) return null;

    return (
        <>
            {/* Floating Action Buttons */}
            <View style={styles.floatingButtons}>
                <TouchableOpacity style={styles.cancelButtonFloating} onPress={onCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chatButtonFloating} onPress={onChatPress}>
                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>{passengerPickedUp ? "Heading to destination" : "On the way"}</Text>
                <Text style={styles.subtitle}>{passengerPickedUp ? `Dropping off ${riderName}` : `Picking up ${riderName}`}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="resize" size={16} color="#534889" />
                        <Text style={styles.infoText}>{distance || "N/A"}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={16} color="#534889" />
                        <Text style={styles.infoText}>{duration || "N/A"}</Text>
                    </View>
                </View>

                <View style={styles.sliderContainer}>
                    <View style={styles.sliderTrack}>
                        <Text style={styles.sliderText}>{passengerPickedUp ? "Swipe to confirm drop off" : "Swipe to confirm pickup"}</Text>
                        <Animated.View
                            style={[
                                styles.sliderThumb,
                                {
                                    transform: [{ translateX: slideAnim }],
                                },
                            ]}
                            {...panResponder.panHandlers}
                        >
                            <Ionicons name="chevron-forward" size={28} color="#fff" />
                        </Animated.View>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    floatingButtons: {
        position: 'absolute',
        bottom: 315,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 20,
    },
    cancelButtonFloating: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cancelButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#666',
    },
    chatButtonFloating: {
        backgroundColor: '#534889',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    chatButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#fff',
    },
    container: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#534889',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f5f5f5',
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
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    sliderContainer: {
        marginBottom: 0,
    },
    sliderTrack: {
        height: 60,
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    sliderText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#999',
    },
    sliderThumb: {
        position: 'absolute',
        left: 5,
        width: 50,
        height: 50,
        backgroundColor: '#534889',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
