import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const RoleLogo = ({ role = null, size = 76, showLabel = true }) => {
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  // Role-based icon configuration
  const iconName = isAdmin
    ? 'shield-checkmark'
    : isCustomer
    ? 'wallet'
    : 'bar-chart';

  const roleLabel = isAdmin
    ? 'Admin'
    : isCustomer
    ? 'Customer'
    : 'Finance & Budget Tracker';

  const subLabel = isAdmin
    ? 'Management Portal'
    : isCustomer
    ? 'Personal Finance Account'
    : 'Smart Money Management';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.logoCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Ionicons name={iconName} size={size * 0.48} color="#FFFFFF" />
      </LinearGradient>

      {showLabel && (
        <View style={styles.textContainer}>
          <View style={styles.badgeRow}>
            {role && (
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: isAdmin ? colors.adminBadge : colors.customerBadge,
                  },
                ]}
              >
                <Text style={styles.roleBadgeText}>{roleLabel.toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{role ? `${roleLabel} Sign In` : roleLabel}</Text>
          <Text style={styles.subtitle}>{subLabel}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  logoCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  badgeRow: {
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

