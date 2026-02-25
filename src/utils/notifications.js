import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// ─── Configuration ───

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Permission ───

export const requestNotificationPermission = async () => {
  if (!Device.isDevice) {
    console.log('Notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  // Android needs a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('hydration-reminders', {
      name: 'Hydration Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563eb',
      sound: 'default',
    });
  }

  return true;
};

// ─── Schedule Recurring Reminders ───

/**
 * Cancel all existing reminders and schedule new ones
 * based on the user's frequency, start/end hour settings.
 *
 * Strategy: We schedule individual notifications at each
 * reminder interval within the active hours window for today.
 * A daily trigger reschedules them each day.
 */
export const scheduleReminders = async (settings) => {
  // Cancel all existing
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.notificationsEnabled) {
    return [];
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return [];

  const { frequency, startHour, startMinute, endHour, endMinute, dailyGoal } = settings;

  const scheduledIds = [];

  // Calculate all reminder times within the active window
  let currentMinutes = startHour * 60 + startMinute + frequency;
  const endMinutes = endHour * 60 + endMinute;

  const messages = [
    '💧 Time to hydrate! Your body will thank you.',
    '💧 Water break! Stay on track with your goal.',
    '💧 Drink up! Keep the hydration streak going.',
    '💧 Reminder: A glass of water goes a long way!',
    '💧 Stay refreshed! Time for some water.',
    '💧 Hydration check! How\'s your water intake today?',
  ];

  let index = 0;

  while (currentMinutes < endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'HydroPulse 💧',
          body: messages[index % messages.length],
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === 'android' && {
            channelId: 'hydration-reminders',
          }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      scheduledIds.push({ id, hour, minute });
    } catch (e) {
      console.warn(`Failed to schedule ${hour}:${minute}`, e);
    }

    currentMinutes += frequency;
    index++;
  }

  return scheduledIds;
};

// ─── Get Next Scheduled Reminder ───

export const getNextReminderTime = (settings) => {
  if (!settings.notificationsEnabled) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = settings.startHour * 60 + settings.startMinute;
  const endMinutes = settings.endHour * 60 + settings.endMinute;

  if (currentMinutes >= endMinutes) return null;

  // Find the next reminder slot after now
  let nextMinutes = startMinutes + settings.frequency;
  while (nextMinutes <= currentMinutes && nextMinutes < endMinutes) {
    nextMinutes += settings.frequency;
  }

  if (nextMinutes >= endMinutes) return null;

  const nextTime = new Date();
  nextTime.setHours(Math.floor(nextMinutes / 60), nextMinutes % 60, 0, 0);
  return nextTime;
};

// ─── Cancel All ───

export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
