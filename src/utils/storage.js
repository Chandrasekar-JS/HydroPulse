import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_PROFILE, DEFAULT_SETTINGS, DEFAULT_STREAK } from '../constants/defaults';
import { getTodayKey } from './helpers';

// ─── Generic Storage Helpers ───

const getJSON = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Storage read error [${key}]:`, e);
    return fallback;
  }
};

const setJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`Storage write error [${key}]:`, e);
    return false;
  }
};

// ─── Profile ───

export const loadProfile = () => getJSON(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);

export const saveProfile = (profile) => setJSON(STORAGE_KEYS.PROFILE, profile);

// ─── Settings ───

export const loadSettings = () => getJSON(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

export const saveSettings = (settings) => setJSON(STORAGE_KEYS.SETTINGS, settings);

// ─── Streak ───

export const loadStreak = () => getJSON(STORAGE_KEYS.STREAK, DEFAULT_STREAK);

export const saveStreak = (streak) => setJSON(STORAGE_KEYS.STREAK, streak);

// ─── Daily Intake ───

const getIntakeKey = (date) => `${STORAGE_KEYS.INTAKE_PREFIX}${date || getTodayKey()}`;

export const loadTodayIntake = () => getJSON(getIntakeKey(), []);

export const saveTodayIntake = (log) => setJSON(getIntakeKey(), log);

export const loadIntakeForDate = (dateKey) => getJSON(getIntakeKey(dateKey), []);

// ─── Reset All ───

export const resetAllData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const hydroKeys = allKeys.filter((k) => k.startsWith('@hydro_'));
    await AsyncStorage.multiRemove(hydroKeys);
    return true;
  } catch (e) {
    console.warn('Reset error:', e);
    return false;
  }
};
