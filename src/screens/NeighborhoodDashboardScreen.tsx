// NeighborhoodDashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout, setNeighborUser } from '../redux/userSlice';  // <--- Import setNeighborData

type Props = NativeStackScreenProps<RootStackParamList, 'NeighborhoodDashboard'>;

export default function NeighborhoodDashboardScreen({ route, navigation }: Props) {
  const { stationId } = route.params || {};
  const dispatch = useDispatch();

  useEffect(() => {
    // Subscribe to topic 'all' for FCM
    messaging().subscribeToTopic('all').then(() => {
      console.log('Subscribed to topic: all');
    });

    // Listen for foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received FCM message:', remoteMessage);
      if (remoteMessage.data && remoteMessage.data.type === 'alarm') {
        navigation.navigate('Alarm');
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Fetch neighbor data from Firestore
    const fetchNeighborData = async () => {
      try {
        // Hard-coded doc ID as an example
        // Replace with your actual doc ID or pass via route params
        const docRef = firestore()
          .collection('neighbor')
          .doc('aU5y8q9dPbuIbLh8XMAw');
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
              name: rawData.username,
              type: "neighbor" as "neighbor",
            };
            dispatch(setNeighborUser(data));
          } else {
            console.log('No data found in document!');
          }
          console.log('Neighbor data fetched:', rawData);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neighborhood Dashboard</Text>
      <Text style={styles.info}>
        Monitoring alerts from {stationId || 'unknown station'}...
      </Text>
      <Text style={styles.info}>
        Neighbor data: {JSON.stringify(route.params)}
      </Text>
      <Button 
        title="Logout" 
        onPress={handleLogout} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  info: { fontSize: 16, textAlign: 'center' },
});
