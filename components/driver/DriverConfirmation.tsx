import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

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
}

export default function DriverConfirmation({
    visible,
    selectedUser,
    onAccept,
    onCancel,
}: DriverConfirmationProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.confirmOverlay}>
                <View style={styles.confirmModal}>
                    <View style={styles.confirmIconContainer}>
                        <Ionicons name="checkmark-circle" size={60} color="#534889" />
                    </View>

                    <Text style={styles.confirmTitle}>Accept Booking?</Text>

                    {selectedUser && (
                        <View style={styles.confirmContent}>
                            <Text style={styles.confirmText}>
                                <Text style={styles.confirmLabel}>Rider: </Text>
                                <Text style={styles.confirmValue}>{selectedUser.name}</Text>
                            </Text>

                            {/* Distance and Time Info */}
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Ionicons name="resize" size={16} color="#534889" />
                                    <Text style={styles.infoText}>
                                        {selectedUser.distance || "N/A"}
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="time-outline" size={16} color="#534889" />
                                    <Text style={styles.infoText}>
                                        {selectedUser.estimatedTime || "N/A"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.confirmLocationContainer}>
                                <View style={styles.confirmLocationRow}>
                                    <Ionicons name="location-sharp" size={16} color="green" />
                                    <Text style={styles.confirmLocationLabel}>From:</Text>
                                </View>
                                <Text
                                    style={styles.confirmLocationText}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {selectedUser.pickup}
                                </Text>
                            </View>

                            <View style={styles.confirmLocationContainer}>
                                <View style={styles.confirmLocationRow}>
                                    <Ionicons name="location-sharp" size={16} color="red" />
                                    <Text style={styles.confirmLocationLabel}>To:</Text>
                                </View>
                                <Text
                                    style={styles.confirmLocationText}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {selectedUser.destination}
                                </Text>
                            </View>

                            <Text style={styles.confirmSubText}>
                                Do you want to accept this booking?
                            </Text>
                        </View>
                    )}

                    <View style={styles.confirmButtons}>
                        <TouchableOpacity
                            style={[styles.confirmButton, styles.cancelBtn]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmButton, styles.acceptBtn]}
                            onPress={onAccept}
                        >
                            <Text style={styles.acceptBtnText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    confirmOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "flex-start",
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    confirmModal: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    confirmIconContainer: {
        alignItems: "center",
        marginBottom: 15,
    },
    confirmTitle: {
        fontSize: 22,
        fontFamily: "Poppins_400Regular",
        fontWeight: "600",
        color: "#534889",
        textAlign: "center",
        marginBottom: 20,
    },
    confirmContent: {
        marginBottom: 20,
    },
    confirmText: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        marginBottom: 10,
    },
    confirmLabel: {
        fontWeight: "600",
        color: "#333",
    },
    confirmValue: {
        color: "#534889",
        fontWeight: "500",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    infoText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
    confirmLocationContainer: {
        marginBottom: 12,
    },
    confirmLocationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    confirmLocationLabel: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        fontWeight: "600",
        color: "#666",
        marginLeft: 6,
    },
    confirmLocationText: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#333",
        paddingLeft: 22,
        lineHeight: 20,
    },
    confirmSubText: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        color: "#666",
        textAlign: "center",
        marginTop: 10,
    },
    confirmButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    cancelBtn: {
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    acceptBtn: {
        backgroundColor: "#534889",
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#666",
        fontWeight: "500",
    },
    acceptBtnText: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        color: "#fff",
        fontWeight: "600",
    },
});
