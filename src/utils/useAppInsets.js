import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Universal safe insets hook for cross-platform Android & iOS devices.
 * Guarantees proper status-bar offset on Android (where Expo Go often reports
 * translucent insets as 0) and gesture navigation bar clearance.
 */
export const useAppInsets = () => {
  const insets = useSafeAreaInsets();

  const statusBarHeight = Platform.OS === 'android'
    ? (RNStatusBar.currentHeight || 28)
    : (insets.top || 20);

  const topInset = Math.max(insets.top, statusBarHeight);

  // Guarantee minimum 22dp at the bottom on Android so gesture bar doesn't cut through tab labels
  const bottomInset = Platform.OS === 'android'
    ? Math.max(insets.bottom, 22)
    : Math.max(insets.bottom, 10);

  return {
    ...insets,
    topInset,
    bottomInset,
    statusBarHeight,
  };
};

