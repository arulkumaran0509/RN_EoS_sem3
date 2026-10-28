import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAppInsets } from '../../utils/useAppInsets';
import { TransactionItem } from '../../components/TransactionItem';
import { TransactionModal } from '../../components/TransactionModal';

export const CategoryDetailsScreen = ({ route, navigation }) => {
  const { topInset } = useAppInsets();
  const { categoryName, categoryColor, categoryIcon } = route.params || {
    categoryName: 'Food & Dining',
    categoryColor: colors.primary,
    categoryIcon: 'restaurant',
  };

  const {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filter transactions for this specific category
  const categoryTransactions = useMemo(() => {
    return transactions.filter(
      (tx) => tx.category?.toLowerCase() === categoryName?.toLowerCase()
    );
  }, [transactions, categoryName]);

  // Total spent in this category
  const categoryTotal = useMemo(() => {
    return categoryTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }, [categoryTransactions]);

  const handleEditPress = (item) => {
    setEditingTransaction(item);
    setModalVisible(true);
  };

  const handleDeletePress = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this category transaction?',
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
      return addTransaction({ ...txData, category: categoryName });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Navigation */}
      <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {categoryName}
        </Text>
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

      <FlatList
        data={categoryTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <View style={[styles.bigIconBox, { backgroundColor: `${categoryColor || colors.primary}20` }]}>
              <Ionicons
                name={categoryIcon || 'pricetag'}
                size={32}
                color={categoryColor || colors.primary}
              />
            </View>

            <Text style={styles.cardCategoryTitle}>{categoryName}</Text>
            <Text style={styles.cardTotalAmount}>
              ₹{categoryTotal.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.cardTxCount}>
              {categoryTransactions.length} transaction
              {categoryTransactions.length !== 1 ? 's' : ''} recorded
            </Text>

            {/* Quick Add for this category button */}
            <TouchableOpacity
              style={[styles.quickAddCategoryBtn, { backgroundColor: categoryColor || colors.primary }]}
              onPress={() => {
                setEditingTransaction(null);
                setModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={16} color="#FFF" />
              <Text style={styles.quickAddText}>Add Transaction to {categoryName}</Text>
            </TouchableOpacity>

            <Text style={styles.sectionHeading}>Category Transaction History</Text>
          </View>
        }
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
            <Ionicons name="receipt-outline" size={36} color={colors.textMuted} />
            <Text style={styles.emptyText}>No transactions yet for {categoryName}.</Text>
            <TouchableOpacity
              style={[styles.addFirstBtn, { backgroundColor: categoryColor || colors.primary }]}
              onPress={() => {
                setEditingTransaction(null);
                setModalVisible(true);
              }}
            >
              <Text style={styles.addFirstBtnText}>+ Add First Entry</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal */}
      <TransactionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTransaction(null);
        }}
        initialData={
          editingTransaction || {
            title: '',
            amount: '',
            category: categoryName,
            type: 'expense',
            date: '2026-10-28',
            notes: '',
          }
        }
        onSubmit={handleModalSubmit}
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
  backBtn: {
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bigIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardCategoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardTotalAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  cardTxCount: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  quickAddCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
    marginBottom: 12,
  },
  quickAddText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 12,
  },
  addFirstBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addFirstBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
