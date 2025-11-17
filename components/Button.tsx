import { ThemedText } from '@/components/themed-text';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: ReactNode;
  disabled?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  leftIcon,
  disabled = false,
}: ButtonProps) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        isGhost ? styles.ghostButton : isOutline ? styles.outlineButton : styles.primaryButton,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <View style={styles.content}>
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <ThemedText
          style={[
            styles.baseText,
            isGhost ? styles.ghostText : isOutline ? styles.outlineText : styles.primaryText,
            textStyle,
          ]}
        >
          {label}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#534889',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#534889',
    backgroundColor: 'transparent',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  baseText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#534889',
  },
  ghostText: {
    color: '#534889',
  },
});

