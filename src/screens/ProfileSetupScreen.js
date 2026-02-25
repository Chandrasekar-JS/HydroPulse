import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { ACTIVITY_LEVELS, FREQUENCY_OPTIONS, CUP_SIZE_OPTIONS } from '../constants/defaults';
import { calculateRecommendedIntake, formatTime } from '../utils/helpers';
import {
  PrimaryButton,
  SecondaryButton,
  ToggleChip,
  InputField,
} from '../components/UIComponents';

const ProfileSetupScreen = ({ profile, settings, onComplete }) => {
  const [step, setStep] = useState(0);
  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const recommended = calculateRecommendedIntake(
    localProfile.weight,
    localProfile.unit,
    localProfile.activityLevel
  );

  // ─── Step 0: Welcome ───
  const renderWelcome = () => (
    <View style={styles.stepCard}>
      <Text style={styles.heroEmoji}>💧</Text>
      <Text style={styles.appTitle}>HydroPulse</Text>
      <Text style={styles.subtitle}>Your personal hydration companion</Text>
      <Text style={styles.description}>
        Track your daily water intake, build healthy streaks, and never forget to
        hydrate with smart reminders.
      </Text>
      <PrimaryButton
        title="Get Started →"
        onPress={() => setStep(1)}
        style={{ marginTop: 8, width: '100%' }}
      />
    </View>
  );

  // ─── Step 1: Profile Info ───
  const renderProfile = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>About You</Text>
      <Text style={styles.stepSubtitle}>Help us personalize your hydration goal</Text>

      <InputField
        label="Your Name"
        value={localProfile.name}
        onChangeText={(text) => setLocalProfile({ ...localProfile, name: text })}
        placeholder="Enter your name"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Body Weight</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <InputField
              value={String(localProfile.weight)}
              onChangeText={(t) =>
                setLocalProfile({ ...localProfile, weight: Number(t) || 0 })
              }
              keyboardType="numeric"
              style={{ marginBottom: 0 }}
            />
          </View>
          <View style={styles.toggleRow}>
            {['kg', 'lbs'].map((u) => (
              <ToggleChip
                key={u}
                label={u}
                active={localProfile.unit === u}
                onPress={() => setLocalProfile({ ...localProfile, unit: u })}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.chipWrap}>
          {ACTIVITY_LEVELS.map((a) => (
            <ToggleChip
              key={a.key}
              label={a.label}
              active={localProfile.activityLevel === a.key}
              onPress={() =>
                setLocalProfile({ ...localProfile, activityLevel: a.key })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.navRow}>
        <SecondaryButton title="← Back" onPress={() => setStep(0)} style={{ flex: 1 }} />
        <PrimaryButton
          title="Continue →"
          onPress={() => {
            setLocalSettings({ ...localSettings, dailyGoal: recommended });
            setStep(2);
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );

  // ─── Step 2: Hydration Settings ───
  const renderSettings = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>Your Hydration Plan</Text>

      {/* Recommended box */}
      <View style={styles.recommendedBox}>
        <Text style={styles.recLabel}>Recommended for you</Text>
        <Text style={styles.recValue}>{recommended} ml</Text>
        <Text style={styles.recHint}>Based on your weight & activity</Text>
      </View>

      <InputField
        label="Daily Goal (ml)"
        value={String(localSettings.dailyGoal)}
        onChangeText={(t) =>
          setLocalSettings({ ...localSettings, dailyGoal: Number(t) || 0 })
        }
        keyboardType="numeric"
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reminder Frequency</Text>
        <View style={styles.chipWrap}>
          {FREQUENCY_OPTIONS.map((m) => (
            <ToggleChip
              key={m}
              label={m >= 60 ? `${m / 60}h` : `${m} min`}
              active={localSettings.frequency === m}
              onPress={() => setLocalSettings({ ...localSettings, frequency: m })}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Active Hours</Text>
        <View style={styles.row}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>
              {formatTime(localSettings.startHour, localSettings.startMinute)}
            </Text>
            <View style={styles.timeControls}>
              <ToggleChip
                label="−"
                onPress={() =>
                  setLocalSettings({
                    ...localSettings,
                    startHour: Math.max(0, localSettings.startHour - 1),
                  })
                }
                style={styles.timeBtn}
              />
              <ToggleChip
                label="+"
                onPress={() =>
                  setLocalSettings({
                    ...localSettings,
                    startHour: Math.min(23, localSettings.startHour + 1),
                  })
                }
                style={styles.timeBtn}
              />
            </View>
          </View>
          <Text style={styles.toText}>to</Text>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>
              {formatTime(localSettings.endHour, localSettings.endMinute)}
            </Text>
            <View style={styles.timeControls}>
              <ToggleChip
                label="−"
                onPress={() =>
                  setLocalSettings({
                    ...localSettings,
                    endHour: Math.max(0, localSettings.endHour - 1),
                  })
                }
                style={styles.timeBtn}
              />
              <ToggleChip
                label="+"
                onPress={() =>
                  setLocalSettings({
                    ...localSettings,
                    endHour: Math.min(23, localSettings.endHour + 1),
                  })
                }
                style={styles.timeBtn}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cup Size (ml)</Text>
        <View style={styles.chipWrap}>
          {CUP_SIZE_OPTIONS.map((s) => (
            <ToggleChip
              key={s}
              label={`${s}ml`}
              active={localSettings.cupSize === s}
              onPress={() => setLocalSettings({ ...localSettings, cupSize: s })}
            />
          ))}
        </View>
      </View>

      <View style={styles.navRow}>
        <SecondaryButton title="← Back" onPress={() => setStep(1)} style={{ flex: 1 }} />
        <PrimaryButton
          title="Start Tracking 💧"
          onPress={() => onComplete(localProfile, localSettings)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );

  const steps = [renderWelcome, renderProfile, renderSettings];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress indicator */}
        <View style={styles.progressRow}>
          {[0, 1, 2].map((s) => (
            <View
              key={s}
              style={[styles.progressDot, step >= s && styles.progressDotActive]}
            />
          ))}
        </View>

        {steps[step]()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbeafe',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.xxl,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#cbd5e1',
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  stepCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
    ...Shadow.md,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  appTitle: {
    fontSize: FontSize.display,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  description: {
    textAlign: 'center',
    fontSize: FontSize.base,
    color: Colors.textMuted,
    lineHeight: 21,
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  stepTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  navRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.lg,
    width: '100%',
  },
  recommendedBox: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryBg,
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
    marginBottom: Spacing.lg,
    width: '100%',
    gap: 2,
  },
  recLabel: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  recValue: {
    fontSize: FontSize.display,
    fontWeight: '700',
    color: Colors.primary,
  },
  recHint: {
    fontSize: FontSize.sm,
    color: Colors.textFaint,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  timeText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  timeControls: {
    flexDirection: 'row',
    gap: 4,
  },
  timeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  toText: {
    color: Colors.textFaint,
    fontWeight: '600',
    fontSize: FontSize.base,
  },
});

export default ProfileSetupScreen;
