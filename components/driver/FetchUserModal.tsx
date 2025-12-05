import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { height } = Dimensions.get("window");

interface FetchUserModalProps {
    visible: boolean;
    slideAnim: Animated.Value;
    onClose: () => void;
    onStart: () => void;
}

export const FetchUserModal = ({ visible, slideAnim, onClose, onStart }: FetchUserModalProps) => {
    if (!visible) return null;

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modal30,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', width: '100%' }}>
                        <FontAwesome5
                            name="user-alt"
                            size={35}
                            color="#534889"
                            style={{ marginBottom: 10 }}
                        />

                        <Text style={styles.modalText}>Fetch a User</Text>

                        <Text style={styles.modalSubText}>
                            Discover passengers waiting for a ride nearby.
                        </Text>

                        <TouchableOpacity style={styles.modalButton} onPress={onStart}>
                            <Text style={styles.modalButtonText}>Start</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
        zIndex: 15,
    },
    modal30: {
        width: "100%",
        height: height * 0.35,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom: 70,
    },
    modalText: {
        fontSize: 18,
        fontFamily: "Poppins_400Regular,",
        color: "#534889",
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: "#534889",
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 5,
    },
    modalButtonText: {
        color: "#fff",
        fontFamily: "Poppins_400Regular,",
        fontSize: 16,
    },
    modalSubText: {
        fontSize: 12,
        color: "#666",
        fontFamily: "Poppins_400Regular",
        marginTop: 4,
        marginBottom: 12,
        textAlign: "center",
    },
});
