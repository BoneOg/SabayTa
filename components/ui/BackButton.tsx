import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { PropsWithChildren } from 'react';

type BackButtonProps = {
  label?: string;
  style?: ViewStyle;
  onPress?: () => void;
};

export default function BackButton({
  label = 'Back',
  style,
  onPress,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable style={[styles.backButton, style]} onPress={onPress ?? (() => router.back())}>
      <MaterialIcons name="arrow-back-ios" size={20} color="#414141" />
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    fontFamily: 'Poppins',
    color: '#414141',
    fontSize: 17,
    marginLeft: 2,
  },
});

