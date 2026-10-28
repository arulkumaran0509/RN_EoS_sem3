import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const SummaryCard = ({ balance, income, expenses, periodLabel }) => {
  return (
    <LinearGradient
      colors={['#0F172A', '#1D4ED8', '#38BDF8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subTitle}>{periodLabel || 'Financial Overview'}</Text>
          <Text style={styles.balanceTitle}>Total Net Balance</Text>
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
        </View>
      </View>

      <Text style={[styles.balanceAmount, balance < 0 && styles.negativeBalance]}>
        ₹{Math.abs(balance).toLocaleString('en-IN')}
        {balance < 0 ? ' (Deficit)' : ''}
      </Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        {/* Income Block */}
        <View style={styles.metricBlock}>
          <View style={styles.metricHeader}>
            <View style={[styles.arrowCircle, { backgroundColor: 'rgba(22, 163, 74, 0.25)' }]}>
              <Ionicons name="arrow-down-outline" size={12} color="#4ADE80" />
            </View>
            <Text style={styles.metricLabel}>Income</Text>
          </View>
          <Text style={styles.incomeValue}>+₹{income.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.verticalDivider} />

        {/* Expense Block */}
        <View style={styles.metricBlock}>
          <View style={styles.metricHeader}>
            <View style={[styles.arrowCircle, { backgroundColor: 'rgba(220, 38, 38, 0.25)' }]}>
              <Ionicons name="arrow-up-outline" size={12} color="#F87171" />
            </View>
            <Text style={styles.metricLabel}>Expenses</Text>
          </View>
          <Text style={styles.expenseValue}>-₹{expenses.toLocaleString('en-IN')}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BAE6FD',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  balanceTitle: {
    fontSize: 13,
    color: '#F0F9FF',
    marginTop: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 12,
  },
  negativeBalance: {
    color: '#FECACA',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricBlock: {
    flex: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  arrowCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: '#BAE6FD',
    fontWeight: '600',
  },
  incomeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4ADE80',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F87171',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginHorizontal: 10,
  },
});
