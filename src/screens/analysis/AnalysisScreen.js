import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAppInsets } from '../../utils/useAppInsets';
import {
  AnimatedCategoryBreakdown,
  IncomeVsExpenseChart,
  AnimatedMonthlyBarChart,
  AnimatedWeeklyDailyBarChart,
} from '../../components/SimpleBarChart';

export const AnalysisScreen = ({ navigation }) => {
  const { topInset } = useAppInsets();
  const {
    user,
    transactions,
    overallTotals,
    getCategoryBreakdown,
    calculateTotals,
  } = useApp();

  const isAdmin = user?.role === 'admin';

  // Category breakdown across all transactions
  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(transactions),
    [getCategoryBreakdown, transactions]
  );

  // Highest spending category
  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  // Key metrics calculation
  const savingsRate = useMemo(() => {
    if (overallTotals.income <= 0) return 0;
    const rate = ((overallTotals.income - overallTotals.expenses) / overallTotals.income) * 100;
    return Math.max(0, rate).toFixed(1);
  }, [overallTotals]);

  const avgDailySpend = useMemo(() => {
    return Math.round(overallTotals.expenses / 90);
  }, [overallTotals.expenses]);

  // 3-Month Comparison Data (August, September, October 2026)
  const monthlyTrendData = useMemo(() => {
    const months = [
      { key: '2026-08', label: 'Aug 2026' },
      { key: '2026-09', label: 'Sep 2026' },
      { key: '2026-10', label: 'Oct 2026' },
    ];

    return months.map((m) => {
      const monthTx = transactions.filter((tx) => tx.date.startsWith(m.key));
      const totals = calculateTotals(monthTx);
      return {
        month: m.key,
        label: m.label,
        income: totals.income,
        expense: totals.expenses,
      };
    });
  }, [transactions, calculateTotals]);

  // Last 7-Days Daily Spending Data
  const dailyTrendData = useMemo(() => {
    const days = [];
    const ref = new Date('2026-10-28');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(ref);
      d.setDate(ref.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayTransactions = transactions.filter(
        (tx) => tx.date === dateStr && tx.type === 'expense'
      );
      const dayTotal = dayTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

      days.push({
        date: dateStr,
        dayShort: dayNames[d.getDay()],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        amount: dayTotal,
      });
    }
    return days;
  }, [transactions]);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerToggleBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Financial Analysis</Text>
          <Text style={styles.headerSub}>Interactive Animated Analytics</Text>
        </View>

        <View
          style={[
            styles.badgePill,
            { backgroundColor: isAdmin ? colors.adminBadge : colors.customerBadge },
          ]}
        >
          <Text style={styles.badgePillText}>{isAdmin ? 'ADMIN' : 'CUSTOMER'}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Metric Cards Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="pie-chart" size={16} color={colors.income} />
            </View>
            <Text style={styles.metricCardLabel}>Savings Rate</Text>
            <Text style={styles.metricCardValue}>{savingsRate}%</Text>
            <Text style={styles.metricCardSub}>of income</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="flame" size={16} color={colors.expense} />
            </View>
            <Text style={styles.metricCardLabel}>Top Expense</Text>
            <Text style={styles.metricCardValue} numberOfLines={1}>
              {topCategory?.name || 'N/A'}
            </Text>
            <Text style={styles.metricCardSub}>
              {topCategory ? `₹${topCategory.total.toLocaleString('en-IN')}` : 'No data'}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
            </View>
            <Text style={styles.metricCardLabel}>Daily Average</Text>
            <Text style={styles.metricCardValue}>₹{avgDailySpend}</Text>
            <Text style={styles.metricCardSub}>per day</Text>
          </View>
        </View>

        {/* 1. Cash Flow Comparison Chart */}
        <IncomeVsExpenseChart
          income={overallTotals.income}
          expenses={overallTotals.expenses}
        />

        {/* 2. Interactive Animated 3-Month Trend Bar Chart */}
        <AnimatedMonthlyBarChart
          monthlyData={monthlyTrendData}
          transactions={transactions}
        />

        {/* 3. Interactive Animated 7-Day Spending Trend */}
        <AnimatedWeeklyDailyBarChart dailyData={dailyTrendData} />

        {/* 4. Interactive Animated Category Breakdown Distribution Chart */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.sectionHeading}>Category Expense Distribution</Text>
            <Text style={styles.totalLabel}>
              Total: ₹{overallTotals.expenses.toLocaleString('en-IN')}
            </Text>
          </View>

          <AnimatedCategoryBreakdown
            items={categoryBreakdown}
            totalExpense={overallTotals.expenses}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  metricIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricCardLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  metricCardValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  metricCardSub: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  categorySection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
