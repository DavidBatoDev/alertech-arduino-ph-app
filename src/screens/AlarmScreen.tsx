// src/screens/AlarmScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Vibration, BackHandler } from 'react-native';
import Sound from 'react-native-sound';
import { useNavigation } from '@react-navigation/native';

export default function AlarmScreen() {
  const navigation = useNavigation();
  let alarmSound: Sound | null = null;

  useEffect(() => {
    // Disable the back button on Android so the user can't dismiss the alarm inadvertently
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Start vibration pattern: vibrate for 500ms, pause for 1000ms, repeat.
    Vibration.vibrate([500, 1000, 500], true);

    // Set the audio category (iOS specific) and load the sound file
    Sound.setCategory('Playback');
    alarmSound = new Sound('alarm_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // Loop the alarm sound indefinitely
      alarmSound?.setNumberOfLoops(-1);
      alarmSound?.play();
    });

    // Cleanup when the component unmounts
    return () => {
      backHandler.remove();
      Vibration.cancel();
      if (alarmSound) {
        alarmSound.stop(() => alarmSound?.release());
      }
    };
  }, []);

  const dismissAlarm = () => {
    // Stop the alarm sound and vibration then navigate back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.alarmText}>ALARM!</Text>
      <Button title="Dismiss" onPress={dismissAlarm} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alarmText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
});
