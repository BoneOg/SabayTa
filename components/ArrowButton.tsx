import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type ArrowButtonProps = {
  onPress: () => void;
  children?: ReactNode;
};

export default function ArrowButton({ onPress, children }: ArrowButtonProps) {
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>{children ?? <AntDesign name="arrow-right" size={24} color="#fff" />}</View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#622C9B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F0AEDA',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#622C9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

