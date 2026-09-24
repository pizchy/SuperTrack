import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    image: require('@/assets/images/onboarding1.png'),
    tag: 'Virtual Banking',
    title: 'Your Own\nBusiness Account',
    subtitle:
      'Get a dedicated SuperTrack virtual bank account. Record all your income in one place — rideshare, contracts, trades & more.',
    highlight: 'BSB + Account Number included',
  },
  {
    image: require('@/assets/images/onboarding2.png'),
    tag: 'Auto Tax',
    title: 'Tax Calculated\nInstantly',
    subtitle:
      'Every dollar recorded triggers automatic calculation of Income Tax, Medicare Levy, GST and Super — just like having a payroll system.',
    highlight: 'ATO compliant calculations',
  },
  {
    image: require('@/assets/images/onboarding3.png'),
    tag: 'Super & Savings',
    title: 'Build Your\nFuture Automatically',
    subtitle:
      'Set your Super allocation rate and watch your retirement fund grow with every payment. Stay ahead of your financial future.',
    highlight: 'Tax lodgement documents ready',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: width * next, animated: true });
      setCurrentIndex(next);
    } else {
      completeOnboarding();
      router.replace('/login');
    }
  };

  const skip = () => {
    completeOnboarding();
    router.replace('/login');
  };

  const slide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={{ width, height: height }}>
            <Image
              source={s.image}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={400}
            />
            <LinearGradient
              colors={['rgba(6,14,30,0)', 'rgba(6,14,30,0.6)', Colors.Background]}
              locations={[0.1, 0.5, 0.85]}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ))}
      </ScrollView>

      {/* Skip */}
      <Pressable
        style={[styles.skipBtn, { top: insets.top + Spacing.md }]}
        onPress={skip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Content overlay */}
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{slide.tag}</Text>
          </View>
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        <View style={styles.highlightRow}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>{slide.highlight}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
          onPress={goToNext}
        >
          <Text style={styles.nextText}>
            {currentIndex < SLIDES.length - 1 ? 'Continue' : 'Get Started'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  skipBtn: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
  },
  skipText: {
    color: Colors.TextSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.Medium,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.Primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.SurfaceBorder,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: Colors.PrimaryMuted,
    borderWidth: 1,
    borderColor: Colors.Primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: Typography.xs,
    color: Colors.Primary,
    fontWeight: Typography.SemiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.TextSecondary,
    lineHeight: 24,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.Gold,
  },
  highlightText: {
    fontSize: Typography.sm,
    color: Colors.Gold,
    fontWeight: Typography.SemiBold,
  },
  nextBtn: {
    backgroundColor: Colors.Primary,
    paddingVertical: 17,
    borderRadius: Radius.lg,
    alignItems: 'center',
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  nextText: {
    fontSize: Typography.lg,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
});
