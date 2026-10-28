import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { CATEGORIES } from '../data/mockData';

export const TransactionModal = ({
  visible,
  onClose,
  onSubmit,
  initialData = null,
  defaultDate = '2026-10-28',
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [date, setDate] = useState(defaultDate);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setType(initialData.type || 'expense');
      setCategory(initialData.category || CATEGORIES[0].name);
      setDate(initialData.date || defaultDate);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory(CATEGORIES[0].name);
      setDate(defaultDate);
      setNotes('');
    }
    setErrorMessage('');
  }, [initialData, visible, defaultDate]);

  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      setErrorMessage('Please enter a transaction title.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid positive amount.');
      return;
    }
    if (!date.trim()) {
      setErrorMessage('Please provide a valid date (YYYY-MM-DD).');
      return;
    }

    setErrorMessage('');
    const success = onSubmit({
      title: title.trim(),
      amount: numAmount,
      type,
      category,
      date: date.trim(),
      notes: notes.trim(),
    });

    if (success !== false) {
      onClose();
    }
  };

  const filteredCategories = CATEGORIES.filter(
    (c) => (type === 'income' ? c.type === 'income' : c.type === 'expense')
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEdit ? 'Edit Transaction' : 'New Transaction'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={colors.expense} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
            {/* Type Selector (Income / Expense) */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'expense' && styles.expenseActive]}
                onPress={() => {
                  setType('expense');
                  setCategory(CATEGORIES[0].name);
                }}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={18}
                  color={type === 'expense' ? '#FFF' : colors.textSecondary}
                />
                <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnActiveText]}>
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeBtn, type === 'income' && styles.incomeActive]}
                onPress={() => {
                  setType('income');
                  setCategory('Salary');
                }}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={18}
                  color={type === 'income' ? '#FFF' : colors.textSecondary}
                />
                <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnActiveText]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <Text style={styles.label}>Transaction Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grocery Shopping, Client Retainer"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Amount Input */}
            <Text style={styles.label}>Amount (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            {/* Category Chips */}
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {filteredCategories.map((item) => {
                const isSelected = category === item.name;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.categoryChip,
                      isSelected && { backgroundColor: item.color, borderColor: item.color },
                    ]}
                    onPress={() => setCategory(item.name)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={14}
                      color={isSelected ? '#FFF' : item.color}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && { color: '#FFF', fontWeight: '700' },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Date Input */}
            <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-10-28"
              placeholderTextColor={colors.textMuted}
              value={date}
              onChangeText={setDate}
            />

            {/* Notes / Description */}
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional memo or reference..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            {/* Submit Action */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>
                {isEdit ? 'Update Transaction' : 'Save Transaction'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.expenseLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    marginLeft: 8,
    color: colors.expense,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  formScroll: {
    paddingBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    gap: 6,
  },
  expenseActive: {
    backgroundColor: colors.expense,
    borderColor: colors.expense,
  },
  incomeActive: {
    backgroundColor: colors.income,
    borderColor: colors.income,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeBtnActiveText: {
    color: '#FFF',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});

