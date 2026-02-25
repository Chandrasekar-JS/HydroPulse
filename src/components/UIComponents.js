import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Colors, Radius, Spacing, FontSize, Shadow } from '../constants/theme';

// ─── Primary Button ───
export const PrimaryButton = ({ title, onPress, style, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
    style={[styles.primaryBtn, disabled && styles.disabledBtn, style]}
  >
    <Text style={styles.primaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ─── Secondary Button ───
export const SecondaryButton = ({ title, onPress, style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.secondaryBtn, style]}>
    <Text style={styles.secondaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ─── Danger Button ───
export const DangerButton = ({ title, onPress, style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.dangerBtn, style]}>
    <Text style={styles.dangerBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ─── Toggle Chip ───
export const ToggleChip = ({ label, active, onPress, style }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.chip, active && styles.chipActive, style]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Input Field ───
export const InputField = ({ label, value, onChangeText, placeholder, keyboardType, style }) => (
  <View style={[styles.inputGroup, style]}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={styles.input}
      value={String(value)}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType || 'default'}
      placeholderTextColor={Colors.textFaint}
    />
  </View>
);

// ─── Card ───
export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ─── Section Title ───
export const SectionTitle = ({ title, style }) => (
  <Text style={[styles.sectionTitle, style]}>{title}</Text>
);

// ─── Setting Row ───
export const SettingRow = ({ label, value }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Text style={styles.settingValue}>{value}</Text>
  </View>
);

// ─── Styles ───
const styles = StyleSheet.create({
  primaryBtn: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    ...Shadow.lg,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  secondaryBtn: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  dangerBtn: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
    backgroundColor: Colors.dangerBg,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: Colors.danger,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingLabel: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  settingValue: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.text,
  },
});
