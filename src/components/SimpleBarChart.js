import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/**
 * 1. Interactive Animated 3-Month Trend Bar Chart
 * Features:
 * - Bars grow smoothly from bottom (0 to actual height) in 750ms.
 * - Tap any bar (Income or Expense) to display tooltip with exact formatted amount (₹).
 * - Highlights the active bar with border & indicator.
 * - Tapping active bar toggles tooltip off; tapping another bar switches immediately.
 */
export const AnimatedMonthlyBarChart = ({ monthlyData, transactions }) => {
  const [selectedBar, setSelectedBar] = useState(null); // { month, type, amount, label }
  const animProgress = useRef(new Animated.Value(0)).current;

  // Maximum value for scaling bar heights
  const maxVal = Math.max(
    ...monthlyData.map((d) => Math.max(d.income || 0, d.expense || 0)),
    1000
  );

  // Trigger smooth growth animation when component mounts or data updates
  useEffect(() => {
    animProgress.setValue(0);
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [monthlyData, transactions]);

  const handleBarTap = (month, type, amount, label) => {
    if (selectedBar && selectedBar.month === month && selectedBar.type === type) {
      setSelectedBar(null); // Toggle off on second tap
    } else {
      setSelectedBar({ month, type, amount, label });
    }
  };

  return (
    <View style={styles.chartCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.chartTitle}>3-Month Trend (Income vs Expense)</Text>
          <Text style={styles.chartSub}>Tap any bar to inspect exact values</Text>
        </View>
        <Ionicons name="stats-chart" size={18} color={colors.primary} />
      </View>

      {/* Tooltip / Popup when a bar is tapped */}
      {selectedBar ? (
        <View
          style={[
            styles.tooltipBox,
            {
              borderColor: selectedBar.type === 'income' ? colors.income : colors.expense,
            },
          ]}
        >
          <View style={styles.tooltipHeader}>
            <View
              style={[
                styles.tooltipPill,
                {
                  backgroundColor:
                    selectedBar.type === 'income' ? colors.incomeLight : colors.expenseLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.tooltipPillText,
                  {
                    color: selectedBar.type === 'income' ? colors.income : colors.expense,
                  },
                ]}
              >
                {selectedBar.label} • {selectedBar.type.toUpperCase()}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setSelectedBar(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.tooltipAmount,
              { color: selectedBar.type === 'income' ? colors.income : colors.expense },
            ]}
          >
            {selectedBar.type === 'income' ? '+' : '-'}₹
            {Number(selectedBar.amount || 0).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.tooltipHint}>Tap selected bar again to dismiss</Text>
        </View>
      ) : (
        <View style={styles.tooltipPlaceholder}>
          <Ionicons name="finger-print-outline" size={14} color={colors.textMuted} />
          <Text style={styles.tooltipPlaceholderText}>Tap any bar below to view details</Text>
        </View>
      )}

      {/* Bars Row */}
      <View style={styles.chartBarsRow}>
        {monthlyData.map((data) => {
          const incomeHeightPct = Math.max(Math.round(((data.income || 0) / maxVal) * 100), 4);
          const expenseHeightPct = Math.max(Math.round(((data.expense || 0) / maxVal) * 100), 4);

          const isIncomeSelected =
            selectedBar?.month === data.month && selectedBar?.type === 'income';
          const isExpenseSelected =
            selectedBar?.month === data.month && selectedBar?.type === 'expense';

          const animIncomeHeight = animProgress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${incomeHeightPct}%`],
          });

          const animExpenseHeight = animProgress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${expenseHeightPct}%`],
          });

          return (
            <View key={data.month} style={styles.barGroup}>
              <View style={styles.barsContainer}>
                {/* 1. Income Bar (Clickable) */}
                <TouchableOpacity
                  style={styles.barTouchCol}
                  onPress={() => handleBarTap(data.month, 'income', data.income, data.label)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.barFill,
                      {
                        height: animIncomeHeight,
                        backgroundColor: colors.income,
                      },
                      isIncomeSelected && styles.barSelectedIncome,
                    ]}
                  />
                </TouchableOpacity>

                {/* 2. Expense Bar (Clickable) */}
                <TouchableOpacity
                  style={styles.barTouchCol}
                  onPress={() => handleBarTap(data.month, 'expense', data.expense, data.label)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.barFill,
                      {
                        height: animExpenseHeight,
                        backgroundColor: colors.expense,
                      },
                      isExpenseSelected && styles.barSelectedExpense,
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {/* Month Label */}
              <Text
                style={[
                  styles.monthLabel,
                  (isIncomeSelected || isExpenseSelected) && styles.monthLabelActive,
                ]}
              >
                {data.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend Row */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.income }]} />
          <Text style={styles.legendText}>Income (Green)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.expense }]} />
          <Text style={styles.legendText}>Expense (Red)</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * 2. Interactive Animated 7-Day Daily Spending Bar Chart
 * Features:
 * - Shows last 7 days daily expense spending with smooth height growth.
 * - Tapping any day's bar displays exact date, day, and ₹ amount.
 */
