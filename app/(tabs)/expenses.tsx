import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { formatCurrency } from '@/services/taxCalculator';
import { EXPENSE_CATEGORIES } from '@/constants/config';

export default function ExpensesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { expenseTransactions } = useApp();
  const [filter, setFilter] = useState('all');

  const totalExpenses = expenseTransactions.reduce((s, e) => s + e.amount, 0);
  const totalDeductible = expenseTransactions.reduce((s, e) => s + e.deductibleAmount, 0);
  const withReceipts = expenseTransactions.filter((e) => e.hasReceipt).length;

  const filters = [{ id: 'all', label: 'All' }, ...EXPENSE_CATEGORIES.map((c) => ({ id: c.id, label: c.label.split(' ')[0] }))];

  const filtered = filter === 'all'
    ? expenseTransactions
    : expenseTransactions.filter((e) => e.category === filter);

  const getCategory = (id: string) => EXPENSE_CATEGORIES.find((c) => c.id === id);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Expenses</Text>
          <Text style={styles.headerSub}>{expenseTransactions.length} receipts this FY</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/add-expense')}
        >
          <MaterialIcons name="add" size={20} color={Colors.TextInverse} />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderColor: Colors.Gold + '44' }]}>
          <MaterialIcons name="savings" size={20} color={Colors.Gold} />
          <Text style={styles.summaryLabel}>Tax Deductible</Text>
          <Text style={[styles.summaryValue, { color: Colors.Gold }]}>
            {formatCurrency(totalDeductible)}
          </Text>
          <Text style={styles.summaryHint}>Claimable this year</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: Colors.Info + '44' }]}>
          <MaterialIcons name="receipt-long" size={20} color={Colors.Info} />
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={[styles.summaryValue, { color: Colors.TextPrimary }]}>
            {formatCurrency(totalExpenses)}
          </Text>
          <Text style={styles.summaryHint}>{withReceipts} receipts saved</Text>
        </View>
      </View>

      {/* Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((f) => (
          <Pressable
            key={f.id}
            style={[styles.chip, filter === f.id && styles.chipActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[styles.chipText, filter === f.id && styles.chipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="receipt-long" size={48} color={Colors.TextMuted} />
            <Text style={styles.emptyTitle}>No expenses yet</Text>
            <Text style={styles.emptyText}>Add business expenses to claim tax deductions</Text>
          </View>
        }
        renderItem={({ item }) => {
          const cat = getCategory(item.category);
          const dateStr = new Date(item.date).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
          });

          return (
            <View style={styles.expenseCard}>
              <View style={[styles.catIcon, { backgroundColor: (cat?.color || Colors.Primary) + '22' }]}>
                <MaterialIcons name={cat?.icon as any || 'receipt'} size={20} color={cat?.color || Colors.Primary} />
              </View>

              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDesc} numberOfLines={1}>{item.description}</Text>
                <View style={styles.expenseMeta}>
                  <Text style={styles.expenseDate}>{dateStr}</Text>
                  <View style={styles.deductBadge}>
                    <Text style={styles.deductBadgeText}>{item.deductiblePercent}% deductible</Text>
                  </View>
                  {item.hasReceipt ? (
                    <View style={styles.receiptBadge}>
                      <MaterialIcons name="attachment" size={10} color={Colors.Success} />
                      <Text style={styles.receiptText}>Receipt</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={styles.expenseAmounts}>
                <Text style={styles.expenseTotal}>{formatCurrency(item.amount)}</Text>
                <Text style={[styles.expenseDeductible, { color: Colors.Gold }]}>
                  {formatCurrency(item.deductibleAmount)} off
                </Text>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.Gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    shadowColor: Colors.Gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    fontSize: Typography.sm,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: 4,
  },
  summaryLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
    marginTop: 4,
  },
  summaryValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.ExtraBold,
  },
  summaryHint: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
  filterRow: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  chipActive: {
    backgroundColor: Colors.GoldMuted,
    borderColor: Colors.Gold,
  },
  chipText: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
  },
  chipTextActive: {
    color: Colors.Gold,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseInfo: {
    flex: 1,
    gap: 5,
  },
  expenseDesc: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextPrimary,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  expenseDate: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
  deductBadge: {
    backgroundColor: Colors.GoldMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  deductBadgeText: {
    fontSize: 10,
    color: Colors.Gold,
    fontWeight: Typography.SemiBold,
  },
  receiptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.SuccessMuted,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  receiptText: {
    fontSize: 10,
    color: Colors.Success,
    fontWeight: Typography.SemiBold,
  },
  expenseAmounts: {
    alignItems: 'flex-end',
    gap: 3,
  },
  expenseTotal: {
    fontSize: Typography.sm,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  expenseDeductible: {
    fontSize: Typography.xs,
    fontWeight: Typography.SemiBold,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  emptyText: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },
});
