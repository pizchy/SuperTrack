import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, hasOnboarded } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      {/* Background hero */}
      <Image
        source={require('@/assets/images/onboarding1.png')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['rgba(6,14,30,0.35)', 'rgba(6,14,30,0.7)', Colors.Background]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Logo */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>ST</Text>
          </View>
          <Text style={styles.logoText}>SuperTrack</Text>
        </View>
        <View style={styles.auBadge}>
          <Text style={styles.auText}>🇦🇺 AU</Text>
        </View>
      </View>

      {/* Hero content */}
      <View style={[styles.heroContent, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>All-in-One Tax & Super Service</Text>
          </View>
        </View>

        <Text style={styles.headline}>
          Your Pay-As-You-Earn{'\n'}
          <Text style={styles.headlineAccent}>Tax Partner</Text>
        </Text>

        <Text style={styles.subtext}>
          Designed for Sole Traders & Freelancers in Australia.{'\n'}
          Never get surprised by a tax bill again.
        </Text>

        <View style={styles.featureRow}>
          {['Auto Tax Calc', 'Super Tracking', 'ATO Ready'].map((f) => (
            <View key={f} style={styles.featureChip}>
              <Text style={styles.featureChipText}>✓ {f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaGroup}>
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push('/onboarding')}
          >
            <Text style={styles.btnPrimaryText}>Get Started Free</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.75 }]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.btnSecondaryText}>Sign In</Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          No lock-in contract · Cancel anytime
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    fontSize: Typography.sm,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextInverse,
    letterSpacing: 0.5,
  },
  logoText: {
    fontSize: Typography.xl,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
    letterSpacing: -0.3,
  },
  auBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  auText: {
    fontSize: Typography.sm,
    color: Colors.TextPrimary,
    fontWeight: Typography.Medium,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: Colors.PrimaryMuted,
    borderWidth: 1,
    borderColor: Colors.Primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: Typography.xs,
    color: Colors.Primary,
    fontWeight: Typography.SemiBold,
    letterSpacing: 0.4,
  },
  headline: {
    fontSize: 36,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  headlineAccent: {
    color: Colors.Primary,
  },
  subtext: {
    fontSize: Typography.base,
    color: Colors.TextSecondary,
    lineHeight: 24,
  },
  featureRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  featureChip: {
    backgroundColor: Colors.SuccessMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  featureChipText: {
    fontSize: Typography.xs,
    color: Colors.Success,
    fontWeight: Typography.SemiBold,
  },
  ctaGroup: {
    gap: Spacing.sm,
  },
  btnPrimary: {
    backgroundColor: Colors.Primary,
    paddingVertical: 17,
    borderRadius: Radius.lg,
    alignItems: 'center',
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPrimaryText: {
    fontSize: Typography.lg,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
    letterSpacing: 0.2,
  },
  btnSecondary: {
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  btnSecondaryText: {
    fontSize: Typography.base,
    fontWeight: Typography.SemiBold,
    color: Colors.TextSecondary,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
});
