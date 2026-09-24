import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { calculateTaxBreakdownForIncome, formatCurrency } from '@/services/taxCalculator';
import { INCOME_CATEGORIES } from '@/constants/config';
import { TaxAllocationBar } from '@/components/feature/TaxAllocationBar';
import { useAlert } from '@/template';

export default function AddIncomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addIncome, incomeTransactions, allocationSettings, ytdSummary } = useApp();
  const { showAlert } = useAlert();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('contract');
  const [platform, setPlatform] = useState('');

  const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const preview = parsedAmount > 0
    ? calculateTaxBreakdownForIncome(parsedAmount, ytdSummary.grossIncome, allocationSettings)
    : null;

  const handleAdd = () => {
    if (parsedAmount <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid income amount.');
      return;
    }
    if (!description.trim()) {
      showAlert('Missing Description', 'Please add a description for this income.');
      return;
    }

    addIncome(parsedAmount, description.trim(), category, platform.trim() || undefined);
    showAlert('Income Recorded', `${formatCurrency(parsedAmount)} added. Take home: ${preview ? formatCurrency(preview.netIncome) : ''}`, [
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.Background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.TextSecondary} />
          </Pressable>
          <Text style={styles.headerTitle}>Record Income</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Amount input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount Received (AUD)</Text>
          <View style={styles.amountInput}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountText}
              placeholder="0.00"
              placeholderTextColor={Colors.TextMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Live preview */}
        {preview && (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <MaterialIcons name="flash-on" size={16} color={Colors.Primary} />
              <Text style={styles.previewTitle}>Live Tax Calculation</Text>
            </View>
            <TaxAllocationBar breakdown={preview} showLabels={true} />
            <View style={styles.previewHighlight}>
              <Text style={styles.previewHighlightLabel}>Your take home</Text>
              <Text style={styles.previewHighlightAmount}>
                {formatCurrency(preview.netIncome)}
              </Text>
              <Text style={styles.previewHighlightSub}>
                {(100 - preview.effectiveTaxRate).toFixed(1)}% of gross · {preview.effectiveTaxRate}% effective tax rate
              </Text>
            </View>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Website project for Client X"
                placeholderTextColor={Colors.TextMuted}
                value={description}
                onChangeText={setDescription}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {INCOME_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[styles.catChip, category === cat.id && styles.catChipActive]}
                  onPress={() => setCategory(cat.id)}
                >
                  <MaterialIcons
                    name={cat.icon as any}
                    size={14}
                    color={category === cat.id ? Colors.TextInverse : Colors.TextMuted}
                  />
                  <Text style={[styles.catText, category === cat.id && styles.catTextActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Platform / Payer (optional)</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Uber, Upwork, Direct Transfer"
                placeholderTextColor={Colors.TextMuted}
                value={platform}
                onChangeText={setPlatform}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={16} color={Colors.Info} />
          <Text style={styles.infoText}>
            Tax is calculated using ATO 2024-25 rates. Amounts include Income Tax, Medicare Levy{allocationSettings.enableGST ? ', GST' : ''} and Super ({(allocationSettings.superRate * 100).toFixed(1)}%).
          </Text>
        </View>

        {/* Submit */}
        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
          onPress={handleAdd}
        >
          <MaterialIcons name="add-circle" size={20} color={Colors.TextInverse} />
          <Text style={styles.submitText}>Record Income</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  amountSection: {
    gap: Spacing.sm,
  },
  amountLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Surface,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.Primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dollarSign: {
    fontSize: 36,
    fontWeight: Typography.ExtraBold,
    color: Colors.Primary,
  },
  amountText: {
    flex: 1,
    fontSize: 40,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -1,
  },
  previewCard: {
    backgroundColor: Colors.PrimaryMuted,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.Primary + '55',
    gap: Spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  previewTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.Bold,
    color: Colors.Primary,
  },
  previewHighlight: {
    alignItems: 'center',
    backgroundColor: Colors.Background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
  },
  previewHighlightLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewHighlightAmount: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.ExtraBold,
    color: Colors.TakeHome,
    letterSpacing: -0.5,
  },
  previewHighlightSub: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
  },
  form: {
    gap: Spacing.md,
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextSecondary,
  },
  inputWrap: {
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  input: {
    paddingVertical: 14,
    fontSize: Typography.base,
    color: Colors.TextPrimary,
  },
  catRow: {
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRadius: Radius.full,
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  catChipActive: {
    backgroundColor: Colors.Primary,
    borderColor: Colors.Primary,
  },
  catText: {
    fontSize: Typography.xs,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
  },
  catTextActive: {
    color: Colors.TextInverse,
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.Primary,
    paddingVertical: 17,
    borderRadius: Radius.lg,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    fontSize: Typography.lg,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
});
