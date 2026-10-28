import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAppInsets } from '../../utils/useAppInsets';

export const OverallCategoriesScreen = ({ navigation }) => {
  const { topInset } = useAppInsets();
  const { user, transactions, overallTotals, getCategoryBreakdown, switchRole } = useApp();
  const isAdmin = user?.role === 'admin';

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(transactions),
    [getCategoryBreakdown, transactions]
  );

  if (isAdmin) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerToggleBtn}>
            <Ionicons name="menu" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.restrictedContainer}>
          <Ionicons name="shield-alert-outline" size={56} color={colors.adminBadge} />
          <Text style={styles.restrictedTitle}>Customer-Only Feature</Text>
          <Text style={styles.restrictedDesc}>
            Category summaries and details are available exclusively to Customer accounts.
          </Text>
          <TouchableOpacity style={styles.switchRoleBtn} onPress={() => switchRole('customer')}>
            <Text style={styles.switchRoleBtnText}>Switch to Customer Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleCategoryPress = (catItem) => {
    navigation.navigate('CategoryDetails', {
      categoryName: catItem.name,
      categoryColor: catItem.color,
      categoryIcon: catItem.icon,
    });
  };

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
        <Text style={styles.headerTitle}>Overall Categories</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Overview Modern Blue Gradient Banner */}
        <LinearGradient
          colors={['#0F172A', '#1D4ED8', '#38BDF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewBanner}
        >
          <View>
            <Text style={styles.bannerSubtitle}>All-Time Expenses</Text>
            <Text style={styles.bannerAmount}>
              ₹{overallTotals.expenses.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.categoryCountBox}>
            <Text style={styles.countNumber}>{categoryBreakdown.length}</Text>
            <Text style={styles.countLabel}>Categories</Text>
          </View>
        </LinearGradient>

        <Text style={styles.sectionHeading}>Spending Categories</Text>
        <Text style={styles.sectionSub}>Tap any category to view individual transactions</Text>

        {/* Category Cards List */}
        <View style={styles.cardsGrid}>
          {categoryBreakdown.map((item) => {
            const pct = Number(item.percentage) || 0;
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={styles.cardRightInfo}>
                    <Text style={styles.cardAmount}>₹{item.total.toLocaleString('en-IN')}</Text>
                    <Text style={styles.txCount}>{item.count} transactions</Text>
                  </View>
                </View>

                <View style={styles.cardMiddle}>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.pctText}>{pct}%</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.max(pct, 4)}%`, backgroundColor: item.color },
                    ]}
                  />
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={13} color={colors.primary} />
                </View>
              </TouchableOpacity>
            );
          })}
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  overviewBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#BAE6FD',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bannerAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 2,
  },
  categoryCountBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  countLabel: {
    fontSize: 9,
    color: '#E0F2FE',
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
    marginTop: 2,
  },
  cardsGrid: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRightInfo: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  txCount: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
  cardMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  pctText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  restrictedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 14,
  },
  restrictedDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  switchRoleBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  switchRoleBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
