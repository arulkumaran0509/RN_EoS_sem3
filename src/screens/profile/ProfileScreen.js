import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAppInsets } from '../../utils/useAppInsets';

export const ProfileScreen = ({ navigation }) => {
  const { topInset } = useAppInsets();
  const { user, monthlyTotals, signOut, switchRole } = useApp();
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawerToggleBtn}
          >
            <Ionicons name="menu" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Profile</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.restrictedContainer}>
          <Ionicons name="shield-alert-outline" size={56} color={colors.adminBadge} />
          <Text style={styles.restrictedTitle}>Customer-Only Feature</Text>
          <Text style={styles.restrictedDesc}>
            User Profile and Edit Profile management are accessible to Customer accounts only.
            You are currently signed in as an Administrator.
          </Text>
          <TouchableOpacity
            style={styles.switchRoleBtn}
            onPress={() => switchRole('customer')}
          >
            <Text style={styles.switchRoleBtnText}>Switch to Customer Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const budgetGoal = user?.budgetGoal || 45000;
  const currentExpense = monthlyTotals.expenses;
  const budgetUsagePct = Math.min(Math.round((currentExpense / budgetGoal) * 100), 100);
  const remainingBudget = budgetGoal - currentExpense;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerToggleBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Profile</Text>
        <TouchableOpacity
          style={styles.editHeaderBtn}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </Text>
          </View>

          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.rolePill}>
              <Ionicons name="shield-checkmark" size={12} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.rolePillText}>VERIFIED CUSTOMER</Text>
            </View>
            <Text style={styles.memberSince}>Member since {user?.joinDate || '2026'}</Text>
          </View>
        </View>

        {/* Monthly Budget Tracker Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetTitle}>Monthly Budget Target</Text>
              <Text style={styles.budgetSub}>Target: ₹{budgetGoal.toLocaleString('en-IN')}</Text>
            </View>
            <View style={[styles.pctBadge, budgetUsagePct > 90 ? styles.pctBadgeWarning : null]}>
              <Text style={styles.pctBadgeText}>{budgetUsagePct}% Used</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${budgetUsagePct}%`,
                  backgroundColor: budgetUsagePct > 90 ? colors.expense : colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.budgetFooter}>
            <Text style={styles.budgetFooterText}>
              Spent: ₹{currentExpense.toLocaleString('en-IN')}
            </Text>
            <Text
              style={[
                styles.budgetFooterText,
                remainingBudget < 0 ? { color: colors.expense, fontWeight: '700' } : null,
              ]}
            >
              {remainingBudget >= 0 ? `Remaining: ₹${remainingBudget.toLocaleString('en-IN')}` : `Over: ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}`}
            </Text>
          </View>
        </View>

        {/* Profile Info Details List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="person-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="mail-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="call-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user?.phone || '+91 98765 43210'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="cash-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Currency Symbol</Text>
              <Text style={styles.infoValue}>Indian Rupee (₹)</Text>
            </View>
          </View>
        </View>

        {/* Actions Button */}
        <TouchableOpacity
          style={styles.editProfileFullBtn}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil-outline" size={16} color="#FFF" />
          <Text style={styles.editProfileBtnText}>Edit Profile Information</Text>
        </TouchableOpacity>

        {/* Sign Out Option */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={16} color={colors.expense} />
          <Text style={styles.signOutBtnText}>Log Out Account</Text>
        </TouchableOpacity>
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
  editHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rolePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  memberSince: {
    fontSize: 11,
    color: colors.textMuted,
  },
  budgetCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  budgetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  budgetSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  pctBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pctBadgeWarning: {
    backgroundColor: colors.expense,
  },
  pctBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  budgetFooterText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 3,
  },
  editProfileFullBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  editProfileBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  signOutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: colors.expenseLight,
    gap: 6,
  },
  signOutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.expense,
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
