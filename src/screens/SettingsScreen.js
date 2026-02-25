import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import {
  ACTIVITY_LEVELS,
  FREQUENCY_OPTIONS,
  CUP_SIZE_OPTIONS,
} from '../constants/defaults';
import {
  calculateRecommendedIntake,
  formatTime,
  formatFrequency,
} from '../utils/helpers';
import {
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  ToggleChip,
  InputField,
  Card,
  SectionTitle,
  SettingRow,
} from '../components/UIComponents';

const SettingsScreen = ({ profile, settings, onSaveProfile, onSaveSettings, onReset }) => {
  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [tempSettings, setTempSettings] = useState({ ...settings });

  const recommended = calculateRecommendedIntake(
    tempProfile.weight,
    tempProfile.unit,
    tempProfile.activityLevel
  );

  const handleSave = () => {
    onSaveProfile({ ...tempProfile, setupComplete: true });
    onSaveSettings(tempSettings);
    setEditing(false);
  };

  const handleReset = () => {
    const doReset = () => {
      onReset();
      setEditing(false);
    };

    if (Platform.OS === 'web') {
      if (confirm('Reset all data? This cannot be undone.')) doReset();
    } else {
      Alert.alert(
        'Reset All Data',
        'This will delete your profile, settings, streaks, and all intake history. This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: doReset },
        ]
      );
    }
  };

  // ─── Edit Mode ───
  if (editing) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionTitle title="Edit Profile" />
        <Card>
          <InputField
            label="Name"
            value={tempProfile.name}
            onChangeText={(t) => setTempProfile({ ...tempProfile, name: t })}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Weight</Text>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField
                  value={String(tempProfile.weight)}
                  onChangeText={(t) =>
                    setTempProfile({ ...tempProfile, weight: Number(t) || 0 })
                  }
                  keyboardType="numeric"
                  style={{ marginBottom: 0 }}
                />
              </View>
              <View style={styles.chipRow}>
                {['kg', 'lbs'].map((u) => (
                  <ToggleChip
                    key={u}
                    label={u}
                    active={tempProfile.unit === u}
                    onPress={() =>
                      setTempProfile({ ...tempProfile, unit: u })
                    }
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.chipWrap}>
              {ACTIVITY_LEVELS.map((a) => (
                <ToggleChip
                  key={a.key}
                  label={a.label}
                  active={tempProfile.activityLevel === a.key}
                  onPress={() =>
                    setTempProfile({ ...tempProfile, activityLevel: a.key })
                  }
                />
              ))}
            </View>
          </View>
        </Card>

        <SectionTitle title="Hydration Settings" style={{ marginTop: Spacing.xl }} />
        <Card>
          <InputField
            label="Daily Goal (ml)"
            value={String(tempSettings.dailyGoal)}
            onChangeText={(t) =>
              setTempSettings({ ...tempSettings, dailyGoal: Number(t) || 0 })
            }
            keyboardType="numeric"
          />
          <Text style={styles.hint}>Recommended: {recommended}ml</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Reminder Frequency</Text>
            <View style={styles.chipWrap}>
              {FREQUENCY_OPTIONS.map((m) => (
                <ToggleChip
                  key={m}
                  label={m >= 60 ? `${m / 60}h` : `${m}m`}
                  active={tempSettings.frequency === m}
                  onPress={() =>
                    setTempSettings({ ...tempSettings, frequency: m })
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cup Size</Text>
            <View style={styles.chipWrap}>
              {CUP_SIZE_OPTIONS.map((s) => (
                <ToggleChip
                  key={s}
                  label={`${s}ml`}
                  active={tempSettings.cupSize === s}
                  onPress={() =>
                    setTempSettings({ ...tempSettings, cupSize: s })
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Active Hours</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>
                  {formatTime(tempSettings.startHour, tempSettings.startMinute)}
                </Text>
                <View style={styles.timeControls}>
                  <ToggleChip
                    label="−"
                    onPress={() =>
                      setTempSettings({
                        ...tempSettings,
                        startHour: Math.max(0, tempSettings.startHour - 1),
                      })
                    }
                    style={styles.timeBtn}
                  />
                  <ToggleChip
                    label="+"
                    onPress={() =>
                      setTempSettings({
                        ...tempSettings,
                        startHour: Math.min(23, tempSettings.startHour + 1),
                      })
                    }
                    style={styles.timeBtn}
                  />
                </View>
              </View>
              <Text style={styles.toText}>to</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>
                  {formatTime(tempSettings.endHour, tempSettings.endMinute)}
                </Text>
                <View style={styles.timeControls}>
                  <ToggleChip
                    label="−"
                    onPress={() =>
                      setTempSettings({
                        ...tempSettings,
                        endHour: Math.max(0, tempSettings.endHour - 1),
                      })
                    }
                    style={styles.timeBtn}
                  />
                  <ToggleChip
                    label="+"
                    onPress={() =>
                      setTempSettings({
                        ...tempSettings,
                        endHour: Math.min(23, tempSettings.endHour + 1),
                      })
                    }
                    style={styles.timeBtn}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Notifications</Text>
            <TouchableOpacity
              style={[
                styles.notifBtn,
                tempSettings.notificationsEnabled
                  ? styles.notifOn
                  : styles.notifOff,
              ]}
              onPress={() =>
                setTempSettings({
                  ...tempSettings,
                  notificationsEnabled: !tempSettings.notificationsEnabled,
                })
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  tempSettings.notificationsEnabled
                    ? styles.notifOnText
                    : styles.notifOffText
                }
              >
                {tempSettings.notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.actionRow}>
          <SecondaryButton
            title="Cancel"
            onPress={() => setEditing(false)}
            style={{ flex: 1 }}
          />
          <PrimaryButton title="Save Changes" onPress={handleSave} style={{ flex: 1 }} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // ─── View Mode ───
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle title="Profile" />
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile.name || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.profileName}>{profile.name || 'User'}</Text>
          <Text style={styles.profileMeta}>
            {profile.weight} {profile.unit} ·{' '}
            {(ACTIVITY_LEVELS.find((a) => a.key === profile.activityLevel)?.label || profile.activityLevel).replace(/^[^\s]+\s+/, '')}
          </Text>
        </View>
      </View>

      <SectionTitle title="Settings" style={{ marginTop: Spacing.xl }} />
      <Card>
        <SettingRow label="Daily Goal" value={`${settings.dailyGoal} ml`} />
        <SettingRow
          label="Reminder Every"
          value={formatFrequency(settings.frequency)}
        />
        <SettingRow
          label="Active Hours"
          value={`${formatTime(settings.startHour, 0)} – ${formatTime(settings.endHour, 0)}`}
        />
        <SettingRow label="Cup Size" value={`${settings.cupSize} ml`} />
        <SettingRow
          label="Notifications"
          value={settings.notificationsEnabled ? '✅ On' : '❌ Off'}
        />
      </Card>

      <PrimaryButton
        title="✏️  Edit Profile & Settings"
        onPress={() => {
          setTempProfile({ ...profile });
          setTempSettings({ ...settings });
          setEditing(true);
        }}
        style={{ marginTop: Spacing.lg }}
      />

      <DangerButton
        title="🗑️  Reset All Data"
        onPress={handleReset}
        style={{ marginTop: Spacing.sm }}
      />

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>HydroPulse v1.0.0</Text>
        <Text style={styles.appInfoText}>Stay Hydrated, Stay Healthy 💧</Text>
      </View>

      <View style={{ height: 40 }} />
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

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  profileMeta: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Edit mode fields
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Colors.textFaint,
    marginTop: -8,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.xl,
  },

  // Time
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

  // Notification toggle
  notifBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  notifOn: {
    backgroundColor: Colors.successBg,
    borderWidth: 1.5,
    borderColor: Colors.successBorder,
  },
  notifOff: {
    backgroundColor: Colors.dangerBg,
    borderWidth: 1.5,
    borderColor: Colors.dangerBorder,
  },
  notifOnText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#166534',
  },
  notifOffText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#991b1b',
  },

  // App Info
  appInfo: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
    gap: 4,
  },
  appInfoText: {
    fontSize: FontSize.sm,
    color: Colors.textFaint,
  },
});

export default SettingsScreen;
