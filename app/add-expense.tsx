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
import { formatCurrency } from '@/services/taxCalculator';
import { EXPENSE_CATEGORIES } from '@/constants/config';
import { useAlert } from '@/template';

const DEDUCTIBLE_OPTIONS = [
  { label: '100% — Fully Business', value: 100 },
  { label: '80% — Mostly Business', value: 80 },
  { label: '50% — Mixed Use', value: 50 },
  { label: '33% — Some Business', value: 33 },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addExpense } = useApp();
  const { showAlert } = useAlert();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('vehicle');
  const [deductiblePercent, setDeductiblePercent] = useState(100);

  const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const deductibleAmount = parsedAmount * (deductiblePercent / 100);

  const handleAdd = () => {
    if (parsedAmount <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid expense amount.');
      return;
    }
    if (!description.trim()) {
      showAlert('Missing Description', 'Please describe this expense.');
      return;
    }

    addExpense(parsedAmount, description.trim(), category, deductiblePercent);
    showAlert(
      'Expense Added',
      `${formatCurrency(parsedAmount)} recorded. ${formatCurrency(deductibleAmount)} is tax deductible.`,
      [{ text: 'Done', onPress: () => router.back() }]
    );
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
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount Spent (AUD)</Text>
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

        {/* Deductible preview */}
        {parsedAmount > 0 && (
          <View style={styles.deductCard}>
            <View style={styles.deductRow}>
              <View>
                <Text style={styles.deductLabel}>Total Expense</Text>
                <Text style={styles.deductTotal}>{formatCurrency(parsedAmount)}</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={20} color={Colors.TextMuted} />
              <View style={styles.deductRight}>
                <Text style={styles.deductLabel}>Tax Deductible</Text>
                <Text style={[styles.deductAmount, { color: Colors.Gold }]}>
                  {formatCurrency(deductibleAmount)}
                </Text>
                <Text style={styles.deductPct}>{deductiblePercent}% claimed</Text>
              </View>
            </View>
            <View style={styles.deductBar}>
              <View style={[styles.deductBarFill, { flex: deductiblePercent / 100 }]} />
              <View style={[styles.deductBarEmpty, { flex: 1 - deductiblePercent / 100 }]} />
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
                placeholder="e.g. Fuel for work trips, Office supplies"
                placeholderTextColor={Colors.TextMuted}
                value={description}
                onChangeText={setDescription}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.catGrid}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.catCard,
                    category === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '18' },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <MaterialIcons
                    name={cat.icon as any}
                    size={18}
                    color={category === cat.id ? cat.color : Colors.TextMuted}
                  />
                  <Text
                    style={[
                      styles.catLabel,
                      category === cat.id && { color: cat.color },
                    ]}
                    numberOfLines={2}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Business Use Percentage</Text>
            <View style={styles.deductOptions}>
              {DEDUCTIBLE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.deductOpt,
                    deductiblePercent === opt.value && styles.deductOptActive,
                  ]}
                  onPress={() => setDeductiblePercent(opt.value)}
                >
                  <Text
                    style={[
                      styles.deductOptText,
                      deductiblePercent === opt.value && styles.deductOptTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Receipt note */}
        <Pressable style={styles.receiptNote}>
          <MaterialIcons name="photo-camera" size={20} color={Colors.TextMuted} />
          <View style={{ flex: 1 }}>
            <Text style={styles.receiptNoteTitle}>Attach Receipt</Text>
            <Text style={styles.receiptNoteText}>Tap to capture or upload receipt (coming soon)</Text>
          </View>
          <MaterialIcons name="chevron-right" size={18} color={Colors.TextMuted} />
        </Pressable>

        {/* Submit */}
        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
          onPress={handleAdd}
        >
          <MaterialIcons name="receipt" size={20} color={Colors.TextInverse} />
          <Text style={styles.submitText}>Add Expense</Text>
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
    borderColor: Colors.Gold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dollarSign: {
    fontSize: 36,
    fontWeight: Typography.ExtraBold,
    color: Colors.Gold,
  },
  amountText: {
    flex: 1,
    fontSize: 40,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -1,
  },
  deductCard: {
    backgroundColor: Colors.GoldMuted,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.Gold + '44',
    gap: Spacing.md,
  },
  deductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deductLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
    marginBottom: 2,
  },
  deductTotal: {
    fontSize: Typography.xl,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
  },
  deductRight: {
    alignItems: 'flex-end',
  },
  deductAmount: {
    fontSize: Typography.xl,
    fontWeight: Typography.ExtraBold,
  },
  deductPct: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
  deductBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  deductBarFill: {
    backgroundColor: Colors.Gold,
    height: '100%',
  },
  deductBarEmpty: {
    backgroundColor: Colors.SurfaceBorder,
    height: '100%',
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
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  catCard: {
    width: '22%',
    minWidth: 75,
    alignItems: 'center',
    gap: 5,
    padding: Spacing.sm,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  catLabel: {
    fontSize: 10,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
    textAlign: 'center',
    lineHeight: 13,
  },
  deductOptions: {
    gap: Spacing.sm,
  },
  deductOpt: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  deductOptActive: {
    backgroundColor: Colors.GoldMuted,
    borderColor: Colors.Gold,
  },
  deductOptText: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
  },
  deductOptTextActive: {
    color: Colors.Gold,
  },
  receiptNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    borderStyle: 'dashed',
  },
  receiptNoteTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextSecondary,
  },
  receiptNoteText: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    marginTop: 2,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.Gold,
    paddingVertical: 17,
    borderRadius: Radius.lg,
    shadowColor: Colors.Gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    fontSize: Typography.lg,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
});