export const AnimatedWeeklyDailyBarChart = ({ dailyData }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const animProgress = useRef(new Animated.Value(0)).current;

  const maxDaily = Math.max(...dailyData.map((d) => d.amount || 0), 500);

  useEffect(() => {
    animProgress.setValue(0);
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 750,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [dailyData]);

  const handleDayTap = (item) => {
    if (selectedDay && selectedDay.date === item.date) {
      setSelectedDay(null);
    } else {
      setSelectedDay(item);
    }
  };

  return (
    <View style={styles.chartCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.chartTitle}>7-Day Daily Spending Trend</Text>
          <Text style={styles.chartSub}>Tap any day to see total expenses</Text>
        </View>
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
      </View>

      {/* Selected Day Tooltip */}
      {selectedDay ? (
        <View style={[styles.tooltipBox, { borderColor: colors.primary }]}>
          <View style={styles.tooltipHeader}>
            <View style={[styles.tooltipPill, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.tooltipPillText, { color: colors.primary }]}>
                {selectedDay.dayName} • {selectedDay.date}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedDay(null)}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.tooltipAmount, { color: colors.expense }]}>
            -₹{Number(selectedDay.amount || 0).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.tooltipHint}>Daily expense total</Text>
        </View>
      ) : (
        <View style={styles.tooltipPlaceholder}>
          <Ionicons name="finger-print-outline" size={14} color={colors.textMuted} />
          <Text style={styles.tooltipPlaceholderText}>Tap any day's bar to inspect daily total</Text>
        </View>
      )}

      {/* 7-Days Bars */}
      <View style={styles.dailyBarsRow}>
        {dailyData.map((d) => {
          const heightPct = Math.max(Math.round(((d.amount || 0) / maxDaily) * 100), d.amount > 0 ? 8 : 3);
          const isSelected = selectedDay?.date === d.date;

          const animatedHeight = animProgress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${heightPct}%`],
          });

          return (
            <TouchableOpacity
              key={d.date}
              style={styles.dailyBarCol}
              onPress={() => handleDayTap(d)}
              activeOpacity={0.7}
            >
              <View style={styles.dailyBarTrack}>
                <Animated.View
                  style={[
                    styles.dailyBarFill,
                    {
                      height: animatedHeight,
                      backgroundColor: d.amount > 0 ? colors.primary : '#CBD5E1',
                    },
                    isSelected && styles.barSelectedDaily,
                  ]}
                />
              </View>
              <Text style={[styles.dailyDayLabel, isSelected && styles.dailyDayLabelActive]}>
                {d.dayShort}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

/**
 * 3. Interactive Animated Category Breakdown
 * Features:
 * - Animated horizontal bars expanding from 0% to actual % width.
 * - Clicking any category highlights the category and displays an informative popover.
 */
export const AnimatedCategoryBreakdown = ({ items, totalExpense }) => {
  const [selectedCat, setSelectedCat] = useState(null);
  const animProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animProgress.setValue(0);
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [items, totalExpense]);

  if (!items || items.length === 0 || totalExpense === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="pie-chart-outline" size={32} color={colors.textMuted} />
        <Text style={styles.emptyText}>No category expenses recorded for this period.</Text>
      </View>
    );
  }

  const handleCategoryTap = (item) => {
    if (selectedCat && selectedCat.name === item.name) {
      setSelectedCat(null);
    } else {
      setSelectedCat(item);
    }
  };

  return (
    <View style={styles.container}>
      {/* Category Tooltip when tapped */}
      {selectedCat ? (
        <View style={[styles.tooltipBox, { borderColor: selectedCat.color || colors.primary }]}>
          <View style={styles.tooltipHeader}>
            <View style={[styles.tooltipPill, { backgroundColor: `${selectedCat.color}20` }]}>
              <Text style={[styles.tooltipPillText, { color: selectedCat.color || colors.primary }]}>
                {selectedCat.name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedCat(null)}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.tooltipCatRow}>
            <Text style={[styles.tooltipAmount, { color: selectedCat.color || colors.primary }]}>
              ₹{Number(selectedCat.total || 0).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.tooltipCatMeta}>
              {selectedCat.percentage}% of total expenses • {selectedCat.count} records
            </Text>
          </View>
        </View>
      ) : null}

      {/* Multi-segment visual bar */}
      <View style={styles.multiBar}>
        {items.map((item, index) => {
          const widthPct = Math.max(Math.min(Number(item.percentage) || 0, 100), 2);
          return (
            <View
              key={`bar-${item.name}-${index}`}
              style={{
                width: `${widthPct}%`,
                height: 12,
                backgroundColor: item.color || colors.primary,
                borderRadius: index === 0 ? 6 : index === items.length - 1 ? 6 : 0,
              }}
            />
          );
        })}
      </View>

      {/* Interactive Category List Rows */}
      <View style={styles.list}>
        {items.map((item) => {
          const isSelected = selectedCat?.name === item.name;
          const targetWidth = Math.max(Number(item.percentage) || 0, 4);

          const animWidth = animProgress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${targetWidth}%`],
          });

          return (
            <TouchableOpacity
              key={`item-${item.name}`}
              style={[styles.itemCard, isSelected && styles.itemCardSelected]}
              onPress={() => handleCategoryTap(item)}
              activeOpacity={0.7}
            >
              <View style={styles.itemHeaderRow}>
                <View style={styles.nameRow}>
                  <View style={[styles.dot, { backgroundColor: item.color || colors.primary }]} />
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.itemAmount}>₹{item.total.toLocaleString('en-IN')}</Text>
                  <Text style={styles.itemPercentage}>({item.percentage}%)</Text>
                </View>
              </View>

              {/* Animated Progress Bar */}
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: animWidth,
                      backgroundColor: item.color || colors.primary,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

