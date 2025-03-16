// src/screens/NeighborhoodDashboardScreen.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NeighborhoodDashboard'
>;

export default function NeighborhoodDashboardScreen({route}: Props) {
  const {stationId} = route.params || {};

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
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 8},
  info: {fontSize: 16, textAlign: 'center'},
});
