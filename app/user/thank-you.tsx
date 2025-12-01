import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ThankYouScreen() {
    const router = useRouter();

    const handleBackHome = () => {
        router.push('/user/home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={120} color="#34A853" />
                </View>

                <Text style={styles.title}>Thank You!</Text>
                <Text style={styles.message}>
                    Your feedback helps us improve our service and provide better experiences for everyone.
                </Text>

                <TouchableOpacity style={styles.homeButton} onPress={handleBackHome}>
                    <Ionicons name="home" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 50,
    },
    homeButton: {
        backgroundColor: '#622C9B',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
