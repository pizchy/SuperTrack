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
import { formatCurrency } from '@/services/taxCalculator';
import { IncomeTransactionCard } from '@/components/feature/IncomeTransactionCard';

export default function IncomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { incomeTransactions, ytdSummary } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'contract', label: 'Contract' },
    { id: 'rideshare', label: 'Rideshare' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'consulting', label: 'Consulting' },
  ];

  const filtered = incomeTransactions.filter((t) => {
    const matchSearch = search
      ? t.description.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchFilter = filter === 'all' ? true : t.category === filter;
    return matchSearch && matchFilter;
  });

  const totalFiltered = filtered.reduce((s, t) => s + t.amount, 0);
  const netFiltered = filtered.reduce((s, t) => s + t.taxBreakdown.netIncome, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Income</Text>
          <Text style={styles.headerSub}>{incomeTransactions.length} transactions this FY</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/add-income')}
        >
          <MaterialIcons name="add" size={20} color={Colors.TextInverse} />
          <Text style={styles.addBtnText}>Record</Text>
        </Pressable>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Gross Earned</Text>
          <Text style={[styles.summaryValue, { color: Colors.TextPrimary }]}>
            {formatCurrency(ytdSummary.grossIncome)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tax Deducted</Text>
          <Text style={[styles.summaryValue, { color: Colors.IncomeTax }]}>
            {formatCurrency(ytdSummary.incomeTax + ytdSummary.medicareLevy + ytdSummary.gst)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Take Home</Text>
          <Text style={[styles.summaryValue, { color: Colors.TakeHome }]}>
            {formatCurrency(ytdSummary.netIncome)}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={18} color={Colors.TextMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search income..."
          placeholderTextColor={Colors.TextMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 ? (
          <Pressable onPress={() => setSearch('')}>
            <MaterialIcons name="close" size={18} color={Colors.TextMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Filter chips */}
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
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="trending-up" size={48} color={Colors.TextMuted} />
            <Text style={styles.emptyTitle}>No income recorded yet</Text>
            <Text style={styles.emptyText}>
              Tap "Record" to add your first income entry
            </Text>
            <Pressable
              style={[styles.addBtn, { alignSelf: 'center', marginTop: Spacing.sm }]}
              onPress={() => router.push('/add-income')}
            >
              <MaterialIcons name="add" size={18} color={Colors.TextInverse} />
              <Text style={styles.addBtnText}>Record Income</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {search || filter !== 'all' ? (
              <View style={styles.resultSummary}>
                <Text style={styles.resultText}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} ·{' '}
                  <Text style={{ color: Colors.TextPrimary }}>{formatCurrency(totalFiltered)} gross</Text>
                  {' '}·{' '}
                  <Text style={{ color: Colors.TakeHome }}>{formatCurrency(netFiltered)} net</Text>
                </Text>
              </View>
            ) : null}
            {filtered.map((t) => (
              <IncomeTransactionCard key={t.id} transaction={t} />
            ))}
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
    backgroundColor: Colors.Primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
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
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    padding: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: Typography.base,
    fontWeight: Typography.ExtraBold,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.SurfaceBorder,
    marginVertical: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Typography.sm,
    color: Colors.TextPrimary,
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
    backgroundColor: Colors.PrimaryMuted,
    borderColor: Colors.Primary,
  },
  chipText: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
  },
  chipTextActive: {
    color: Colors.Primary,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  resultSummary: {
    paddingVertical: 4,
  },
  resultText: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
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
    maxWidth: 280,
    lineHeight: 22,
  },
});
