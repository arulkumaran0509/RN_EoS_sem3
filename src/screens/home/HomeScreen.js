import React, { useState } from 'react';
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
import { SummaryCard } from '../../components/SummaryCard';
import { PeriodSelector } from '../../components/PeriodSelector';
import { TransactionItem } from '../../components/TransactionItem';
import { TransactionModal } from '../../components/TransactionModal';

export const HomeScreen = ({ navigation }) => {
  const { topInset } = useAppInsets();
  const {
    user,
    adminScope,
    setAdminScope,
    selectedPeriod,
    setSelectedPeriod,
    currentDate,
    currentPeriodTotals,
    currentPeriodTransactions,
    dailyTotals,
    weeklyTotals,
    monthlyTotals,
    addTransaction,
    switchRole,
    showAlert,
  } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const isAdmin = user?.role === 'admin';

  // Format current reporting period text
  const getPeriodLabel = () => {
    const scopeLabel = isAdmin
      ? adminScope === 'all'
        ? ' (Consolidated All Users)'
        : ' (Corporate Ledger)'
      : '';
    if (selectedPeriod === 'daily') return `Daily Report (${currentDate})${scopeLabel}`;
    if (selectedPeriod === 'weekly') return `Weekly Report (Last 7 Days)${scopeLabel}`;
    return `Monthly Report (October 2026)${scopeLabel}`;
  };

  const handleAddTransactionPress = () => {
    if (isAdmin) {
      showAlert('Admin cannot add transactions directly. Switch to Customer role to test transaction additions.', 'info');
      return;
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar with Safe Top Padding */}
      <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerToggleBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerGreeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
          <View style={styles.roleBadgeRow}>
            <View
              style={[
                styles.badgePill,
                { backgroundColor: isAdmin ? colors.adminBadge : colors.customerBadge },
              ]}
            >
              <Text style={styles.badgePillText}>{isAdmin ? 'ADMIN' : 'CUSTOMER'}</Text>
            </View>
            <Text style={styles.headerSub}>Budget Tracker</Text>
          </View>
        </View>

        {/* Quick Demo Switcher or Profile Avatar */}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => switchRole(isAdmin ? 'customer' : 'admin')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isAdmin ? 'shield-checkmark' : 'person-circle'}
            size={32}
            color={isAdmin ? colors.adminBadge : colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin Scope Switcher (Corporate vs Consolidated) */}
        {isAdmin && (
          <View style={styles.adminScopeContainer}>
            <Text style={styles.adminScopeTitle}>Admin View Scope:</Text>
            <View style={styles.adminScopeTabs}>
              <TouchableOpacity
                style={[styles.adminScopeTab, adminScope === 'personal' && styles.adminScopeTabActive]}
                onPress={() => setAdminScope('personal')}
              >
                <Text style={[styles.adminScopeTabText, adminScope === 'personal' && styles.adminScopeTabTextActive]}>
                  Corporate Ledger
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.adminScopeTab, adminScope === 'all' && styles.adminScopeTabActive]}
                onPress={() => setAdminScope('all')}
              >
                <Text style={[styles.adminScopeTabText, adminScope === 'all' && styles.adminScopeTabTextActive]}>
                  All Users Consolidated
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Dynamic Period Selector (Daily / Weekly / Monthly) */}
        <View style={styles.periodSection}>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
          />
        </View>

        {/* Active Period Summary Card */}
        <SummaryCard
          balance={currentPeriodTotals.balance}
          income={currentPeriodTotals.income}
          expenses={currentPeriodTotals.expenses}
          periodLabel={getPeriodLabel()}
        />

        {/* Quick 3-Period Overview Strip */}
        <View style={styles.threePeriodOverview}>
          <TouchableOpacity
            style={[styles.miniStatCard, selectedPeriod === 'daily' && styles.miniStatCardActive]}
            onPress={() => setSelectedPeriod('daily')}
          >
            <Text style={styles.miniStatTitle}>Daily</Text>
            <Text style={styles.miniStatIncome}>+₹{dailyTotals.income}</Text>
            <Text style={styles.miniStatExpense}>-₹{dailyTotals.expenses}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.miniStatCard, selectedPeriod === 'weekly' && styles.miniStatCardActive]}
            onPress={() => setSelectedPeriod('weekly')}
          >
            <Text style={styles.miniStatTitle}>Weekly</Text>
            <Text style={styles.miniStatIncome}>+₹{weeklyTotals.income}</Text>
            <Text style={styles.miniStatExpense}>-₹{weeklyTotals.expenses}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.miniStatCard, selectedPeriod === 'monthly' && styles.miniStatCardActive]}
            onPress={() => setSelectedPeriod('monthly')}
          >
            <Text style={styles.miniStatTitle}>Monthly</Text>
            <Text style={styles.miniStatIncome}>+₹{monthlyTotals.income}</Text>
            <Text style={styles.miniStatExpense}>-₹{monthlyTotals.expenses}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Action Shortcuts */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionTile, { backgroundColor: colors.primaryMuted }]}
            onPress={handleAddTransactionPress}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={18} color="#FFF" />
            </View>
            <Text style={styles.actionTileLabel} numberOfLines={1}>
              {isAdmin ? 'Admin' : 'Add Expense'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionTile, { backgroundColor: '#F3E8FF' }]}
            onPress={() => navigation.navigate('Analysis')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#8B5CF6' }]}>
              <Ionicons name="pie-chart" size={18} color="#FFF" />
            </View>
            <Text style={styles.actionTileLabel} numberOfLines={1}>Analytics</Text>
          </TouchableOpacity>

          {!isAdmin && (
            <TouchableOpacity
              style={[styles.actionTile, { backgroundColor: '#FEF3C7' }]}
              onPress={() => navigation.navigate('Categories')}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#D97706' }]}>
                <Ionicons name="grid" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionTileLabel} numberOfLines={1}>Categories</Text>
            </TouchableOpacity>
          )}

          {!isAdmin && (
            <TouchableOpacity
              style={[styles.actionTile, { backgroundColor: '#E0F2FE' }]}
              onPress={() => navigation.navigate('Transactions')}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#0284C7' }]}>
                <Ionicons name="receipt" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionTileLabel} numberOfLines={1}>All Months</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Transactions List Header */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>
            Recent Transactions ({selectedPeriod.toUpperCase()})
          </Text>
          {!isAdmin && (
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAllLink}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Transactions List */}
        {currentPeriodTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
            <Text style={styles.emptyText}>No transactions recorded for this period.</Text>
            {!isAdmin && (
              <TouchableOpacity
                style={styles.addFirstBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.addFirstBtnText}>+ Add First Transaction</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          currentPeriodTransactions.slice(0, 6).map((item) => (
            <TransactionItem
              key={item.id}
              transaction={item}
              showActions={false}
              onPress={() => {
                if (!isAdmin) {
                  navigation.navigate('Transactions');
                }
              }}
            />
          ))
        )}
      </ScrollView>

      {/* Transaction Modal */}
      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addTransaction}
        defaultDate={currentDate}
      />
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
  headerGreeting: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  avatarButton: {
    padding: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  adminScopeContainer: {
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  adminScopeTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.adminBadge,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  adminScopeTabs: {
    flexDirection: 'row',
    gap: 6,
  },
  adminScopeTab: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  adminScopeTabActive: {
    backgroundColor: colors.adminBadge,
    borderColor: colors.adminBadge,
  },
  adminScopeTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  adminScopeTabTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  periodSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  threePeriodOverview: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  miniStatCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  miniStatTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  miniStatIncome: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.income,
  },
  miniStatExpense: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.expense,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  actionTile: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTileLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 10,
  },
  addFirstBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addFirstBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
