import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAppInsets } from '../../utils/useAppInsets';
import { TransactionItem } from '../../components/TransactionItem';
import { TransactionModal } from '../../components/TransactionModal';

export const MonthTransactionsScreen = ({ navigation }) => {
  const { topInset } = useAppInsets();
  const {
    user,
    transactions,
    selectedMonth,
    setSelectedMonth,
    addTransaction,
    editTransaction,
    deleteTransaction,
    calculateTotals,
    switchRole,
  } = useApp();

  const isAdmin = user?.role === 'admin';

  // Filters & State
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const monthsList = [
    { key: '2026-10', label: 'Oct 2026' },
    { key: '2026-09', label: 'Sep 2026' },
    { key: '2026-08', label: 'Aug 2026' },
    { key: 'all', label: 'All Time' },
  ];

  // Filtered list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Month filter
      if (selectedMonth !== 'all' && !tx.date.startsWith(selectedMonth)) {
        return false;
      }
      // 2. Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesCat = tx.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat) return false;
      }
      return true;
    });
  }, [transactions, selectedMonth, typeFilter, searchQuery]);

  // Totals for this selected month
  const monthTotals = useMemo(() => {
    const list = selectedMonth === 'all'
      ? transactions
      : transactions.filter((tx) => tx.date.startsWith(selectedMonth));
    return calculateTotals(list);
  }, [transactions, selectedMonth, calculateTotals]);

  if (isAdmin) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.drawerToggleBtn}>
            <Ionicons name="menu" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transactions</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.restrictedContainer}>
          <Ionicons name="shield-alert-outline" size={56} color={colors.adminBadge} />
          <Text style={styles.restrictedTitle}>Customer-Only Feature</Text>
          <Text style={styles.restrictedDesc}>
            Month-wise Transaction management (creating, editing, and deleting records) is reserved
            for Customer accounts.
          </Text>
          <TouchableOpacity style={styles.switchRoleBtn} onPress={() => switchRole('customer')}>
            <Text style={styles.switchRoleBtnText}>Switch to Customer Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleEditPress = (item) => {
    setEditingTransaction(item);
    setModalVisible(true);
  };

  const handleDeletePress = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
      ]
    );
  };

  const handleModalSubmit = (txData) => {
    if (editingTransaction) {
      return editTransaction(editingTransaction.id, txData);
    } else {
      return addTransaction(txData);
    }
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
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditingTransaction(null);
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Month Selector Tabs */}
      <View style={styles.monthSelectorRow}>
        {monthsList.map((m) => {
          const isSelected = selectedMonth === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.monthTab, isSelected && styles.monthTabActive]}
              onPress={() => setSelectedMonth(m.key)}
            >
              <Text style={[styles.monthTabText, isSelected && styles.monthTabTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Month Summary Ribbon */}
      <View style={styles.summaryRibbon}>
        <View style={styles.ribbonItem}>
          <Text style={styles.ribbonLabel}>Income</Text>
          <Text style={styles.ribbonIncome}>+₹{monthTotals.income.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.ribbonDivider} />
        <View style={styles.ribbonItem}>
          <Text style={styles.ribbonLabel}>Expenses</Text>
          <Text style={styles.ribbonExpense}>-₹{monthTotals.expenses.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.ribbonDivider} />
        <View style={styles.ribbonItem}>
          <Text style={styles.ribbonLabel}>Net Balance</Text>
          <Text
            style={[
              styles.ribbonBalance,
              monthTotals.balance < 0 && { color: colors.expense },
            ]}
          >
            ₹{monthTotals.balance.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Search Bar & Type Filter */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Type Filter Buttons */}
        <View style={styles.typeFilterRow}>
          {['all', 'expense', 'income'].map((t) => {
            const active = typeFilter === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.typeFilterChip, active && styles.typeFilterChipActive]}
                onPress={() => setTypeFilter(t)}
              >
                <Text
                  style={[
                    styles.typeFilterChipText,
                    active && styles.typeFilterChipTextActive,
                  ]}
                >
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Transactions FlatList */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            showActions={true}
            onEdit={handleEditPress}
            onDelete={handleDeletePress}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={38} color={colors.textMuted} />
            <Text style={styles.emptyText}>No transactions match this filter.</Text>
            <TouchableOpacity
              style={styles.addFirstBtn}
              onPress={() => {
                setEditingTransaction(null);
                setModalVisible(true);
              }}
            >
              <Text style={styles.addFirstBtnText}>+ Add New Transaction</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTransaction(null);
        }}
        initialData={editingTransaction}
        onSubmit={handleModalSubmit}
        defaultDate={selectedMonth === 'all' ? '2026-10-28' : `${selectedMonth}-28`}
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthSelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  monthTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthTabTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  summaryRibbon: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 8,
  },
  ribbonItem: {
    flex: 1,
    alignItems: 'center',
  },
  ribbonLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ribbonIncome: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.income,
    marginTop: 1,
  },
  ribbonExpense: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.expense,
    marginTop: 1,
  },
  ribbonBalance: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 1,
  },
  ribbonDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 6,
    gap: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  typeFilterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typeFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.surfaceSubtle,
  },
  typeFilterChipActive: {
    backgroundColor: '#1E1B4B',
  },
  typeFilterChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeFilterChipTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 12,
  },
  addFirstBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addFirstBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
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
