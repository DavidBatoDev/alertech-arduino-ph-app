// src/screens/DeviceIdScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceId'>;

export default function DeviceIdScreen({ navigation }: Props) {
  const [deviceId, setDeviceId] = useState('');

  const handleNext = () => {
    // Pass the device ID if needed
    navigation.navigate('UserDashboard', { deviceId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Device ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Device ID"
        value={deviceId}
        onChangeText={setDeviceId}
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8, borderRadius: 4 },
});
