import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'Free forever',
    color: Colors.TextSecondary,
    features: [
      'Virtual bank account',
      'Up to 10 income entries/mo',
      'Basic tax calculator',
      'Expense tracking (5/mo)',
      'ATO tax bracket lookup',
    ],
    missing: ['BAS & GST reports', 'Super allocation auto', 'Unlimited entries', 'Tax lodgement export', 'Priority support'],
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 19.99,
    period: 'per month',
    color: Colors.Primary,
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'Unlimited income & expense entries',
      'BAS & GST quarterly reports',
      'Super allocation automation',
      'Tax lodgement export (PDF)',
      'HELP/HECS repayment tracking',
      'Priority email support',
    ],
    missing: [],
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    price: 159,
    period: 'per year · save $81',
    color: Colors.Gold,
    badge: 'Best Value',
    features: [
      'Everything in Pro Monthly',
      'Save 33% vs monthly',
      'Dedicated accountant access',
      'BAS lodgement assistance',
      'Phone support',
    ],
    missing: [],
  },
];

export default function PricingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const { showAlert } = useAlert();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const handleSelect = (planId: string) => {
    if (planId === user.plan) {
      showAlert('Current Plan', 'You are already on this plan.');
      return;
    }
    showAlert(
      'Upgrade Plan',
      `Switch to ${planId === 'free' ? 'Starter' : planId === 'monthly' ? 'Pro Monthly' : 'Pro Annual'}? (Billing integration coming soon)`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => router.back() },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.TextSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Plans & Pricing</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Simple, Transparent{'\n'}Pricing</Text>
        <Text style={styles.heroSub}>
          No lock-in contract. Pay month-to-month or save with annual billing.
          No income this month? Pay nothing.
        </Text>
      </View>

      {/* Billing toggle */}
      <View style={styles.billingToggle}>
        {(['monthly', 'annual'] as const).map((b) => (
          <Pressable
            key={b}
            style={[styles.billingBtn, billing === b && styles.billingBtnActive]}
            onPress={() => setBilling(b)}
          >
            <Text style={[styles.billingText, billing === b && styles.billingTextActive]}>
              {b === 'monthly' ? 'Monthly' : 'Annual — Save 33%'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Plan Cards */}
      {PLANS.filter((p) => p.id === 'free' || (billing === 'monthly' ? p.id === 'monthly' : p.id === 'annual') || p.id === 'monthly').map((plan) => {
        const isCurrentPlan = user.plan === plan.id;
        const visible = plan.id === 'free' || plan.id === (billing === 'annual' ? 'annual' : 'monthly');
        if (!visible && billing === 'annual' && plan.id === 'monthly') return null;

        return (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              { borderColor: plan.color + (isCurrentPlan ? 'FF' : '55') },
              isCurrentPlan && styles.planCardActive,
            ]}
          >
            {plan.badge ? (
              <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.planBadgeText}>{plan.badge}</Text>
              </View>
            ) : null}

            {isCurrentPlan ? (
              <View style={styles.currentBadge}>
                <MaterialIcons name="check-circle" size={12} color={plan.color} />
                <Text style={[styles.currentText, { color: plan.color }]}>Current Plan</Text>
              </View>
            ) : null}

            <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>

            <View style={styles.priceRow}>
              {plan.price === 0 ? (
                <Text style={styles.planPrice}>Free</Text>
              ) : (
                <>
                  <Text style={styles.planPriceCurrency}>$</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </>
              )}
              <Text style={styles.planPeriod}>/{plan.period}</Text>
            </View>

            <View style={styles.featureList}>
              {plan.features.map((f) => (
                <View key={f} style={styles.featureItem}>
                  <MaterialIcons name="check" size={16} color={plan.color} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
              {plan.missing?.map((f) => (
                <View key={f} style={styles.featureItem}>
                  <MaterialIcons name="close" size={16} color={Colors.TextMuted} />
                  <Text style={[styles.featureText, { color: Colors.TextMuted, textDecorationLine: 'line-through' }]}>{f}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.selectBtn,
                { borderColor: plan.color, backgroundColor: isCurrentPlan ? plan.color + '22' : plan.color },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => handleSelect(plan.id)}
            >
              <Text style={[styles.selectBtnText, { color: isCurrentPlan ? plan.color : Colors.TextInverse }]}>
                {isCurrentPlan ? 'Current Plan' : `Get ${plan.name}`}
              </Text>
            </Pressable>
          </View>
        );
      })}

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <MaterialIcons name="info-outline" size={16} color={Colors.TextMuted} />
        <Text style={styles.disclaimerText}>
          SuperTrack is designed for Australian Sole Traders only. All prices are in AUD and include GST. Cancel or change plans anytime — no contracts or exit fees.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  content: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  heroSection: {
    gap: Spacing.sm,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  heroSub: {
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
    lineHeight: 22,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.Surface,
    borderRadius: Radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  billingBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  billingBtnActive: {
    backgroundColor: Colors.Primary,
  },
  billingText: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
  },
  billingTextActive: {
    color: Colors.TextInverse,
  },
  planCard: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    gap: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardActive: {
    backgroundColor: Colors.SurfaceElevated,
  },
  planBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  planBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginBottom: -Spacing.sm,
  },
  currentText: {
    fontSize: Typography.xs,
    fontWeight: Typography.Bold,
  },
  planName: {
    fontSize: Typography.xl,
    fontWeight: Typography.ExtraBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  planPriceCurrency: {
    fontSize: Typography.xl,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
    paddingBottom: 4,
  },
  planPrice: {
    fontSize: 40,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -1,
  },
  planPeriod: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
    paddingBottom: 6,
  },
  featureList: {
    gap: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
    flex: 1,
  },
  selectBtn: {
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  selectBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
  },
  disclaimer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    lineHeight: 18,
  },
});
