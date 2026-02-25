import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  AppState,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontSize } from './src/constants/theme';
import {
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  DEFAULT_STREAK,
} from './src/constants/defaults';

import {
  loadProfile,
  saveProfile as persistProfile,
  loadSettings,
  saveSettings as persistSettings,
  loadStreak,
  saveStreak as persistStreak,
  loadTodayIntake,
  saveTodayIntake,
  resetAllData,
} from './src/utils/storage';

import {
  scheduleReminders,
  requestNotificationPermission,
} from './src/utils/notifications';

import { getTodayKey, calculateStreak } from './src/utils/helpers';

import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// ─── Tab Icons ───
const TabIcon = ({ icon, focused }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
    <Text style={{ fontSize: 22 }}>{icon}</Text>
  </View>
);

// ─── Header Component ───
const AppHeader = ({ streakCount }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerDrop}>💧</Text>
        <Text style={styles.headerTitle}>HydroPulse</Text>
      </View>
      <View style={styles.headerStreak}>
        <Text style={{ fontSize: 14 }}>🔥</Text>
        <Text style={styles.headerStreakCount}>{streakCount}</Text>
      </View>
    </View>
  );
};

// ─── Main App ───
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [streakData, setStreakData] = useState(DEFAULT_STREAK);
  const [intakeLog, setIntakeLog] = useState([]);
  const appState = useRef(AppState.currentState);

  // ─── Load Data on Mount ───
  useEffect(() => {
    (async () => {
      try {
        const [p, s, st, intake] = await Promise.all([
          loadProfile(),
          loadSettings(),
          loadStreak(),
          loadTodayIntake(),
        ]);
        setProfile(p);
        setSettings(s);
        setStreakData(st);
        setIntakeLog(intake);
      } catch (e) {
        console.warn('Load error:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ─── App State Listener (refresh on foreground) ───
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // Reload today's intake in case date changed
        const intake = await loadTodayIntake();
        setIntakeLog(intake);
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, []);

  // ─── Derived State ───
  const todayTotal = intakeLog.reduce((sum, e) => sum + e.amount, 0);
  const goalMet = todayTotal >= settings.dailyGoal;

  // ─── Streak Calculation ───
  useEffect(() => {
    if (!profile.setupComplete) return;

    const history = { ...streakData.history };
    const today = getTodayKey();

    if (goalMet) {
      history[today] = true;
    }

    const current = calculateStreak(history, goalMet);
    const best = Math.max(streakData.best, current);

    if (current !== streakData.current || best !== streakData.best || history[today] !== streakData.history[today]) {
      const newStreak = { current, best, history };
      setStreakData(newStreak);
      persistStreak(newStreak);
    }
  }, [goalMet, profile.setupComplete]);

  // ─── Schedule Notifications When Settings Change ───
  useEffect(() => {
    if (profile.setupComplete) {
      scheduleReminders(settings);
    }
  }, [settings.frequency, settings.startHour, settings.endHour, settings.notificationsEnabled, profile.setupComplete]);

  // ─── Actions ───
  const handleAddWater = useCallback(
    (amount) => {
      const entry = {
        id: Date.now(),
        amount,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      const newLog = [entry, ...intakeLog];
      setIntakeLog(newLog);
      saveTodayIntake(newLog);
    },
    [intakeLog]
  );

  const handleRemoveEntry = useCallback(
    (id) => {
      const newLog = intakeLog.filter((e) => e.id !== id);
      setIntakeLog(newLog);
      saveTodayIntake(newLog);
    },
    [intakeLog]
  );

  const handleSaveProfile = useCallback((p) => {
    const newProfile = { ...p, setupComplete: true };
    setProfile(newProfile);
    persistProfile(newProfile);
  }, []);

  const handleSaveSettings = useCallback((s) => {
    setSettings(s);
    persistSettings(s);
    if (s.notificationsEnabled) {
      requestNotificationPermission().then(() => scheduleReminders(s));
    }
  }, []);

  const handleSetupComplete = useCallback(
    (p, s) => {
      handleSaveProfile(p);
      handleSaveSettings(s);
    },
    [handleSaveProfile, handleSaveSettings]
  );

  const handleReset = useCallback(async () => {
    await resetAllData();
    setProfile(DEFAULT_PROFILE);
    setSettings(DEFAULT_SETTINGS);
    setStreakData(DEFAULT_STREAK);
    setIntakeLog([]);
  }, []);

  // ─── Loading ───
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#dbeafe" />
        <Text style={styles.loadingEmoji}>💧</Text>
        <Text style={styles.loadingText}>HydroPulse</Text>
      </View>
    );
  }

  // ─── Setup Screen ───
  if (!profile.setupComplete) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#dbeafe" />
        <ProfileSetupScreen
          profile={profile}
          settings={settings}
          onComplete={handleSetupComplete}
        />
      </SafeAreaProvider>
    );
  }

  // ─── Main App with Tab Navigation ───
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <View style={styles.appContainer}>
          <AppHeader streakCount={streakData.current} />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarActiveTintColor: Colors.primary,
              tabBarInactiveTintColor: Colors.textFaint,
              tabBarLabelStyle: styles.tabLabel,
            }}
          >
            <Tab.Screen
              name="Home"
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="💧" focused={focused} />,
              }}
            >
              {() => (
                <HomeScreen
                  profile={profile}
                  settings={settings}
                  intakeLog={intakeLog}
                  streakData={streakData}
                  goalMet={goalMet}
                  onAddWater={handleAddWater}
                  onRemoveEntry={handleRemoveEntry}
                />
              )}
            </Tab.Screen>

            <Tab.Screen
              name="Stats"
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} />,
              }}
            >
              {() => (
                <StatsScreen
                  settings={settings}
                  intakeLog={intakeLog}
                  streakData={streakData}
                  goalMet={goalMet}
                />
              )}
            </Tab.Screen>

            <Tab.Screen
              name="Settings"
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
              }}
            >
              {() => (
                <SettingsScreen
                  profile={profile}
                  settings={settings}
                  onSaveProfile={handleSaveProfile}
                  onSaveSettings={handleSaveSettings}
                  onReset={handleReset}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ─── Styles ───
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colors.surfaceBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.overlay,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDrop: { fontSize: 22 },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  headerStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerStreakCount: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.streak,
  },
  tabBar: {
    backgroundColor: Colors.overlay,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    paddingTop: 4,
    height: Platform.OS === 'ios' ? 88 : 64,
  },
  tabIcon: {
    padding: 4,
    borderRadius: 8,
  },
  tabIconFocused: {
    backgroundColor: Colors.primaryBg,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
  },
  loadingEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
});
