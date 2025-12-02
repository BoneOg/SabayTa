import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DriverSearchLoadingProps {
    visible: boolean;
    onCancel: () => void;
}

export const DriverSearchLoading = ({ visible, onCancel }: DriverSearchLoadingProps) => {
    if (!visible) return null;

    return (
        <View style={styles.driverSearchOverlay}>
            <View style={styles.driverSearchContent}>
                <Image
                    source={require('../assets/images/SabayTa_logo...png')}
                    style={{ width: 200, height: 100, marginBottom: 10 }}
                    resizeMode="contain"
                />
                <Text style={styles.driverSearchTitle}>Searching for drivers...</Text>
                <Text style={styles.driverSearchMessage}>Please wait while we find a driver near you.</Text>

                <TouchableOpacity style={styles.cancelSearchButton} onPress={onCancel}>
                    <Text style={styles.cancelSearchButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    driverSearchOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000,
    },
    driverSearchContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '85%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    driverSearchTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
        textAlign: 'center',
    },
    driverSearchMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    cancelSearchButton: {
        backgroundColor: '#E35A5A',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    cancelSearchButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
