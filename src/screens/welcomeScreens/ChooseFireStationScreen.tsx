// // src/screens/ChooseFireStationScreen.tsx
// import React, { useState } from 'react';
// import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import { Text } from 'react-native-paper';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/AppNavigator';

// type Props = NativeStackScreenProps<RootStackParamList, 'ChooseFireStation'>;

// export default function ChooseFireStationScreen({ navigation }: Props) {
//   const [selectedStation, setSelectedStation] = useState<string | null>(null);

//   const handleNext = (stationId: string) => {
//     setSelectedStation(stationId);
//     navigation.navigate('NeighborhoodDashboard', { stationId });
//   };

//   const fireStations = [
//     { id: 'station1', name: 'Pureza FireStation', image: require('../../assets/images/firestation.png') },
//     { id: 'station2', name: 'STI Cubao', image: require('../../assets/images/sti_logo.png') },
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Choose Fire Station</Text>
//       <Text style={styles.description}>
//         • Select a fire station to proceed. {'\n'}
//         • You can change this later in the settings.
//       </Text>

//       {fireStations.map((station) => (
//         <TouchableOpacity
//           key={station.id}
//           style={[
//             styles.card,
//             selectedStation === station.id && styles.selectedCard,
//           ]}
//           onPress={() => handleNext(station.id)}
//         >
//           <Image source={station.image} style={styles.stationImage} />
//           <View style={styles.textContainer}>
//             <Text style={styles.stationName}>{station.name}</Text>
//             <Text style={styles.tapToProceed}>Tap to proceed</Text>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F44336',
//     padding: 16,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   description: {
//     fontSize: 14,
//     color: 'white',
//     marginBottom: 24,
//     textAlign: 'left',
//   },
//   card: {
//     backgroundColor: '#FF8A80',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 4,
//   },
//   selectedCard: {
//     backgroundColor: '#FF5252',
//   },
//   stationImage: {
//     width: 50,
//     height: 50,
//     marginRight: 16,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   stationName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   tapToProceed: {
//     fontSize: 14,
//     color: 'white',
//   },
// });


/////////////////////////// Version 2 CODE ///////////////////////////
// src/screens/ChooseFireStationScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseFireStation'>;

export default function ChooseFireStationScreen({ navigation }: Props) {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const handleNext = (stationId: string) => {
    setSelectedStation(stationId);
    navigation.navigate('NeighborhoodDashboard', { stationId });
  };

  const fireStations = [
    { id: 'station1', name: 'STI Cubao (Arduino PH)', image: require('../../assets/images/sti_logo.png') },
    { id: 'station2', name: 'Pureza FireStation', image: require('../../assets/images/firestation.png') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Fire Station</Text>
      {/* Bullet list description */}
      <View style={styles.bulletContainer}>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletPoint}>{'\u2022'}</Text>
          <Text style={styles.bulletText}>Choose the nearest firestation you want to be alerted to</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletPoint}>{'\u2022'}</Text>
          <Text style={styles.bulletText}>You can later change this in the settings</Text>
        </View>
      </View>

      {fireStations.map((station) => (
        <TouchableOpacity
          key={station.id}
          style={[
            styles.card,
            selectedStation === station.id && styles.selectedCard,
          ]}
          onPress={() => handleNext(station.id)}
        >
          <Image source={station.image} style={styles.stationImage} />
          <View style={styles.textContainer}>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.tapToProceed}>Tap to proceed</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FB4F4F',
    padding: 16,
    justifyContent: 'flex-start',
    paddingTop: 80,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 24,
    textAlign: 'left',
  },
  bulletContainer: {
    alignSelf: 'stretch',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 20,
    lineHeight: 22,
    marginRight: 8,
    // color: '#333',
    color: '#fff',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    // color: '#666',
    color: '#fff',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  selectedCard: {
    backgroundColor: '#FF5252',
  },
  stationImage: {
    width: 50,
    height: 50,
    marginRight: 16,
    objectFit: 'cover',
  },
  textContainer: {
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  tapToProceed: {
    fontSize: 14,
    color: 'white',
  },
});

