// src/screens/NeighborhoodDashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { logout, setNeighborUser } from '../redux/userSlice';
import LeafletMap from '../components/Leaflet';
import Sound from 'react-native-sound';

type Props = NativeStackScreenProps<RootStackParamList, 'NeighborhoodDashboard'>;

export default function NeighborhoodDashboardScreen({ route, navigation }: Props) {
  const { stationId } = route.params || {};
  const dispatch = useDispatch();

  // State for neighbor data, map region, and alarm modal
  const [neighborData, setNeighborData] = useState<any>(null);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [alarmSound, setAlarmSound] = useState<Sound | null>(null);

  useEffect(() => {
    // Subscribe to FCM topic 'all'
    messaging().subscribeToTopic('all').then(() => {
      console.log('Subscribed to topic: all');
    });

    // Listen for foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received FCM message:', remoteMessage);
      if (remoteMessage.data && remoteMessage.data.type === 'alarm') {
        // Show modal alert instead of navigating
        setAlarmModalVisible(true);
        // Play alarm sound
        const sound = new Sound('alarm_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          sound.setNumberOfLoops(-1); // Loop the sound indefinitely
          sound.play();
        });
        setAlarmSound(sound);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Fetch neighbor data from Firestore
    const fetchNeighborData = async () => {
      try {
        // Hard-coded doc ID as an example; replace as needed.
        const docRef = firestore().collection('neighbor').doc('aU5y8q9dPbuIbLh8XMAw');
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const rawData = docSnap.data();
          if (rawData) {
            const data = {
              id: docSnap.id,
              username: rawData.username,
              address: rawData.address,
              contact: rawData.contact,
              description: rawData.description,
              fireStationUUID: rawData.fireStationUUID,
              type: 'neighbor' as const,
            };
            setNeighborData(data);
            dispatch(setNeighborUser(data));
          } else {
            console.log('No data found in document!');
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching neighbor data:', error);
      }
    };

    fetchNeighborData();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await messaging().unsubscribeFromTopic('all');
      console.log('Unsubscribed from topic: all');
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
    }
    dispatch(logout());
    navigation.navigate('Welcome');
  };

  // Dismiss modal: stop sound and hide modal
  const dismissAlarmModal = () => {
    setAlarmModalVisible(false);
    if (alarmSound) {
      alarmSound.stop(() => {
        alarmSound.release();
        setAlarmSound(null);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top 70%: Leaflet Map in WebView */}
      <View style={styles.mapContainer}>
        <LeafletMap />
      </View>

      {/* Bottom 30%: Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Neighborhood Dashboard</Text>
        <Text style={styles.info}>
          Monitoring alerts from {stationId || 'unknown station'}...
        </Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      {/* Alarm Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={alarmModalVisible}
        onRequestClose={dismissAlarmModal}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Fire Detected</Text>
            <Text style={modalStyles.modalText}>Fire Detected! at David St. 123</Text>
            {/* Add a link button to google maps */}
            <Text style={modalStyles.modalText}>Call David House 09944345742 (user affected)</Text>
            <Text style={modalStyles.modalText}>Call STI Cubao Fire Station (fire station)</Text>
            <Button title="Dismiss Alarm" onPress={dismissAlarmModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 0.7,
  },
  infoContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',  // semi-transparent background
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
});
