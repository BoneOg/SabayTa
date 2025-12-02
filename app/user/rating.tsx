import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RatingScreen() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        router.push('/user/thank-you');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/300?img=12' }}
                    style={styles.driverImage}
                />

                <Text style={styles.title}>How was your ride?</Text>
                <Text style={styles.subtitle}>Rate your experience with Sergio</Text>

                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            style={styles.starButton}
                        >
                            <Ionicons
                                name={star <= rating ? 'star' : 'star-outline'}
                                size={50}
                                color={star <= rating ? '#FFB800' : '#D0D0D0'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <TextInput
                    style={styles.feedbackInput}
                    placeholder="Share your feedback (optional)"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    value={feedback}
                    onChangeText={setFeedback}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={rating === 0}
                >
                    <Text style={styles.submitButtonText}>Submit Rating</Text>
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
        paddingTop: 80,
        paddingHorizontal: 30,
    },
    driverImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    starButton: {
        marginHorizontal: 5,
    },
    feedbackInput: {
        width: '100%',
        backgroundColor: '#F8F6FC',
        borderRadius: 15,
        padding: 15,
        fontSize: 15,
        color: '#000',
        marginBottom: 30,
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    submitButton: {
        backgroundColor: '#534889',
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#D0D0D0',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
