// src/screens/NeighborhoodDashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'NeighborhoodDashboard'>;

export default function NeighborhoodDashboardScreen({ route, navigation }: Props) {
  const { stationId } = route.params || {};

  useEffect(() => {
    // Subscribe to the "all" topic to receive broadcast notifications
    messaging()
      .subscribeToTopic('all')
      .then(() => console.log('Subscribed to topic: all'));

    // Listen for foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received FCM message:', remoteMessage);
      if (remoteMessage.data && remoteMessage.data.type === 'alarm') {
        // Navigate to the Alarm screen (assumes you've defined a screen named "Alarm")
        navigation.navigate('Alarm');
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neighborhood Dashboard</Text>
      <Text style={styles.info}>
        Monitoring alerts from {stationId || 'unknown station'}...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  info: { fontSize: 16, textAlign: 'center' },
});
