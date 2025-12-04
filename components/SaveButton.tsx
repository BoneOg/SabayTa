import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SaveButtonProps {
    onPress: () => void;
    loading?: boolean;
    label?: string;
}

export default function SaveButton({ onPress, loading = false, label = 'Save Changes' }: SaveButtonProps) {
    return (
        <View style={styles.floatingButtonContainer}>
            <TouchableOpacity
                style={[styles.floatingButton, loading && styles.floatingButtonDisabled]}
                onPress={onPress}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.floatingButtonText}>{label}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    floatingButton: {
        backgroundColor: '#534889',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingButtonDisabled: {
        opacity: 0.7,
    },
    floatingButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins',
    },
});
