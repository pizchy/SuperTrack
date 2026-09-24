import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { IncomeTransaction } from '@/services/mockData';
import { formatCurrency } from '@/services/taxCalculator';
import { INCOME_CATEGORIES } from '@/constants/config';
import { TaxAllocationBar } from './TaxAllocationBar';

interface Props {
  transaction: IncomeTransaction;
}

export function IncomeTransactionCard({ transaction }: Props) {
  const [expanded, setExpanded] = useState(false);
  const category = INCOME_CATEGORIES.find((c) => c.id === transaction.category);
  const dateObj = new Date(transaction.date);
  const dateStr = dateObj.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={category?.icon as any || 'attach-money'} size={20} color={Colors.Primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.description} numberOfLines={1}>{transaction.description}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.date}>{dateStr}</Text>
            {transaction.platform ? (
              <View style={styles.platformBadge}>
                <Text style={styles.platformText}>{transaction.platform}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.amounts}>
          <Text style={styles.gross}>{formatCurrency(transaction.amount)}</Text>
          <Text style={styles.net}>↳ {formatCurrency(transaction.taxBreakdown.netIncome)}</Text>
        </View>
      </View>

      {/* Allocation Bar - always visible */}
      <View style={styles.barWrap}>
        <TaxAllocationBar breakdown={transaction.taxBreakdown} showLabels={false} />
        <View style={styles.barLabels}>
          <Text style={styles.barLabelLeft}>
            <Text style={{ color: Colors.TakeHome }}>●</Text>{' '}
            Take Home {formatCurrency(transaction.taxBreakdown.netIncome)}
          </Text>
          <Text style={styles.barLabelRight}>
            Tax {transaction.taxBreakdown.effectiveTaxRate}%
          </Text>
        </View>
      </View>

      {/* Expanded breakdown */}
      {expanded && (
        <View style={styles.breakdown}>
          <View style={styles.divider} />
          <TaxAllocationBar breakdown={transaction.taxBreakdown} showLabels={true} />
        </View>
      )}

      <View style={styles.expandHint}>
        <MaterialIcons
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={16}
          color={Colors.TextMuted}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.PrimaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  description: {
    fontSize: Typography.base,
    fontWeight: Typography.SemiBold,
    color: Colors.TextPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  date: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
  platformBadge: {
    backgroundColor: Colors.SurfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  platformText: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    fontWeight: Typography.Medium,
  },
  amounts: {
    alignItems: 'flex-end',
  },
  gross: {
    fontSize: Typography.base,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  net: {
    fontSize: Typography.xs,
    color: Colors.TakeHome,
    fontWeight: Typography.Medium,
  },
  barWrap: {
    gap: 5,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabelLeft: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
  },
  barLabelRight: {
    fontSize: Typography.xs,
    color: Colors.IncomeTax,
    fontWeight: Typography.SemiBold,
  },
  breakdown: {
    gap: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.SurfaceBorder,
  },
  expandHint: {
    alignItems: 'center',
  },
});
