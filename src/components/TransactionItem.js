import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { CATEGORIES } from '../data/mockData';

export const TransactionItem = ({
  transaction,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const { title, amount, category, type, date, notes } = transaction;
  const isIncome = type === 'income';

  const categoryMeta = CATEGORIES.find((c) => c.name === category) || {
    icon: 'wallet',
    color: colors.primary,
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Category Icon Badge */}
      <View style={[styles.iconContainer, { backgroundColor: `${categoryMeta.color}15` }]}>
        <Ionicons name={categoryMeta.icon} size={18} color={categoryMeta.color} />
      </View>

      {/* Title & Date */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.subRow}>
          <Text style={styles.categoryBadge}>{category}</Text>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {notes ? <Text style={styles.notes} numberOfLines={1}>{notes}</Text> : null}
      </View>

      {/* Amount & Actions */}
      <View style={styles.rightContainer}>
        <Text
          style={[
            styles.amount,
            { color: isIncome ? colors.income : colors.expense },
          ]}
        >
          {isIncome ? '+' : '-'}₹{Number(amount).toLocaleString('en-IN')}
        </Text>

        {showActions && (
          <View style={styles.actionsRow}>
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(transaction)}
                style={styles.actionBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="pencil" size={14} color={colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(transaction.id)}
                style={[styles.actionBtn, styles.deleteBtn]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={14} color={colors.expense} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  bullet: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 3,
  },
  date: {
    fontSize: 10,
    color: colors.textMuted,
  },
  notes: {
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 1,
  },
  rightContainer: {
    alignItems: 'flex-end',
    marginLeft: 6,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  actionBtn: {
    padding: 3,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 5,
  },
  deleteBtn: {
    backgroundColor: colors.expenseLight,
  },
});
