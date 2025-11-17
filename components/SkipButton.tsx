import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type SkipButtonProps = {
  onPress: () => void;
  children?: ReactNode;
};

export default function SkipButton({ onPress, children }: SkipButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
});

