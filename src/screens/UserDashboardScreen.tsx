// UserDashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Alert,
  Vibration,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import { setupNotificationChannel } from '../utils/notificationSetup';
import { 
  Card, 
  Title, 
  Paragraph, 
  Text, 
  ProgressBar, 
  List 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { setRegularUser } from '../redux/userSlice';  // <-- We'll use this
import type { RegularUser } from '../redux/userTypes';

// Define the props type for navigation. Ensure 'UserDashboard' is defined in RootStackParamList.
type Props = NativeStackScreenProps<RootStackParamList, 'UserDashboard'>;

// Alarm sound and vibration
const showAlarmUI = async (message: FirebaseMessagingTypes.RemoteMessage) => {
  Vibration.vibrate([500, 1000, 500, 1000], true); // Vibrate pattern
  Alert.alert(
    '🚨 Fire Alert!',
    message.notification?.body ?? 'No message body',
    [
      {
        text: 'Dismiss Alarm',
        onPress: () => {
          Vibration.cancel();
        },
        style: 'cancel'
      }
    ],
    { cancelable: false }
  );
};

export default function UserDashboard({ navigation }: Props) {
  const dispatch = useDispatch();

  // Local states (if you want to display them immediately in the UI)
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [gasLeak, setGasLeak] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  // Optional: store your FCM token
  const [token, setToken] = useState<string | null>(null);

  // 1. Request notification permissions & subscribe to "all" topic
  useEffect(() => {
    (async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Notification permission granted:', authStatus);
      }

      const fetchedToken = await messaging().getToken();
      setToken(fetchedToken);
      console.log('FCM Token:', fetchedToken);
    })();

    // Subscribe to topic 'all' for FCM
    messaging().subscribeToTopic('alertech-arduino-day-demo').then(() => {
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
  }, []);


  // 2. Handle incoming messages in the foreground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification:', remoteMessage);

      if (remoteMessage?.data?.type === 'alarm') {
        showAlarmUI(remoteMessage);
      } else {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title ?? 'No Title',
          body: remoteMessage.notification?.body ?? 'No Body',
          android: {
            channelId: 'alarm_channel',
            sound: 'alarm_sound',
            importance: AndroidImportance.HIGH,
          },
        });
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // 3. Listen to Firestore document in real time
  useEffect(() => {
    // Replace with your actual doc ID or pass via route params
    const docRef = firestore().collection('user').doc('alertech-arduino-day-demo');

    // onSnapshot for real-time updates
    const unsubscribe = docRef.onSnapshot(
      (docSnap) => {
        if (docSnap.exists) {
          const raw = docSnap.data();

          // Build a RegularUser object
          if (raw) {
            const userData: RegularUser = {
              id: docSnap.id,
              username: raw.username ?? '',
              address: raw.address,
              contactNumber: raw.contactNumber,
              fireStationUUID: raw.fireStationUUID,
              gasLeak: raw.gasLeak,
              humidity: raw.humidity,
              status: raw.status,
              temperature: raw.temperature,
              validation: raw.validation,
              type: 'user',
            };

            // Dispatch to Redux
            dispatch(setRegularUser(userData));

            // Update local state for immediate UI
            setTemperature(raw.temperature ?? 0);
            setHumidity(raw.humidity ?? 0);
            setGasLeak(raw.gasLeak ?? false);
            setStatus(raw.status ?? '');
          } else {
            console.log('No such document!');
          }

        } else {
          console.log('No such document!');
        }
      },
      (error) => {
        console.error('Error with onSnapshot:', error);
      }
    );

    // Cleanup
    return () => unsubscribe();
  }, [dispatch]);

  // Dynamic messages based on sensor values
  const temperatureMessage =
    temperature > 27
      ? 'Temperature is high! Consider turning on air conditioning.'
      : temperature < 25
      ? 'Temperature is getting cooler.'
      : 'Temperature is comfortable.';

  const humidityMessage =
    humidity > 60
      ? 'Humidity is high. Consider using a dehumidifier.'
      : humidity < 30
      ? 'Humidity is low. Consider using a humidifier.'
      : 'Humidity level is optimal.';

  const gasLeakMessage = gasLeak
    ? 'Gas leak detected! Turn off the gas valve and ventilate immediately.'
    : 'No gas leak detected. Environment is safe.';

  // (Optional) Toggling gas leak for demo only
  const toggleGasLeak = () => {
    setGasLeak(!gasLeak);
  };

  // Additional suggestions
  const suggestions = [
    'Check ventilation regularly.',
    'Keep a fire extinguisher handy.',
    'Install a smoke alarm and test it monthly.',
    'Have an evacuation plan ready.',
    'Store flammable materials safely.'
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
      {/* Header with Linear Gradient */}
      <LinearGradient
        colors={['#D32F2F', '#FF5722']}
        style={styles.headerGradient}>
        <Card.Content style={styles.headerContainer}>
          <Title style={styles.headerTitle}>Smart Fire & Gas Leak Alert System</Title>
          <Text style={styles.headerSubtitle}>Arduino PH</Text>
          {/* <Text style={{ color: '#FFEB3B' }}>{token}</Text> */}
        </Card.Content>
      </LinearGradient>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Card: Temperature & Humidity */}
        <Card style={styles.card}>
          <Card.Title 
            title="Current Readings" 
            right={() => <View style={styles.updateIndicator} />} 
          />
          <Card.Content>
            <View style={styles.readingsRow}>
              <View style={styles.readingItem}>
                <Text style={styles.readingLabel}>Temperature</Text>
                <Text 
                style={[
                  styles.readingValue,
                  { color: temperature > 27 ? '#FF5722' : '#1976D2' }
                ]}>
                {temperature?.toFixed(1)}°C
                </Text>
                <ProgressBar 
                  progress={Math.min(1, (temperature - 20) * 0.05)} 
                  color={temperature > 27 ? '#F44336' : '#2196F3'}
                  style={styles.indicatorBar}
                />
              </View>
              <View style={styles.readingItem}>
                <Text style={styles.readingLabel}>Humidity</Text>
                <Text style={[styles.readingValue, { color: '#009688' }]}>
                  {humidity}%
                </Text>
                <ProgressBar 
                  progress={Math.min(1, humidity / 100)} 
                  color="#009688"
                  style={styles.indicatorBar}
                />
              </View>
            </View>

            <View style={styles.messagesContainer}>
              <Paragraph style={styles.dynamicMessage}>{temperatureMessage}</Paragraph>
              <Paragraph style={styles.dynamicMessage}>{humidityMessage}</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Card: Gas Leak */}
        <TouchableOpacity onPress={toggleGasLeak} activeOpacity={0.9}>
          <Card style={[styles.card, gasLeak ? styles.alertCard : {}]}>
            <Card.Title 
              title="Gas Leak Status" 
              right={() => gasLeak && <View style={styles.pulsatingDot} />} 
            />
            <Card.Content>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: gasLeak ? '#FF1744' : '#00C853' }
                ]} />
                <Text 
                  style={[
                    styles.gasLeakStatus,
                    { color: gasLeak ? '#FF1744' : '#00C853' }
                  ]}>
                  {gasLeak ? 'ALERT: GAS LEAK DETECTED!' : 'Normal - No Leaks Detected'}
                </Text>
              </View>
              <Paragraph style={styles.dynamicMessage}>{gasLeakMessage}</Paragraph>
              <Text style={styles.tapHint}>(Tap to toggle status for demo)</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        {/* Card: Safety Recommendations */}
        <Card style={styles.card}>
          <Card.Title title="Safety Recommendations" />
          <Card.Content>
            {suggestions.map((suggestion, index) => (
              <List.Item
                key={index}
                title={suggestion}
                left={() => <List.Icon icon="checkbox-blank-circle" color="#FF5722" />}
                titleStyle={styles.suggestionItem}
              />
            ))}
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Last Updated: Just Now</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  alertCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF1744',
    backgroundColor: '#FFF8F8',
  },
  updateIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 16,
    alignSelf: 'center',
  },
  readingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  readingItem: {
    width: '45%',
  },
  readingLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 6,
  },
  readingValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  indicatorBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  messagesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  dynamicMessage: {
    fontSize: 14,
    marginTop: 6,
    color: '#616161',
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  gasLeakStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tapHint: {
    fontSize: 12,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginTop: 8,
    alignSelf: 'center',
  },
  suggestionItem: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  pulsatingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF1744',
  },
});
