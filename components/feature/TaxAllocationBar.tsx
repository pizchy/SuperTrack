import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { TaxBreakdown } from '@/services/taxCalculator';
import { formatCurrency } from '@/services/taxCalculator';

interface TaxAllocationBarProps {
  breakdown: TaxBreakdown;
  showLabels?: boolean;
}

export function TaxAllocationBar({ breakdown, showLabels = true }: TaxAllocationBarProps) {
  const total = breakdown.grossIncome;
  if (total === 0) return null;

  const segments = [
    { label: 'Take Home', amount: breakdown.netIncome, color: Colors.TakeHome },
    { label: 'Super', amount: breakdown.superContribution, color: Colors.Super },
    { label: 'Income Tax', amount: breakdown.incomeTax, color: Colors.IncomeTax },
    { label: 'Medicare', amount: breakdown.medicareLevy, color: Colors.Medicare },
    { label: 'GST', amount: breakdown.gst, color: Colors.GST },
    { label: 'HELP', amount: breakdown.studentLoan, color: Colors.StudentLoan },
  ].filter((s) => s.amount > 0);

  return (
    <View style={styles.container}>
      {/* Bar */}
      <View style={styles.bar}>
        {segments.map((seg, i) => (
          <View
            key={seg.label}
            style={[
              styles.segment,
              {
                flex: seg.amount / total,
                backgroundColor: seg.color,
                borderTopLeftRadius: i === 0 ? Radius.sm : 0,
                borderBottomLeftRadius: i === 0 ? Radius.sm : 0,
                borderTopRightRadius: i === segments.length - 1 ? Radius.sm : 0,
                borderBottomRightRadius: i === segments.length - 1 ? Radius.sm : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* Legend */}
      {showLabels && (
        <View style={styles.legend}>
          {segments.map((seg) => (
            <View key={seg.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
              <View>
                <Text style={styles.legendLabel}>{seg.label}</Text>
                <Text style={[styles.legendAmount, { color: seg.color }]}>
                  {formatCurrency(seg.amount)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  bar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.SurfaceBorder,
  },
  segment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: '45%',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: Typography.xs,
    color: Colors.TextSecondary,
    fontWeight: Typography.Medium,
  },
  legendAmount: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
  },
});
