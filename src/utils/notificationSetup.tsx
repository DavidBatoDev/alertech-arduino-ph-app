import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

// Function to set up a notification channel
export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'alarm_channel',
      name: 'Alarm Notifications',
      sound: 'alarm_sound', // Ensure the sound file is inside `android/app/src/main/res/raw/`
      importance: AndroidImportance.HIGH,
      vibration: true,
      visibility: AndroidVisibility.PUBLIC,
    });
  }
}
