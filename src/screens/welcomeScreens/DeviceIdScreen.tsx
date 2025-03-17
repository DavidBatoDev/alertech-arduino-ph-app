// src/screens/DeviceIdScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import deviceimage from '../../assets/images/device_id.png';
import { Alert } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceId'>;

export default function DeviceIdScreen({ navigation }: Props) {
  const { user } = useSelector((state: { user: { user: any } }) => state.user);
  const [deviceId, setDeviceId] = useState('');
  const [alert, setAlert] = useState(false);

  const handleNext = () => {
    if (!deviceId.trim()) return;
    if (deviceId == '123456') {
      navigation.navigate('UserDashboard', { deviceId });
    } else {
      Alert.alert('Device ID not found', 'Please enter a valid Device ID', [{ text
      : 'OK' }]);
    }
  };

  useEffect(() => {
    // check first if the user is type of user or neighbor
    if (user) {
      if (user.type === 'user') {
        navigation.navigate('UserDashboard', { deviceId: undefined });
      } else if (user.type === 'neighbor') {
        navigation.navigate('NeighborhoodDashboard', { stationId: 'sti-cubao' });
      }
    }
  }, []);

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

