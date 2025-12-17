import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VerificationBlockModalProps {
    visible: boolean;
    verificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
}

export const VerificationBlockModal: React.FC<VerificationBlockModalProps> = ({
    visible,
    verificationStatus
}) => {
    const router = useRouter();

    const handleVerifyNow = () => {
        router.push('/user/profile/studentverification');
    };

    const getModalContent = () => {
        switch (verificationStatus) {
            case 'none':
                return {
                    icon: 'school',
                    iconColor: '#534889',
                    title: 'Student Verification Required',
                    message: 'To use SabayTa, you need to verify your student status. This helps us ensure a safe community for students.',
                    buttonText: 'Verify Now',
                    buttonColor: '#534889'
                };
            case 'pending':
                return {
                    icon: 'hourglass-empty',
                    iconColor: '#534889',
                    title: 'Verification Pending',
                    message: 'Your student verification is currently being reviewed. This usually takes 24-48 hours. You\'ll be notified once approved.',
                    buttonText: 'Check Status',
                    buttonColor: '#534889'
                };
            case 'rejected':
                return {
                    icon: 'error-outline',
                    iconColor: '#F44336',
                    title: 'Verification Rejected',
                    message: 'Your student verification was rejected. Please review your documents and submit again with valid credentials.',
                    buttonText: 'Resubmit',
                    buttonColor: '#F44336'
                };
            default:
                return {
                    icon: 'school',
                    iconColor: '#534889',
                    title: 'Verification Required',
                    message: 'Please verify your student status to continue.',
                    buttonText: 'Verify Now',
                    buttonColor: '#534889'
                };
        }
    };

    const content = getModalContent();

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'user']);
            router.replace('/auth/Welcome');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: content.iconColor + '20' }]}>
                        <MaterialIcons name={content.icon as any} size={60} color={content.iconColor} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{content.title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{content.message}</Text>

                    {/* Button */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: content.buttonColor }]}
                        onPress={handleVerifyNow}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>{content.buttonText}</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    {/* Info Text */}
                    <Text style={styles.infoText}>
                        {verificationStatus === 'pending'
                            ? 'You cannot use the app until verification is complete.'
                            : 'SabayTa is exclusively for verified students.'}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: 'Poppins',
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
        fontFamily: 'Poppins',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '100%',
        gap: 10,
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Poppins',
    },
    infoText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        fontFamily: 'Poppins',
    },
    logoutButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    logoutText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins',
        textDecorationLine: 'underline',
    },
});
