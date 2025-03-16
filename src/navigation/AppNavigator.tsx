// src/navigation/AppNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import screens
import DetailsScreen from '../screens/DetailsScreen';
import WelcomeScreen from '../screens/welcomeScreens/WelcomeScreen';
import ChooseTypeScreen from '../screens/welcomeScreens/ChooseTypeScreen';
import DeviceIdScreen from '../screens/welcomeScreens/DeviceIdScreen';
import ChooseFireStationScreen from '../screens/welcomeScreens/ChooseFireStationScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import NeighborhoodDashboardScreen from '../screens/NeighborhoodDashboardScreen';

// Define route names & params
export type RootStackParamList = {
  Home: undefined;
  Details: {itemId: number; otherParam: string};
  Welcome: undefined;
  ChooseType: undefined;
  DeviceId: undefined;
  ChooseFireStation: undefined;
  UserDashboard: {deviceId?: string}; // Optional param
  NeighborhoodDashboard: {stationId?: string}; // Optional param
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{title: 'Details'}}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{title: 'ALERTECH', headerShown: false}}
      />
      <Stack.Screen
        name="ChooseType"
        component={ChooseTypeScreen}
        options={{title: 'Choose Type', headerBackButtonDisplayMode: 'default', headerShown: false}}
      />
      <Stack.Screen
        name="DeviceId"
        component={DeviceIdScreen}
        options={{title: 'Enter Device ID', headerShown: false}}
      />
      <Stack.Screen
        name="ChooseFireStation"
        component={ChooseFireStationScreen}
        options={{title: 'Choose Fire Station', headerShown: false}}
      />
      <Stack.Screen
        name="UserDashboard"
        component={UserDashboardScreen}
        options={{title: 'Fire & Gas Alert'}}
      />
      <Stack.Screen
        name="NeighborhoodDashboard"
        component={NeighborhoodDashboardScreen}
        options={{title: 'Neighborhood Alert'}}
      />
    </Stack.Navigator>
  );
}
