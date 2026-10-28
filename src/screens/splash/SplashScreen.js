import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isFinished = useRef(false);

  useEffect(() => {
    // 1. Initial smooth logo fade-in & scale-up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Subtle pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // 3. Exactly 3-second splash timer with unmount cleanup
    const timer = setTimeout(() => {
      if (!isFinished.current) {
        isFinished.current = true;
        if (onFinish) {
          onFinish();
        }
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      isFinished.current = true;
    };
  }, [fadeAnim, scaleAnim, pulseAnim, onFinish]);

  return (
    <LinearGradient
      colors={['#0F172A', '#1D4ED8', '#38BDF8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        {/* Centered App Logo */}
        <View style={styles.logoBadge}>
          <Ionicons name="wallet" size={54} color="#FFFFFF" />
        </View>

        {/* App Title & Slogan */}
        <Text style={styles.appName}>Finance & Budget Tracker</Text>
        <Text style={styles.appTagline}>Smart Analytics • Daily Reports</Text>
      </Animated.View>

      {/* Loading Indicator & Subtext */}
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
        <Text style={styles.loadingText}>Initializing workspace...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 104,
    height: 104,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 13,
    color: '#BAE6FD',
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});

