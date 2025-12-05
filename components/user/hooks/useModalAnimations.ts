import { useEffect, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import { SelectedLocation } from './useBookingState';

export const useModalAnimations = (
    modalVisible: boolean,
    fromLocation: SelectedLocation | null,
    toLocation: SelectedLocation | null,
    slideAnim: Animated.Value
) => {
    const [isModalFull, setIsModalFull] = useState(false);

    // Animate modal when it opens/closes or when content changes
    useEffect(() => {
        const { height } = Dimensions.get('window');
        if (modalVisible) {
            // Expand modal more when both locations are selected (to show Confirm button)
            const targetPosition = fromLocation && toLocation
                ? height * 0.50  // Show more of the modal (50% visible)
                : height * 0.58; // Show less (58% visible)

            Animated.spring(slideAnim, {
                toValue: targetPosition,
                useNativeDriver: false,
                tension: 65,
                friction: 11
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height, // Slide completely off screen
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    }, [modalVisible, fromLocation, toLocation]);

    return {
        isModalFull,
        setIsModalFull,
    };
};
