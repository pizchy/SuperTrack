import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'highlight' | 'ghost';
  padding?: number;
}

export function Card({ children, style, variant = 'default', padding }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        padding !== undefined && { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  elevated: {
    backgroundColor: Colors.SurfaceElevated,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    ...Shadows.md,
  },
  highlight: {
    backgroundColor: Colors.PrimaryMuted,
    borderWidth: 1,
    borderColor: Colors.Primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});
