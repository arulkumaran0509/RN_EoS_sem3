import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useAppInsets } from '../utils/useAppInsets';

export const AlertBanner = () => {
  const { alert, hideAlert } = useApp();
  const { topInset } = useAppInsets();

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert.visible, hideAlert]);

  if (!alert.visible) return null;

  const isError = alert.type === 'error';
  const isInfo = alert.type === 'info';

  const bgColor = isError ? colors.expenseLight : isInfo ? colors.primaryMuted : colors.incomeLight;
  const textColor = isError ? colors.expense : isInfo ? colors.primary : colors.income;
  const iconName = isError
    ? 'alert-circle'
    : isInfo
    ? 'information-circle'
    : 'checkmark-circle';

  const topOffset = topInset + 10;

  return (
    <View
      style={[
        styles.container,
        {
          top: topOffset,
          backgroundColor: bgColor,
          borderColor: textColor,
        },
      ]}
    >
      <Ionicons name={iconName} size={20} color={textColor} style={styles.icon} />
      <Text style={[styles.message, { color: textColor }]}>{alert.message}</Text>
      <TouchableOpacity
        onPress={hideAlert}
        style={styles.closeBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={16} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
