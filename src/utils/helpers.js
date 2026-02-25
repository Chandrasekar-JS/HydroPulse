import { ACTIVITY_LEVELS } from '../constants/defaults';

/**
 * Get today's date as YYYY-MM-DD string
 */
export const getTodayKey = () => new Date().toISOString().split('T')[0];

/**
 * Format hour and minute to 12-hour time string
 */
export const formatTime = (h, m = 0) => {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

/**
 * Format frequency in minutes to human-readable string
 */
export const formatFrequency = (minutes) => {
  if (minutes >= 60) {
    const hours = minutes / 60;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} min`;
};

/**
 * Calculate recommended daily water intake based on weight and activity level
 * Formula: weight(kg) × 35ml × activity multiplier, rounded to nearest 50
 */
export const calculateRecommendedIntake = (weight, unit, activityLevel) => {
  const weightKg = unit === 'lbs' ? weight * 0.453592 : weight;
  const baseIntake = weightKg * 35;
  const activity = ACTIVITY_LEVELS.find((a) => a.key === activityLevel);
  const multiplier = activity ? activity.multiplier : 1.0;
  return Math.round((baseIntake * multiplier) / 50) * 50;
};

/**
 * Calculate streak from history object
 */
export const calculateStreak = (history, goalMetToday) => {
  const today = getTodayKey();
  let current = 0;
  const d = new Date();

  while (true) {
    const key = d.toISOString().split('T')[0];
    if (key === today) {
      if (goalMetToday) {
        current++;
      } else {
        break;
      }
    } else if (history[key]) {
      current++;
    } else {
      break;
    }
    d.setDate(d.getDate() - 1);
  }

  return current;
};

/**
 * Get last 7 days for the week view
 */
export const getWeekDays = (streakHistory, goalMetToday) => {
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = getTodayKey();

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const isToday = key === today;
    const met = streakHistory[key] || (isToday && goalMetToday);
    return {
      label: dayLabels[d.getDay()],
      met,
      isToday,
    };
  });
};

/**
 * Get quick-add amounts based on cup size
 */
export const getQuickAddAmounts = (cupSize) => {
  return [
    Math.round(cupSize * 0.5),
    cupSize,
    Math.round(cupSize * 2),
  ].sort((a, b) => a - b);
};
