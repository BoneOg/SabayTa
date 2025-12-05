import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface User {
    id: string;
    name: string;
    pickup: string;
    destination: string;
    date: string;
    time: string;
    distance?: string;
    estimatedTime?: string;
}

interface DriverConfirmationProps {
    visible: boolean;
    selectedUser: User | null;
    onAccept: () => void;
    onCancel: () => void;
    distance?: string | null;
    duration?: string | null;
}

export default function DriverConfirmation({
    visible,
    selectedUser,
    onAccept,
    onCancel,
    distance,
    duration,
}: DriverConfirmationProps) {
    if (!visible || !selectedUser) return null;

    return (
        <>
            {/* Distance and Duration Info on Map */}
            <View style={styles.mapInfoContainer}>
                <View style={styles.mapInfoCard}>
                    <Ionicons name="resize" size={16} color="#534889" />
                    <Text style={styles.mapInfoText}>{distance || "N/A"}</Text>
                </View>
                <View style={styles.mapInfoCard}>
                    <Ionicons name="time-outline" size={16} color="#534889" />
                    <Text style={styles.mapInfoText}>{duration || "N/A"}</Text>
                </View>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                <Text style={styles.title}>Accept this booking?</Text>

                <Text style={styles.userName}>{selectedUser.name}</Text>

                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={14} color="green" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {selectedUser.pickup}
                    </Text>
                </View>
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={14} color="red" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {selectedUser.destination}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancel}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={onAccept}
                    >
                        <Text style={styles.acceptText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    mapInfoContainer: {
        position: 'absolute',
        top: 100,
        right: 15,
        gap: 8,
        zIndex: 10,
    },
    mapInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        minWidth: 60,
    },
    mapInfoText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 11,
        color: '#333',
        fontWeight: '600',
        marginTop: 2,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#534889',
        textAlign: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#534889',
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6,
    },
    locationText: {
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 15,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#666',
    },
    acceptButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#534889',
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '600',
        color: '#fff',
    },
});
