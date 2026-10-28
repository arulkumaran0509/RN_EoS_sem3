import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppDrawer } from './AppDrawer';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { CategoryDetailsScreen } from '../screens/categories/CategoryDetailsScreen';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DrawerRoot" component={AppDrawer} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
    </Stack.Navigator>
  );
};

