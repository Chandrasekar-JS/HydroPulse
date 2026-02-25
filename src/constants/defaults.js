export const STORAGE_KEYS = {
  PROFILE: '@hydro_profile',
  SETTINGS: '@hydro_settings',
  STREAK: '@hydro_streak',
  INTAKE_PREFIX: '@hydro_intake_',
};

export const DEFAULT_SETTINGS = {
  dailyGoal: 2500,
  frequency: 20, // minutes
  startHour: 7,
  startMinute: 0,
  endHour: 22,
  endMinute: 0,
  cupSize: 250,
  notificationsEnabled: true,
};

export const DEFAULT_PROFILE = {
  name: '',
  weight: 70,
  unit: 'kg',
  activityLevel: 'moderate',
  setupComplete: false,
};

export const DEFAULT_STREAK = {
  current: 0,
  best: 0,
  history: {},
};

export const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: '🪑  Sedentary', multiplier: 0.85 },
  { key: 'moderate', label: '🚶  Moderate', multiplier: 1.0 },
  { key: 'active', label: '🏃  Active', multiplier: 1.2 },
  { key: 'veryActive', label: '💪  Very Active', multiplier: 1.4 },
];

export const FREQUENCY_OPTIONS = [15, 20, 30, 45, 60, 90, 120];
export const CUP_SIZE_OPTIONS = [100, 150, 200, 250, 300, 500];
