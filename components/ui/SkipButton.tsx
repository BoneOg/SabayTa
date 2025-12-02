import { ReactNode } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SkipButtonProps = {
  onPress: () => void;
  children?: ReactNode;
};

export default function SkipButton({ onPress, children }: SkipButtonProps) {
  const insets = useSafeAreaInsets();
  
  const topSpacing = Platform.OS === 'ios' 
    ? 10   
    : Math.max(insets.top, 20) + 12;  

  return (
    <TouchableOpacity 
      style={[styles.button, { top: topSpacing }]} 
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
});