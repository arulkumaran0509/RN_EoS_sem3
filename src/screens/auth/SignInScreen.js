import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { useAppInsets } from '../../utils/useAppInsets';
import { DEMO_USERS } from '../../data/mockData';
import { RoleLogo } from '../../components/RoleLogo';

export const SignInScreen = ({ route, navigation }) => {
  const { topInset } = useAppInsets();
  const { signIn } = useApp();

  // Role can be 'customer', 'admin', or null (unselected)
  const initialRole = route.params?.defaultRole || null;
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Update credentials when role changes
  useEffect(() => {
    if (selectedRole === 'admin') {
      setEmail(DEMO_USERS.admin.email);
      setPassword('admin123');
    } else if (selectedRole === 'customer') {
      setEmail(DEMO_USERS.customer.email);
      setPassword('password123');
    }
  }, [selectedRole]);

  const handleSignIn = () => {
    signIn(email, password, selectedRole || 'customer');
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Account Login</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Role-Based Logo Section */}
          <RoleLogo role={selectedRole} size={80} showLabel={true} />

          {/* Role Selector Tabs (Admin vs Customer) */}
          <View style={styles.roleSelectionBox}>
            <Text style={styles.roleSelectionPrompt}>Select Account Role:</Text>
            <View style={styles.roleTabsRow}>
              <TouchableOpacity
                style={[
                  styles.roleTab,
                  selectedRole === 'customer' && styles.roleTabActiveCustomer,
                ]}
                onPress={() => handleSelectRole('customer')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person"
                  size={15}
                  color={selectedRole === 'customer' ? '#FFFFFF' : colors.primary}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    selectedRole === 'customer' && styles.roleTabTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleTab,
                  selectedRole === 'admin' && styles.roleTabActiveAdmin,
                ]}
                onPress={() => handleSelectRole('admin')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={15}
                  color={selectedRole === 'admin' ? '#FFFFFF' : colors.adminBadge}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    selectedRole === 'admin' && styles.roleTabTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Login Action */}
            <TouchableOpacity
              style={[
                styles.signInBtn,
                selectedRole === 'admin' && { backgroundColor: colors.gradientRoyalBlue },
              ]}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.signInBtnText}>
                {selectedRole === 'admin'
                  ? 'Sign In as Administrator'
                  : selectedRole === 'customer'
                  ? 'Sign In as Customer'
                  : 'Sign In to App'}
              </Text>
            </TouchableOpacity>

            {/* Quick One-Tap Demo Login Pills */}
            <View style={styles.demoFillBox}>
              <Text style={styles.demoFillTitle}>Exam 1-Tap Fast Fill:</Text>
              <View style={styles.demoFillButtons}>
                <TouchableOpacity
                  style={[
                    styles.demoFillBtn,
                    selectedRole === 'customer' && styles.demoFillBtnSelected,
                  ]}
                  onPress={() => handleSelectRole('customer')}
                >
                  <Text style={styles.demoFillBtnText}>Fill Customer (Alex)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.demoFillBtn,
                    styles.demoFillBtnAdmin,
                    selectedRole === 'admin' && styles.demoFillBtnSelectedAdmin,
                  ]}
                  onPress={() => handleSelectRole('admin')}
                >
                  <Text style={[styles.demoFillBtnText, { color: colors.adminBadge }]}>
                    Fill Admin (Sarah)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Link to Sign Up */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to FinanceTrack? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleSelectionBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
  },
  roleSelectionPrompt: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  roleTabActiveCustomer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleTabActiveAdmin: {
    backgroundColor: colors.adminBadge,
    borderColor: colors.adminBadge,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  form: {
    gap: 8,
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: -2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  signInBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signInBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoFillBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoFillTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  demoFillButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  demoFillBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    alignItems: 'center',
  },
  demoFillBtnAdmin: {
    borderColor: '#C084FC',
  },
  demoFillBtnSelected: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1.5,
  },
  demoFillBtnSelectedAdmin: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1.5,
  },
  demoFillBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
