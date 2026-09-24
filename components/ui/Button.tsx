import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.Primary : Colors.TextInverse}
        />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },

  // Variants
  primary: {
    backgroundColor: Colors.Primary,
    ...Shadows.glow,
  },
  secondary: {
    backgroundColor: Colors.SurfaceElevated,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.Primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.Danger,
  },

  // Sizes
  size_sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm },
  size_md: { paddingHorizontal: Spacing.lg, paddingVertical: 14 },
  size_lg: { paddingHorizontal: Spacing.xl, paddingVertical: 18, borderRadius: Radius.lg },

  // Text
  text: {
    fontWeight: Typography.SemiBold,
    letterSpacing: 0.3,
  },
  text_primary: { color: Colors.TextInverse },
  text_secondary: { color: Colors.TextPrimary },
  text_outline: { color: Colors.Primary },
  text_ghost: { color: Colors.Primary },
  text_danger: { color: Colors.TextPrimary },

  textSize_sm: { fontSize: Typography.sm },
  textSize_md: { fontSize: Typography.base },
  textSize_lg: { fontSize: Typography.lg },
});
