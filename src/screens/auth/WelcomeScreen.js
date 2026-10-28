import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAppInsets } from '../../utils/useAppInsets';

export const WelcomeScreen = ({ navigation }) => {
  const { topInset } = useAppInsets();
  const { switchRole } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topInset + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Hero Icon */}
        <View style={styles.heroIconBox}>
          <Ionicons name="wallet" size={42} color={colors.primary} />
        </View>

        <Text style={styles.brandTitle}>FinanceTrack</Text>
        <Text style={styles.brandSubtitle}>
          Smart budget management, real-time analytics & daily reports for modern finances.
        </Text>

        {/* Feature Highlights */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.income} />
            <Text style={styles.featureText}>Daily, Weekly & Monthly dynamic reports</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.income} />
            <Text style={styles.featureText}>Category-wise expense distribution & charts</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.income} />
            <Text style={styles.featureText}>Personalized real-time transaction alerts</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.income} />
            <Text style={styles.featureText}>Role-based access for Admin & Customer</Text>
          </View>
        </View>

        {/* Auth Navigation Actions */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Fast Login for College Evaluation */}
        <View style={styles.quickAccessBox}>
          <Text style={styles.quickAccessTitle}>Quick Exam Demonstration</Text>
          <View style={styles.quickAccessRow}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => switchRole('customer')}
            >
              <Ionicons name="person" size={13} color={colors.primary} />
              <Text style={styles.quickBtnText}>Customer Demo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, styles.quickBtnAdmin]}
              onPress={() => switchRole('admin')}
            >
              <Ionicons name="shield-checkmark" size={13} color={colors.adminBadge} />
              <Text style={[styles.quickBtnText, { color: colors.adminBadge }]}>Admin Demo</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featuresList: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  actionSection: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  quickAccessBox: {
    width: '100%',
    padding: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    alignItems: 'center',
  },
  quickAccessTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    gap: 6,
  },
  quickBtnAdmin: {
    borderColor: '#FBCFE8',
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});