/**
 * 4. Interactive Cash Flow Ratio Card
 */
export const IncomeVsExpenseChart = ({ income, expenses }) => {
  const [showDetail, setShowDetail] = useState(false);
  const total = income + expenses;
  const incomePct = total > 0 ? ((income / total) * 100).toFixed(0) : 50;
  const expensePct = total > 0 ? ((expenses / total) * 100).toFixed(0) : 50;

  return (
    <TouchableOpacity
      style={styles.comparisonCard}
      onPress={() => setShowDetail(!showDetail)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.chartTitle}>Cash Flow Ratio</Text>
          <Text style={styles.chartSub}>
            {showDetail ? 'Tap to collapse details' : 'Tap to inspect cash flow breakdown'}
          </Text>
        </View>
        <Ionicons name="pie-chart" size={18} color={colors.primary} />
      </View>

      <View style={styles.ratioBarContainer}>
        <View style={[styles.ratioBarPart, { width: `${incomePct}%`, backgroundColor: colors.income }]} />
        <View style={[styles.ratioBarPart, { width: `${expensePct}%`, backgroundColor: colors.expense }]} />
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.income }]} />
          <Text style={styles.legendText}>
            Income: {incomePct}% (₹{income.toLocaleString('en-IN')})
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.expense }]} />
          <Text style={styles.legendText}>
            Expense: {expensePct}% (₹{expenses.toLocaleString('en-IN')})
          </Text>
        </View>
      </View>

      {showDetail && (
        <View style={styles.ratioDetailBox}>
          <Text style={styles.ratioDetailText}>
            Total Inflow + Outflow volume: ₹{total.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.ratioDetailSub}>
            Net Surplus / Deficit: {income >= expenses ? '+' : '-'}₹
            {Math.abs(income - expenses).toLocaleString('en-IN')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chartSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  tooltipBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tooltipPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tooltipPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tooltipAmount: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  tooltipHint: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  tooltipCatRow: {
    marginTop: 4,
  },
  tooltipCatMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tooltipPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    gap: 6,
  },
  tooltipPlaceholderText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 130,
    paddingTop: 10,
  },
  barGroup: {
    alignItems: 'center',
    width: 65,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
  },
  barTouchCol: {
    width: 18,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  barSelectedIncome: {
    borderWidth: 2,
    borderColor: '#065F46',
    shadowColor: colors.income,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  barSelectedExpense: {
    borderWidth: 2,
    borderColor: '#991B1B',
    shadowColor: colors.expense,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
  },
  monthLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  dailyBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  dailyBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  dailyBarTrack: {
    width: 14,
    height: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dailyBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  barSelectedDaily: {
    borderWidth: 2,
    borderColor: colors.primaryDark,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyDayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
  },
  dailyDayLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  container: {
    marginVertical: 4,
  },
  multiBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  list: {
    gap: 8,
  },
  itemCard: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
  },
  itemCardSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemPercentage: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
  comparisonCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
  },
  ratioBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginBottom: 10,
  },
  ratioBarPart: {
    height: '100%',
  },
  ratioDetailBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  ratioDetailText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ratioDetailSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
