import React from 'react';
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
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { formatCurrency } from '@/services/taxCalculator';
import { TaxAllocationBar } from '@/components/feature/TaxAllocationBar';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/config';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { virtualAccount, incomeTransactions, expenseTransactions, ytdSummary, user } = useApp();

  const totalExpenseDeductible = expenseTransactions.reduce((s, e) => s + e.deductibleAmount, 0);
  const recentIncome = incomeTransactions.slice(0, 3);

  const quickActions = [
    { label: 'Add Income', icon: 'add-circle', color: Colors.Primary, route: '/add-income' },
    { label: 'Add Expense', icon: 'receipt', color: Colors.Gold, route: '/add-expense' },
    { label: 'Tax Report', icon: 'assessment', color: Colors.Info, route: '/(tabs)/tax' },
    { label: 'Settings', icon: 'settings', color: Colors.TextSecondary, route: '/settings' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user.name.split(' ')[0]} 👋</Text>
        </View>
        <Pressable
          style={styles.planBadge}
          onPress={() => router.push('/pricing')}
        >
          <MaterialIcons name="workspace-premium" size={14} color={Colors.Gold} />
          <Text style={styles.planText}>{user.plan === 'free' ? 'Free' : user.plan === 'monthly' ? 'Pro' : 'Annual'}</Text>
        </Pressable>
      </View>

      {/* Virtual Bank Card */}
      <View style={styles.bankCard}>
        <View style={styles.bankCardBg}>
          <View style={styles.bankCardGlow} />
        </View>
        <View style={styles.bankCardHeader}>
          <View>
            <Text style={styles.bankLabel}>SuperTrack Virtual Account</Text>
            <Text style={styles.bankNumbers}>
              BSB {virtualAccount.bsb} · {virtualAccount.accountNumber}
            </Text>
          </View>
          <View style={styles.stLogo}>
            <Text style={styles.stLogoText}>ST</Text>
          </View>
        </View>

        <View style={styles.balanceSection}>
          <View style={styles.balanceMain}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(virtualAccount.availableBalance)}</Text>
            <Text style={styles.balanceSubtext}>After tax & super deductions</Text>
          </View>
        </View>

        <View style={styles.bankCardFooter}>
          <View style={styles.reserveItem}>
            <View style={[styles.reserveDot, { backgroundColor: Colors.IncomeTax }]} />
            <View>
              <Text style={styles.reserveLabel}>Tax Reserve</Text>
              <Text style={styles.reserveAmount}>{formatCurrency(virtualAccount.taxReserve)}</Text>
            </View>
          </View>
          <View style={styles.reserveDivider} />
          <View style={styles.reserveItem}>
            <View style={[styles.reserveDot, { backgroundColor: Colors.Super }]} />
            <View>
              <Text style={styles.reserveLabel}>Super Reserve</Text>
              <Text style={styles.reserveAmount}>{formatCurrency(virtualAccount.superReserve)}</Text>
            </View>
          </View>
          <View style={styles.reserveDivider} />
          <View style={styles.reserveItem}>
            <View style={[styles.reserveDot, { backgroundColor: Colors.TextMuted }]} />
            <View>
              <Text style={styles.reserveLabel}>Total Balance</Text>
              <Text style={styles.reserveAmount}>{formatCurrency(virtualAccount.balance)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {quickActions.map((action) => (
          <Pressable
            key={action.label}
            style={({ pressed }) => [
              styles.quickAction,
              pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => router.push(action.route as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '22' }]}>
              <MaterialIcons name={action.icon as any} size={22} color={action.color} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* YTD Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>FY {new Date().getFullYear()}-{String(new Date().getFullYear() + 1).slice(2)} Summary</Text>
          <Pressable onPress={() => router.push('/(tabs)/tax')}>
            <Text style={styles.seeAll}>See details</Text>
          </Pressable>
        </View>

        <View style={styles.ytdCard}>
          <View style={styles.ytdStats}>
            <View style={styles.ytdStat}>
              <Text style={styles.ytdStatLabel}>Gross Income</Text>
              <Text style={[styles.ytdStatValue, { color: Colors.TextPrimary }]}>
                {formatCurrency(ytdSummary.grossIncome)}
              </Text>
            </View>
            <View style={styles.ytdStat}>
              <Text style={styles.ytdStatLabel}>Tax Paid</Text>
              <Text style={[styles.ytdStatValue, { color: Colors.IncomeTax }]}>
                {formatCurrency(ytdSummary.incomeTax + ytdSummary.medicareLevy)}
              </Text>
            </View>
            <View style={styles.ytdStat}>
              <Text style={styles.ytdStatLabel}>Take Home</Text>
              <Text style={[styles.ytdStatValue, { color: Colors.TakeHome }]}>
                {formatCurrency(ytdSummary.netIncome)}
              </Text>
            </View>
          </View>

          {ytdSummary.grossIncome > 0 ? (
            <TaxAllocationBar breakdown={ytdSummary} showLabels={false} />
          ) : null}

          <View style={styles.deductibleRow}>
            <MaterialIcons name="savings" size={16} color={Colors.Gold} />
            <Text style={styles.deductibleText}>
              <Text style={{ color: Colors.Gold, fontWeight: Typography.Bold }}>
                {formatCurrency(totalExpenseDeductible)}
              </Text>{' '}
              in claimable deductions this year
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Income */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Income</Text>
          <Pressable onPress={() => router.push('/(tabs)/income')}>
            <Text style={styles.seeAll}>View all</Text>
          </Pressable>
        </View>

        <View style={styles.recentList}>
          {recentIncome.map((t) => {
            const cat = INCOME_CATEGORIES.find((c) => c.id === t.category);
            return (
              <View key={t.id} style={styles.recentItem}>
                <View style={styles.recentIconWrap}>
                  <MaterialIcons name={cat?.icon as any || 'attach-money'} size={18} color={Colors.Primary} />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentDesc} numberOfLines={1}>{t.description}</Text>
                  <Text style={styles.recentDate}>{new Date(t.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</Text>
                </View>
                <View style={styles.recentAmounts}>
                  <Text style={styles.recentGross}>{formatCurrency(t.amount)}</Text>
                  <Text style={styles.recentNet}>{formatCurrency(t.taxBreakdown.netIncome)} net</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* ATO Status */}
      <View style={styles.atoCard}>
        <View style={styles.atoIcon}>
          <MaterialIcons name="verified" size={22} color={Colors.Success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.atoTitle}>ATO Compliant</Text>
          <Text style={styles.atoText}>All records up to date · BAS due 28 Oct 2025</Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color={Colors.TextMuted} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
  },
  userName: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -0.3,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.GoldMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.Gold,
  },
  planText: {
    fontSize: Typography.xs,
    fontWeight: Typography.Bold,
    color: Colors.Gold,
  },
  bankCard: {
    borderRadius: Radius.xl,
    backgroundColor: '#0D2540',
    borderWidth: 1,
    borderColor: Colors.Primary + '44',
    padding: Spacing.md,
    gap: Spacing.md,
    overflow: 'hidden',
    ...Shadows.glow,
  },
  bankCardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  bankCardGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.Primary,
    opacity: 0.06,
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bankNumbers: {
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
    fontWeight: Typography.Medium,
    marginTop: 3,
  },
  stLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stLogoText: {
    fontSize: Typography.sm,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextInverse,
  },
  balanceSection: {
    gap: 4,
  },
  balanceMain: {
    gap: 4,
  },
  balanceLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.SemiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -1,
  },
  balanceSubtext: {
    fontSize: Typography.xs,
    color: Colors.TakeHome,
    fontWeight: Typography.Medium,
  },
  bankCardFooter: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  reserveItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reserveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reserveLabel: {
    fontSize: 10,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
  },
  reserveAmount: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    fontWeight: Typography.Bold,
  },
  reserveDivider: {
    width: 1,
    backgroundColor: Colors.SurfaceBorder,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 10,
    color: Colors.TextSecondary,
    fontWeight: Typography.SemiBold,
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  seeAll: {
    fontSize: Typography.sm,
    color: Colors.Primary,
    fontWeight: Typography.SemiBold,
  },
  ytdCard: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.md,
  },
  ytdStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ytdStat: {
    gap: 4,
    flex: 1,
    alignItems: 'center',
  },
  ytdStatLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
  },
  ytdStatValue: {
    fontSize: Typography.base,
    fontWeight: Typography.ExtraBold,
  },
  deductibleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.GoldMuted,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  deductibleText: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    fontWeight: Typography.Medium,
    flex: 1,
  },
  recentList: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  recentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.PrimaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    flex: 1,
    gap: 3,
  },
  recentDesc: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextPrimary,
  },
  recentDate: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
  recentAmounts: {
    alignItems: 'flex-end',
    gap: 2,
  },
  recentGross: {
    fontSize: Typography.sm,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  recentNet: {
    fontSize: Typography.xs,
    color: Colors.TakeHome,
    fontWeight: Typography.Medium,
  },
  atoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.SuccessMuted,
    borderWidth: 1,
    borderColor: Colors.Success + '44',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  atoIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.SuccessMuted,
    borderWidth: 1,
    borderColor: Colors.Success + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atoTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.Bold,
    color: Colors.Success,
  },
  atoText: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    marginTop: 2,
  },
});
