import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// --- Types ---
interface RidePopupsProps {
    visible: boolean;
    type: 'pickup' | 'dropoff' | 'rate' | 'thankyou';
    onClose?: () => void;
    onSubmitRating?: (rating: number, review: string) => void;
    driverName?: string;
}

// --- Icons ---
const CheckIcon = () => (
    <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={50} color="#534889" />
    </View>
);

// --- Component ---
export function RidePopups({
    visible,
    type,
    onClose,
    onSubmitRating,
    driverName = "Your Driver",
}: RidePopupsProps) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    // 1. Pickup Popup
    if (type === 'pickup') {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        <CheckIcon />
                        <Text style={styles.title}>Your Ride Is Here!</Text>
                        <Text style={styles.message}>
                            Your driver has arrived at your pickup point. Please meet safely and
                            verify the driver’s details before boarding.
                        </Text>

                        <View style={styles.divider} />
                        <Text style={styles.subMessage}>Remember:</Text>
                        <Text style={styles.subMessageText}>
                            Remember: Always wear your helmet and verify with SabayTa!
                        </Text>

                        <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                            <Text style={styles.primaryButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    // 2. Dropoff Popup
    if (type === 'dropoff') {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        <CheckIcon />
                        <Text style={styles.title}>You’ve Arrived at Your Destination</Text>
                        <Text style={styles.message}>
                            Thank you for riding with SabayTa! We’re glad you reached your
                            destination safely.
                        </Text>

                        <TouchableOpacity style={[styles.primaryButton, { marginTop: 20 }]} onPress={onClose}>
                            <Text style={styles.primaryButtonText}>Back To Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    // 3. Rate Popup
    if (type === 'rate') {
        return (
            <Modal visible={visible} transparent animationType="slide">
                <View style={[styles.overlay, { justifyContent: 'flex-end' }]}>
                    <View style={[styles.container, styles.bottomSheet]}>
                        <View style={styles.handle} />

                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Ionicons
                                        name="star"
                                        size={32}
                                        color={star <= rating ? '#FFD700' : '#E0E0E0'}
                                        style={{ marginHorizontal: 4 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.ratingText}>
                            {rating === 5 ? 'Excellent' : rating > 0 ? 'Good' : 'Rate Your Ride'}
                        </Text>
                        <Text style={styles.miniText}>You rated {driverName} {rating} star</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Write your text"
                            multiline
                            value={review}
                            onChangeText={setReview}
                        />

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => onSubmitRating?.(rating, review)}
                        >
                            <Text style={styles.primaryButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    // 4. Thank You Popup
    if (type === 'thankyou') {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        <CheckIcon />
                        <Text style={[styles.title, { marginTop: 15 }]}>Thank you</Text>
                        <Text style={styles.message}>
                            Thank you for your valuable feedback and tip
                        </Text>

                        <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                            <Text style={styles.primaryButtonText}>Back Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    bottomSheet: {
        width: '100%',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingBottom: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0DEEA', // Light purple
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: 'Poppins',
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: 'Poppins',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        width: '100%',
        marginVertical: 16,
    },
    subMessage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        fontFamily: 'Poppins',
    },
    subMessageText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Poppins',
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#534889',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Poppins',
    },
    // Rating styles
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#534889',
        marginBottom: 4,
        fontFamily: 'Poppins',
    },
    miniText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 20,
        fontFamily: 'Poppins',
    },
    input: {
        width: '100%',
        height: 100,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
        fontFamily: 'Poppins',
    },
});
