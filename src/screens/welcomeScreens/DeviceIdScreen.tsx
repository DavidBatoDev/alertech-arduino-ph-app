// src/screens/DeviceIdScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Image } from 'react-native';
import deviceimage from '../../assets/images/device_id.png';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceId'>;

export default function DeviceIdScreen({ navigation }: Props) {
  const [deviceId, setDeviceId] = useState('');

  const handleNext = () => {
    navigation.navigate('UserDashboard', { deviceId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Device ID</Text>

      <Text style={styles.description}>
        The Device ID is a unique identifier for your device. You can find it on the back of the device.
      </Text>

      <Image source={deviceimage} style={styles.deviceImage} />

      <TextInput
        style={styles.input}
        placeholder="Enter Device ID"
        placeholderTextColor="#808080"
        value={deviceId}
        onChangeText={setDeviceId}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={!deviceId.trim()}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FB4F4F', 
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  deviceImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FF8A80',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: 'white',
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#FF7E5F', 
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

