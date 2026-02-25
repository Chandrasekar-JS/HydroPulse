import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';

const StatBox = ({ value, label, style, valueStyle, labelStyle }) => (
  <View style={[styles.statBox, style]}>
    <Text style={[styles.statValue, valueStyle]}>{value}</Text>
    <Text style={[styles.statLabel, labelStyle]}>{label}</Text>
  </View>
);

const StatsScreen = ({ settings, intakeLog, streakData, goalMet }) => {
  const todayTotal = intakeLog.reduce((sum, e) => sum + e.amount, 0);
  const fillPercent = Math.min((todayTotal / settings.dailyGoal) * 100, 100);
  const remaining = Math.max(settings.dailyGoal - todayTotal, 0);
  const cupsToday = intakeLog.length;
  const avgPerCup = cupsToday > 0 ? Math.round(todayTotal / cupsToday) : 0;

  // Hourly breakdown
  const hourlyData = {};
  intakeLog.forEach((e) => {
    const hour = e.time?.split(':')[0] || '?';
    hourlyData[hour] = (hourlyData[hour] || 0) + e.amount;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Today's Stats */}
      <Text style={styles.sectionTitle}>Today's Stats</Text>
      <View style={styles.statsGrid}>
        <StatBox value={`${todayTotal}`} label="ml consumed" />
        <StatBox value={`${remaining}`} label="ml remaining" />
        <StatBox value={`${cupsToday}`} label="glasses" />
        <StatBox value={`${avgPerCup}`} label="ml avg / glass" />
      </View>

      {/* Streak Stats */}
      <Text style={styles.sectionTitle}>Streaks</Text>
      <View style={styles.statsGrid}>
        <StatBox
          value={`🔥 ${streakData.current}`}
          label="current streak"
          style={styles.streakBox}
          valueStyle={styles.streakValue}
          labelStyle={styles.streakLabel}
        />
        <StatBox
          value={`🏆 ${streakData.best}`}
          label="best streak"
          style={styles.trophyBox}
          valueStyle={styles.trophyValue}
          labelStyle={styles.trophyLabel}
        />
      </View>

      {/* Progress Bar */}
      <Text style={styles.sectionTitle}>Progress</Text>
      <View style={styles.card}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${fillPercent}%`,
                backgroundColor: goalMet ? Colors.success : Colors.primary,
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>0 ml</Text>
          <Text
            style={[
              styles.progressPercent,
              { color: goalMet ? Colors.success : Colors.primary },
            ]}
          >
            {Math.round(fillPercent)}%
          </Text>
          <Text style={styles.progressText}>{settings.dailyGoal} ml</Text>
        </View>
      </View>

      {/* Hourly Breakdown */}
      {Object.keys(hourlyData).length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Hourly Breakdown</Text>
          <View style={styles.card}>
            {Object.entries(hourlyData)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([hour, amount]) => {
                const barWidth = Math.min((amount / settings.dailyGoal) * 100, 100);
                return (
                  <View key={hour} style={styles.hourRow}>
                    <Text style={styles.hourLabel}>{hour}:00</Text>
                    <View style={styles.hourBarTrack}>
                      <View
                        style={[styles.hourBarFill, { width: `${barWidth}%` }]}
                      />
                    </View>
                    <Text style={styles.hourAmount}>{amount}ml</Text>
                  </View>
                );
              })}
          </View>
        </>
      )}

      {/* Motivation */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationEmoji}>
          {goalMet ? '🌟' : fillPercent > 50 ? '💪' : '🚰'}
        </Text>
        <Text style={styles.motivationText}>
          {goalMet
            ? "You've crushed your hydration goal today! Keep the streak alive tomorrow."
            : fillPercent > 75
            ? "Almost there! Just a few more glasses to hit your goal."
            : fillPercent > 50
            ? "You're past the halfway mark! Keep it up."
            : fillPercent > 25
            ? "Good start! Remember to keep sipping throughout the day."
            : "Your hydration journey starts with the first sip. Let's go!"}
        </Text>
      </View>

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
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // Streak boxes
  streakBox: {
    backgroundColor: Colors.streakBg,
    borderColor: Colors.streakBorder,
  },
  streakValue: {
    color: Colors.streakDark,
  },
  streakLabel: {
    color: '#a16207',
  },
  trophyBox: {
    backgroundColor: '#fce7f3',
    borderColor: '#fbcfe8',
  },
  trophyValue: {
    color: '#9d174d',
  },
  trophyLabel: {
    color: '#be185d',
  },

  // Card
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
  },

  // Progress
  progressTrack: {
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e0efff',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 9,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  progressPercent: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },

  // Hourly
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  hourLabel: {
    width: 45,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  hourBarTrack: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0efff',
    overflow: 'hidden',
  },
  hourBarFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  hourAmount: {
    width: 50,
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'right',
  },

  // Motivation
  motivationCard: {
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    gap: 8,
  },
  motivationEmoji: {
    fontSize: 32,
  },
  motivationText: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
});

export default StatsScreen;
