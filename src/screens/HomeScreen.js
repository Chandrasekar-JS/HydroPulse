import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { getWeekDays, getQuickAddAmounts } from '../utils/helpers';
import { getNextReminderTime } from '../utils/notifications';
import WaveCircle from '../components/WaveCircle';

const HomeScreen = ({ profile, settings, intakeLog, streakData, goalMet, onAddWater, onRemoveEntry }) => {
  const [customAmount, setCustomAmount] = useState('');
  const [scaleAnim] = useState(new Animated.Value(1));
  const [nextReminder, setNextReminder] = useState(null);

  const todayTotal = intakeLog.reduce((sum, e) => sum + e.amount, 0);
  const fillPercent = Math.min((todayTotal / settings.dailyGoal) * 100, 100);
  const quickAmounts = getQuickAddAmounts(settings.cupSize);
  const weekDays = getWeekDays(streakData.history, goalMet);

  // Update next reminder every minute
  useEffect(() => {
    const update = () => setNextReminder(getNextReminderTime(settings));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [settings]);

  const handleAdd = (amount) => {
    // Trigger bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.06, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    onAddWater(amount);
  };

  const handleCustomAdd = () => {
    const amt = Number(customAmount);
    if (amt > 0) {
      handleAdd(amt);
      setCustomAmount('');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetTitle}>
          {goalMet ? '🎉 Goal Reached!' : `Hi, ${profile.name || 'there'}!`}
        </Text>
        <Text style={styles.greetSub}>
          {goalMet ? 'Amazing work today!' : 'Stay hydrated today'}
        </Text>
      </View>

      {/* Streak Banner */}
      <View style={styles.streakBanner}>
        <View style={styles.streakLeft}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakCount}>{streakData.current}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
        <Text style={styles.streakBest}>Best: {streakData.best} days</Text>
      </View>

      {/* Week View */}
      <View style={styles.weekRow}>
        {weekDays.map((d, i) => (
          <View key={i} style={styles.weekDay}>
            <Text style={[styles.weekLabel, d.isToday && styles.weekLabelToday]}>
              {d.label}
            </Text>
            <View
              style={[
                styles.weekDot,
                d.met && styles.weekDotMet,
                d.isToday && !d.met && styles.weekDotToday,
              ]}
            >
              {d.met && <Text style={styles.weekCheck}>✓</Text>}
            </View>
          </View>
        ))}
      </View>

      {/* Water Circle */}
      <Animated.View style={[styles.circleWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <WaveCircle fillPercent={fillPercent} size={200} />
        <View style={styles.circleTextOverlay}>
          <Text
            style={[
              styles.circleAmount,
              fillPercent > 50 && { color: '#fff' },
            ]}
          >
            {todayTotal}
          </Text>
          <Text
            style={[
              styles.circleGoal,
              fillPercent > 50 && { color: 'rgba(255,255,255,0.85)' },
            ]}
          >
            of {settings.dailyGoal} ml
          </Text>
        </View>
      </Animated.View>

      {/* Quick Add Buttons */}
      <View style={styles.quickRow}>
        {quickAmounts.map((amt) => (
          <TouchableOpacity
            key={amt}
            style={styles.quickBtn}
            onPress={() => handleAdd(amt)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickDropIcon}>💧</Text>
            <Text style={styles.quickText}>{amt}ml</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Amount */}
      <View style={styles.customRow}>
        <TextInput
          style={styles.customInput}
          placeholder="Custom ml"
          placeholderTextColor={Colors.textFaint}
          keyboardType="numeric"
          value={customAmount}
          onChangeText={setCustomAmount}
          onSubmitEditing={handleCustomAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleCustomAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Next Reminder */}
      {settings.notificationsEnabled && nextReminder && !goalMet && (
        <View style={styles.reminderBadge}>
          <Text style={styles.reminderText}>
            ⏰ Next reminder at{' '}
            {nextReminder.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}

      {/* Today's Log */}
      {intakeLog.length > 0 && (
        <View style={styles.logSection}>
          <Text style={styles.logTitle}>Today's Log</Text>
          {intakeLog.map((entry) => (
            <View key={entry.id} style={styles.logItem}>
              <View style={styles.logLeft}>
                <Text style={styles.logDrop}>💧</Text>
                <Text style={styles.logAmount}>{entry.amount}ml</Text>
              </View>
              <View style={styles.logRight}>
                <Text style={styles.logTime}>{entry.time}</Text>
                <TouchableOpacity
                  onPress={() => onRemoveEntry(entry.id)}
                  style={styles.logDelete}
                  activeOpacity={0.6}
                >
                  <Text style={styles.logDeleteText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceBg,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },

  // Greeting
  greeting: { marginBottom: Spacing.sm },
  greetTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.text,
  },
  greetSub: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Streak
  streakBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.streakBg,
    borderWidth: 1,
    borderColor: Colors.streakBorder,
    marginBottom: Spacing.md,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakIcon: { fontSize: 22 },
  streakCount: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.streak,
  },
  streakLabel: {
    fontSize: FontSize.md,
    color: Colors.streakDark,
    fontWeight: '500',
  },
  streakBest: {
    fontSize: FontSize.sm,
    color: '#b45309',
  },

  // Week
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
  },
  weekDay: {
    alignItems: 'center',
    gap: 4,
  },
  weekLabel: {
    fontSize: FontSize.xs,
    color: Colors.textFaint,
  },
  weekLabelToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  weekDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDotMet: {
    backgroundColor: Colors.primary,
    ...Shadow.sm,
  },
  weekDotToday: {
    backgroundColor: '#e0efff',
    borderWidth: 2,
    borderColor: '#93c5fd',
  },
  weekCheck: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: '700',
  },

  // Circle
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
  },
  circleTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  circleAmount: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.text,
  },
  circleGoal: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },

  // Quick Add
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radius.lg,
    backgroundColor: '#f0f7ff',
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
  },
  quickDropIcon: { fontSize: 14 },
  quickText: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },

  // Custom
  customRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.sm,
  },
  customInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    fontSize: FontSize.lg,
    color: Colors.text,
    textAlign: 'center',
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    ...Shadow.lg,
  },
  addBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },

  // Reminder
  reminderBadge: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    alignItems: 'center',
  },
  reminderText: {
    fontSize: FontSize.md,
    color: '#166534',
  },

  // Log
  logSection: {
    marginTop: Spacing.lg,
  },
  logTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 6,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logDrop: { fontSize: 16 },
  logAmount: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
  logRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logTime: {
    fontSize: FontSize.md,
    color: Colors.textFaint,
  },
  logDelete: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: Colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logDeleteText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -1,
  },
});

export default HomeScreen;
