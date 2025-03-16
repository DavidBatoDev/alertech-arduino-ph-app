// src/screens/WelcomeScreen.tsx
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ALERTECH</Text>
      <Text style={styles.description}>
        Your app to stay safe and informed about fires and gas leaks.
      </Text>
      <Button title="Next" onPress={() => navigation.navigate('ChooseType')} />
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
  description: {fontSize: 16, textAlign: 'center', marginBottom: 16},
});
