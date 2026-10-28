import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useAppInsets } from '../utils/useAppInsets';

export const CustomDrawerContent = (props) => {
  const { topInset } = useAppInsets();
  const { user, signOut, switchRole } = useApp();
  const isAdmin = user?.role === 'admin';

  const navigateTo = (screenName, params = {}) => {
    props.navigation.navigate(screenName, params);
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Modern Blue Gradient Profile Section */}
        <LinearGradient
          colors={['#0F172A', '#1D4ED8', '#38BDF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.profileSection, { paddingTop: topInset + 16 }]}
        >
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.roleBadgeContainer}>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: isAdmin ? colors.adminBadge : colors.primary },
                ]}
              >
                <Text style={styles.roleBadgeText}>
                  {isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>

          {/* Practical Exam Role Switcher */}
          <View style={styles.demoSwitcherBox}>
            <Text style={styles.demoSwitcherTitle}>Active Role (Exam Switcher)</Text>
            <View style={styles.switcherButtons}>
              <TouchableOpacity
                style={[styles.switcherBtn, !isAdmin && styles.switcherBtnActive]}
                onPress={() => switchRole('customer')}
              >
                <Text style={[styles.switcherBtnText, !isAdmin && styles.switcherBtnTextActive]}>
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switcherBtn, isAdmin && styles.switcherBtnActiveAdmin]}
                onPress={() => switchRole('admin')}
              >
                <Text style={[styles.switcherBtnText, isAdmin && styles.switcherBtnTextActive]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Drawer Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Navigation</Text>

          {/* 1. Home Dashboard */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('MainTabs', { screen: 'Home' })}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="home-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Home Dashboard</Text>
          </TouchableOpacity>

          {/* 2. Financial Analysis */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('MainTabs', { screen: 'Analysis' })}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="pie-chart-outline" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.menuLabel}>Financial Analysis</Text>
          </TouchableOpacity>

          {/* 3. Customer-Only Routes */}
          {!isAdmin ? (
            <>
              {/* Transactions Tab */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo('MainTabs', { screen: 'Transactions' })}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="receipt-outline" size={18} color="#0284C7" />
                </View>
                <Text style={styles.menuLabel}>Month Transactions</Text>
              </TouchableOpacity>

              {/* Categories Tab */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo('MainTabs', { screen: 'Categories' })}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="grid-outline" size={18} color="#D97706" />
                </View>
                <Text style={styles.menuLabel}>Overall Categories</Text>
              </TouchableOpacity>

              {/* Profile Screen */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo('ProfileScreen')}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="person-outline" size={18} color={colors.income} />
                </View>
                <Text style={styles.menuLabel}>My Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.adminNote}>
              <Ionicons name="shield-checkmark" size={15} color={colors.adminBadge} />
              <Text style={styles.adminNoteText}>
                Admin access: Profile, Transactions & Category modifications restricted to Customer accounts.
              </Text>
            </View>
          )}
        </View>
      </DrawerContentScrollView>

      {/* Logout Footer */}
      <View style={styles.footerSection}>
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={colors.expense} />
          <Text style={styles.logoutText}>Sign Out / Change Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingTop: 0,
  },
  profileSection: {
    padding: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  roleBadgeContainer: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 12,
    color: '#BAE6FD',
    marginTop: 2,
  },
  demoSwitcherBox: {
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 10,
  },
  demoSwitcherTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  switcherButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  switcherBtn: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  switcherBtnActive: {
    backgroundColor: colors.primary,
  },
  switcherBtnActiveAdmin: {
    backgroundColor: colors.adminBadge,
  },
  switcherBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  switcherBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  adminNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  adminNoteText: {
    flex: 1,
    fontSize: 11,
    color: colors.adminBadge,
    lineHeight: 15,
  },
  footerSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.expenseLight,
    gap: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.expense,
  },
});
