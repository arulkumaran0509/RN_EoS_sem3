import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export const PeriodSelector = ({ selectedPeriod, onSelectPeriod }) => {
  const periods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <View style={styles.container}>
      {periods.map((item) => {
        const isActive = selectedPeriod === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => onSelectPeriod(item.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginVertical: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});
