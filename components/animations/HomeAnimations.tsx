import { useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const useHomeAnimations = () => {
    const slideAnim = useRef(new Animated.Value(height)).current;
    const pinSelectionAnim = useRef(new Animated.Value(height)).current;

    return { slideAnim, pinSelectionAnim };
};
