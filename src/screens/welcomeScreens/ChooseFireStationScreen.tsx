// src/screens/ChooseFireStationScreen.tsx
import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker'; // npm install @react-native-picker/picker
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseFireStation'>;

export default function ChooseFireStationScreen({navigation}: Props) {
  const [selectedStation, setSelectedStation] = useState('station1');

  const handleNext = () => {
    navigation.navigate('NeighborhoodDashboard', {stationId: selectedStation});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Fire Station</Text>
      <Picker
        selectedValue={selectedStation}
        onValueChange={itemValue => setSelectedStation(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Station #1" value="station1" />
        {/* Add more stations if needed */}
      </Picker>

      <Button title="Next" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 16},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {marginBottom: 16},
});
