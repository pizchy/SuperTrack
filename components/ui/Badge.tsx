import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Radius } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color, textColor, size = 'md' }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        size === 'sm' && styles.small,
        color ? { backgroundColor: color + '22' } : styles.defaultBg,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSmall,
          { color: textColor || color || Colors.Primary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultBg: {
    backgroundColor: Colors.PrimaryMuted,
  },
  text: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
  },
  textSmall: {
    fontSize: Typography.xs,
  },
});
