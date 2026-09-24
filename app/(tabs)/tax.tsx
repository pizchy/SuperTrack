import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { formatCurrency } from '@/services/taxCalculator';
import { TaxAllocationBar } from '@/components/feature/TaxAllocationBar';

export default function TaxScreen() {
  const insets = useSafeAreaInsets();
  const { ytdSummary, incomeTransactions, expenseTransactions, allocationSettings, virtualAccount } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'bas' | 'super'>('overview');

  const totalDeductible = expenseTransactions.reduce((s, e) => s + e.deductibleAmount, 0);
  const taxableIncome = Math.max(0, ytdSummary.grossIncome - totalDeductible);
  const currentQuarter = `Q1 FY2025-26`;
  const basAmount = ytdSummary.gst;

  const tabs = [
    { id: 'overview', label: 'Tax Overview' },
    { id: 'bas', label: 'BAS / GST' },
    { id: 'super', label: 'Super' },
  ];

  const breakdownItems = [
    { label: 'Income Tax', amount: ytdSummary.incomeTax, color: Colors.IncomeTax, icon: 'account-balance' },
    { label: 'Medicare Levy (2%)', amount: ytdSummary.medicareLevy, color: Colors.Medicare, icon: 'local-hospital' },
    { label: 'GST Collected', amount: ytdSummary.gst, color: Colors.GST, icon: 'receipt' },
    { label: 'HELP/HECS', amount: ytdSummary.studentLoan, color: Colors.StudentLoan, icon: 'school' },
  ].filter((i) => i.amount > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tax & Super</Text>
        <Text style={styles.headerSub}>FY 2024-25 · ATO Compliant</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <>
            {/* Big number */}
            <View style={styles.bigCard}>
              <Text style={styles.bigLabel}>Total Tax Liability (YTD)</Text>
              <Text style={styles.bigAmount}>
                {formatCurrency(ytdSummary.incomeTax + ytdSummary.medicareLevy + ytdSummary.gst + ytdSummary.studentLoan)}
              </Text>
              <Text style={styles.bigSub}>
                Effective rate: {ytdSummary.effectiveTaxRate.toFixed(1)}% of gross income
              </Text>

              {ytdSummary.grossIncome > 0 && (
                <View style={{ marginTop: Spacing.md }}>
                  <TaxAllocationBar breakdown={ytdSummary} showLabels={true} />
                </View>
              )}
            </View>

            {/* Income summary */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Income Summary</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Gross Income (YTD)</Text>
                <Text style={styles.rowValue}>{formatCurrency(ytdSummary.grossIncome)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Business Deductions</Text>
                <Text style={[styles.rowValue, { color: Colors.Gold }]}>- {formatCurrency(totalDeductible)}</Text>
              </View>
              <View style={[styles.row, styles.rowTotal]}>
                <Text style={styles.rowLabelBold}>Taxable Income</Text>
                <Text style={styles.rowValueBold}>{formatCurrency(taxableIncome)}</Text>
              </View>
            </View>

            {/* Breakdown */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tax Breakdown</Text>
              {breakdownItems.length === 0 ? (
                <Text style={styles.emptyText}>No tax recorded yet — start adding income</Text>
              ) : (
                breakdownItems.map((item) => (
                  <View key={item.label} style={styles.breakdownItem}>
                    <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
                    <View style={[styles.breakdownIcon, { backgroundColor: item.color + '22' }]}>
                      <MaterialIcons name={item.icon as any} size={16} color={item.color} />
                    </View>
                    <Text style={styles.breakdownLabel}>{item.label}</Text>
                    <Text style={[styles.breakdownAmount, { color: item.color }]}>
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>
                ))
              )}
            </View>

            {/* Lodgement */}
            <View style={styles.lodgementCard}>
              <View style={styles.lodgementHeader}>
                <MaterialIcons name="description" size={22} color={Colors.Primary} />
                <Text style={styles.lodgementTitle}>Tax Lodgement Ready</Text>
              </View>
              <Text style={styles.lodgementText}>
                All income and deductions are tracked throughout the year. Your tax summary is ready for your accountant or for lodging directly with the ATO.
              </Text>
              <View style={styles.lodgementMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Income entries</Text>
                  <Text style={styles.metaValue}>{incomeTransactions.length}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Expense receipts</Text>
                  <Text style={styles.metaValue}>{expenseTransactions.length}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>FY Period</Text>
                  <Text style={styles.metaValue}>2024-25</Text>
                </View>
              </View>
              <Pressable style={({ pressed }) => [styles.lodgementBtn, pressed && { opacity: 0.85 }]}>
                <MaterialIcons name="download" size={16} color={Colors.TextInverse} />
                <Text style={styles.lodgementBtnText}>Download Tax Summary</Text>
              </Pressable>
            </View>
          </>
        )}

        {activeTab === 'bas' && (
          <>
            <View style={styles.bigCard}>
              <View style={styles.gstStatusRow}>
                <View style={[styles.gstStatusDot, { backgroundColor: allocationSettings.enableGST ? Colors.Success : Colors.TextMuted }]} />
                <Text style={styles.gstStatusText}>
                  GST Registered — {allocationSettings.enableGST ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <Text style={styles.bigLabel}>GST Collected (YTD)</Text>
              <Text style={[styles.bigAmount, { color: Colors.GST }]}>
                {formatCurrency(basAmount)}
              </Text>
              <Text style={styles.bigSub}>To be remitted to the ATO</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Quarter — {currentQuarter}</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>GST Collected on Sales</Text>
                <Text style={styles.rowValue}>{formatCurrency(basAmount)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>GST Credits on Purchases</Text>
                <Text style={[styles.rowValue, { color: Colors.TakeHome }]}>
                  - {formatCurrency(totalDeductible * 0.1)}
                </Text>
              </View>
              <View style={[styles.row, styles.rowTotal]}>
                <Text style={styles.rowLabelBold}>Net GST Payable</Text>
                <Text style={[styles.rowValueBold, { color: Colors.GST }]}>
                  {formatCurrency(Math.max(0, basAmount - totalDeductible * 0.1))}
                </Text>
              </View>
            </View>

            <View style={[styles.card, { borderColor: Colors.Warning + '55' }]}>
              <View style={styles.deadlineRow}>
                <MaterialIcons name="event" size={20} color={Colors.Warning} />
                <Text style={styles.deadlineTitle}>BAS Due Date</Text>
              </View>
              <Text style={styles.deadlineDate}>28 October 2025</Text>
              <Text style={styles.deadlineText}>
                Q1 FY2025-26 Business Activity Statement
              </Text>
              <Pressable style={({ pressed }) => [styles.basBtn, pressed && { opacity: 0.85 }]}>
                <Text style={styles.basBtnText}>Prepare BAS Report</Text>
              </Pressable>
            </View>
          </>
        )}

        {activeTab === 'super' && (
          <>
            <View style={styles.bigCard}>
              <MaterialIcons name="savings" size={28} color={Colors.Super} style={{ marginBottom: 4 }} />
              <Text style={styles.bigLabel}>Super Contributions (YTD)</Text>
              <Text style={[styles.bigAmount, { color: Colors.Super }]}>
                {formatCurrency(ytdSummary.superContribution)}
              </Text>
              <Text style={styles.bigSub}>
                {(allocationSettings.superRate * 100).toFixed(1)}% contribution rate
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Allocation Settings</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Current Super Rate</Text>
                <Text style={[styles.rowValue, { color: Colors.Super }]}>
                  {(allocationSettings.superRate * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>SGC Minimum (2024-25)</Text>
                <Text style={styles.rowValue}>11.5%</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Super Fund</Text>
                <Text style={styles.rowValue}>Australian Super</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Reserve Balance</Text>
                <Text style={[styles.rowValue, { color: Colors.Super }]}>
                  {formatCurrency(virtualAccount.superReserve)}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>About Super for Sole Traders</Text>
              <Text style={styles.infoText}>
                As a Sole Trader, you are not required to pay Super contributions to yourself — but it is strongly recommended for retirement savings.{'\n\n'}
                SuperTrack automatically sets aside {(allocationSettings.superRate * 100).toFixed(1)}% of every payment into your Super reserve, so you are always prepared.
              </Text>
              <View style={styles.infoHighlight}>
                <MaterialIcons name="info" size={16} color={Colors.Info} />
                <Text style={styles.infoHighlightText}>
                  Super contributions are not tax-deductible as an employee contribution, but may qualify as personal deductible contributions.
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    marginBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: Colors.Primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
  },
  tabTextActive: {
    color: Colors.TextInverse,
  },
  content: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  bigCard: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: 4,
  },
  bigLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.SemiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bigAmount: {
    fontSize: 38,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -1,
  },
  bigSub: {
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
  },
  card: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: 2,
  },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  rowTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
    paddingTop: Spacing.sm,
  },
  rowLabel: {
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
  },
  rowValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextPrimary,
  },
  rowLabelBold: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  rowValueBold: {
    fontSize: Typography.base,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownLabel: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
    fontWeight: Typography.Medium,
  },
  breakdownAmount: {
    fontSize: Typography.base,
    fontWeight: Typography.ExtraBold,
  },
  emptyText: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  lodgementCard: {
    backgroundColor: Colors.PrimaryMuted,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.Primary + '55',
    gap: Spacing.md,
  },
  lodgementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  lodgementTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.Primary,
  },
  lodgementText: {
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
    lineHeight: 20,
  },
  lodgementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  metaItem: {
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
  metaValue: {
    fontSize: Typography.base,
    fontWeight: Typography.ExtraBold,
    color: Colors.Primary,
  },
  lodgementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.Primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
  },
  lodgementBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
  gstStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  gstStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gstStatusText: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    fontWeight: Typography.SemiBold,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deadlineTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  deadlineDate: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.ExtraBold,
    color: Colors.Warning,
  },
  deadlineText: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
  },
  basBtn: {
    backgroundColor: Colors.Warning,
    paddingVertical: 13,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  basBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
  infoText: {
    fontSize: Typography.sm,
    color: Colors.TextSecondary,
    lineHeight: 22,
  },
  infoHighlight: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: Colors.InfoMuted,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: 4,
  },
  infoHighlightText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    lineHeight: 18,
  },
});
