import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { allocationSettings, updateAllocationSettings, user } = useApp();

  const superOptions = [
    { label: 'SGC Minimum (11.5%)', value: 0.115 },
    { label: 'Recommended (15%)', value: 0.15 },
    { label: 'High (20%)', value: 0.20 },
  ];

  const helpRates = [
    { label: '1% (income < $54,435)', value: 0.01 },
    { label: '2% ($54,435–$62,999)', value: 0.02 },
    { label: '4.5% ($63,000–$70,000)', value: 0.045 },
  ];

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
        <Text style={styles.headerTitle}>Allocation Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Super Rate */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Superannuation Contribution</Text>
        <Text style={styles.sectionDesc}>
          Set aside a percentage of each payment for your Super fund. SGC minimum for 2024-25 is 11.5%.
        </Text>
        <View style={styles.optionList}>
          {superOptions.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionItem, allocationSettings.superRate === opt.value && styles.optionItemActive]}
              onPress={() => updateAllocationSettings({ superRate: opt.value })}
            >
              <View style={[styles.radioOuter, allocationSettings.superRate === opt.value && { borderColor: Colors.Super }]}>
                {allocationSettings.superRate === opt.value && <View style={[styles.radioInner, { backgroundColor: Colors.Super }]} />}
              </View>
              <Text style={[styles.optionText, allocationSettings.superRate === opt.value && { color: Colors.Super }]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* GST Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GST Registration</Text>
        <Text style={styles.sectionDesc}>
          If you are registered for GST (required if turnover exceeds $75,000/yr), enable this to track and remit GST automatically.
        </Text>
        <Pressable
          style={styles.toggleRow}
          onPress={() => updateAllocationSettings({ enableGST: !allocationSettings.enableGST })}
        >
          <View>
            <Text style={styles.toggleLabel}>GST Registered (10%)</Text>
            <Text style={styles.toggleSub}>
              {allocationSettings.enableGST ? 'GST will be deducted from each payment' : 'GST tracking disabled'}
            </Text>
          </View>
          <View style={[styles.toggle, allocationSettings.enableGST && styles.toggleOn]}>
            <View style={[styles.toggleThumb, allocationSettings.enableGST && styles.toggleThumbOn]} />
          </View>
        </Pressable>
      </View>

      {/* HELP/HECS Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HELP / HECS Student Loan</Text>
        <Text style={styles.sectionDesc}>
          If you have a HELP or HECS debt, enable repayment tracking. The ATO requires repayments when your income exceeds the threshold.
        </Text>
        <Pressable
          style={styles.toggleRow}
          onPress={() => updateAllocationSettings({ enableStudentLoan: !allocationSettings.enableStudentLoan })}
        >
          <View>
            <Text style={styles.toggleLabel}>HELP Repayment Active</Text>
            <Text style={styles.toggleSub}>
              {allocationSettings.enableStudentLoan ? `${(allocationSettings.studentLoanRate * 100).toFixed(0)}% repayment rate` : 'No student loan'}
            </Text>
          </View>
          <View style={[styles.toggle, allocationSettings.enableStudentLoan && { backgroundColor: Colors.StudentLoan }]}>
            <View style={[styles.toggleThumb, allocationSettings.enableStudentLoan && styles.toggleThumbOn]} />
          </View>
        </Pressable>

        {allocationSettings.enableStudentLoan && (
          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Repayment Rate</Text>
            {helpRates.map((r) => (
              <Pressable
                key={r.value}
                style={[styles.optionItem, allocationSettings.studentLoanRate === r.value && styles.optionItemActive]}
                onPress={() => updateAllocationSettings({ studentLoanRate: r.value })}
              >
                <View style={[styles.radioOuter, allocationSettings.studentLoanRate === r.value && { borderColor: Colors.StudentLoan }]}>
                  {allocationSettings.studentLoanRate === r.value && (
                    <View style={[styles.radioInner, { backgroundColor: Colors.StudentLoan }]} />
                  )}
                </View>
                <Text style={[styles.optionText, allocationSettings.studentLoanRate === r.value && { color: Colors.StudentLoan }]}>
                  {r.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <MaterialIcons name="info-outline" size={16} color={Colors.Info} />
        <Text style={styles.infoText}>
          Changes take effect on the next income recorded. Historical entries are not retroactively updated. Consult a registered tax agent for personalised advice.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.Background },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40,
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
  section: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  sectionDesc: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
    lineHeight: 20,
  },
  optionList: { gap: Spacing.sm, marginTop: 4 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.SurfaceElevated,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  optionItemActive: {
    borderColor: Colors.Primary,
    backgroundColor: Colors.PrimaryMuted,
  },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.TextMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  optionText: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  toggleLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextPrimary,
  },
  toggleSub: { fontSize: Typography.xs, color: Colors.TextMuted, marginTop: 2 },
  toggle: {
    width: 48, height: 26, borderRadius: 13,
    backgroundColor: Colors.SurfaceBorder,
    padding: 3, justifyContent: 'center',
  },
  toggleOn: { backgroundColor: Colors.Primary },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.TextMuted,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: { backgroundColor: Colors.TextInverse, alignSelf: 'flex-end' },
  subSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.SurfaceBorder,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  subSectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: Colors.InfoMuted,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    lineHeight: 18,
  },
});
