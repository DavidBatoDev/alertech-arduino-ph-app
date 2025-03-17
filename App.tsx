// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Alarm: 'alarm', // Deep link: myapp://alarm

    },
  },
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
