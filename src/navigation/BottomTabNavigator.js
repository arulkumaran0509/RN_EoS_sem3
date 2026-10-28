import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useAppInsets } from '../utils/useAppInsets';

import { HomeScreen } from '../screens/home/HomeScreen';
import { AnalysisScreen } from '../screens/analysis/AnalysisScreen';
import { MonthTransactionsScreen } from '../screens/transactions/MonthTransactionsScreen';
import { OverallCategoriesScreen } from '../screens/categories/OverallCategoriesScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  const { user } = useApp();
  const isAdmin = user?.role === 'admin';
  const { bottomInset } = useAppInsets();

  const bottomPadding = bottomInset;
  const tabHeight = 60 + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: bottomPadding,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* 1. Home Screen (Available to both Admin and Customer) */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Analysis Screen (Available to both Admin and Customer) */}
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          tabBarLabel: 'Analysis',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'pie-chart' : 'pie-chart-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      {/* 3 & 4. Customer Only Tabs (Hidden and prevented for Admin) */}
      {!isAdmin && (
        <Tab.Screen
          name="Transactions"
          component={MonthTransactionsScreen}
          options={{
            tabBarLabel: 'Transactions',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'receipt' : 'receipt-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      )}

      {!isAdmin && (
        <Tab.Screen
          name="Categories"
          component={OverallCategoriesScreen}
          options={{
            tabBarLabel: 'Categories',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBarItem: {
    paddingVertical: 1,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
});
