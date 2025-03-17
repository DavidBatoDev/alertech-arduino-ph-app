// App.tsx
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import { request, PERMISSIONS } from 'react-native-permissions';

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Alarm: 'alarm', // Deep link: myapp://alarm
    },
  },
};

export default function App() {
  useEffect(() => {
    // Request location permission for Android
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('Location permission:', result);
      }
    };

    // Request notification permission for Android 13+.
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android') {
    // Use the literal permission string as a workaround
    const result = await request("android.permission.POST_NOTIFICATIONS" as any);
        console.log('Notification permission:', result);
      }
    };

    requestLocationPermission();
    requestNotificationPermission();
  }, []);

  return (
    <PaperProvider>
      <Provider store={store}>
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
}
