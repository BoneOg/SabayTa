import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PinSelectionUIProps {
    selectingLocation: 'from' | 'to' | null;
    pinSelectionAnim: Animated.Value;
    onCancel: () => void;
    onConfirm: () => void;
}

export const PinSelectionUI = ({
    selectingLocation,
    pinSelectionAnim,
    onCancel,
    onConfirm
}: PinSelectionUIProps) => {
    if (!selectingLocation) return null;

    return (
        <>
            {/* CENTER PIN */}
            <View style={styles.centerPinContainer} pointerEvents="none">
                <Ionicons
                    name="location-sharp"
                    size={40}
                    color={selectingLocation === 'from' ? "#534889" : "#EA4335"}
                />
            </View>

            {/* SLIDE UP UI */}
            <Animated.View style={[styles.pinSelectionContainer, { transform: [{ translateY: pinSelectionAnim }] }]}>
                <Text style={styles.pinSelectionText}>
                    Drag map to select {selectingLocation === 'from' ? "Pickup" : "Drop-off"} Location
                </Text>
                <View style={styles.pinSelectionButtons}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryButton} onPress={onConfirm}>
                        <Text style={styles.primaryButtonText}>Confirm Location</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    centerPinContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    pinSelectionContainer: {
        position: 'absolute',
        bottom: 80,
        left: 12,
        right: 12,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 14,
        elevation: 10,
        alignItems: 'center',
        zIndex: 1000,
        borderWidth: 1.5,
        borderColor: '#D0D0D0'
    },
    pinSelectionText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    pinSelectionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#534889',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
    secondaryButtonText: {
        color: '#333',
        fontWeight: 'bold'
    },
});
