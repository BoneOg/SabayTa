import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface DriverHeaderProps {
    onNotificationPress?: () => void;
}

export const DriverHeader = ({ onNotificationPress }: DriverHeaderProps) => {
    return (
        <View style={styles.header}>

            <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingTop: 50,
        alignItems: "center",
        position: "absolute",
        width: "100%",
        zIndex: 10,
    },
    notificationButton: {
        padding: 8,
        backgroundColor: "#534889",
        borderRadius: 8,
    },
});
