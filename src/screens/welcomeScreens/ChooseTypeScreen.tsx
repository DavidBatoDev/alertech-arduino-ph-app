// src/screens/ChooseTypeScreen.tsx
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseType'>;

export default function ChooseTypeScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Type</Text>
      <Text style={styles.subtitle}>Select your preferred option:</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="I have the alert system device"
          onPress={() => navigation.navigate('DeviceId')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="I don't have an alert system but I want to be alert"
          onPress={() => navigation.navigate('ChooseFireStation')}
        />
      </View>
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
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 16},
  subtitle: {fontSize: 16, marginBottom: 24},
  buttonContainer: {marginVertical: 8},
});
