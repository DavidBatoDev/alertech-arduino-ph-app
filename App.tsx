import React, { useState, useEffect, JSX } from 'react';
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
import { setupNotificationChannel } from './src/utils/notificationSetup';
import { 
  Provider as PaperProvider, 
  Card, 
  Title, 
  Paragraph, 
  Text, 
  ProgressBar, 
  List 
} from 'react-native-paper';

// Alarm sound and vibration
const showAlarmUI = async (message: FirebaseMessagingTypes.RemoteMessage) => {
  Vibration.vibrate([500, 1000, 500, 1000], true); // Vibrate pattern
  Alert.alert(
    "🚨 Fire Alert!",
    message.notification?.body ?? 'No message body',
    [
      {
        text: "Dismiss Alarm",
        onPress: () => {
          Vibration.cancel();
        },
        style: "cancel"
      }
    ],
    { cancelable: false }
  );
};

  // // Handle foreground and background messages
  // useEffect(() => {
  //   requestUserPermission();
  //   getToken();

  //   // Foreground message handler
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('Foreground message:', remoteMessage);
  //     Alert.alert('New Message', JSON.stringify(remoteMessage));
  //   });

  //   // Background message handler (when app is killed)
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Background message:', remoteMessage);
  //   });

  //   // Clean up
  //   return unsubscribe;
  // }, []);


export default function App(): JSX.Element {
  const [token, setToken] = useState<string | null>(null);

  // Handle permissions and get token
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      setToken(token);
      console.log('FCM Token:', token);
    } catch (error) {
      console.log('Error getting token:', error);
    }
  };

  useEffect(() => {
    messaging()
      .subscribeToTopic('all')
      .then(() => console.log('Subscribed to topic "all"'));
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification:', remoteMessage);
      
      /////////////////////////// Show a regular notification /////////////////////////// 
      // if (remoteMessage?.data?.type === 'alarm') {
      //   // Trigger an alarm UI
      //   showAlarmUI(remoteMessage);
      // } else {
      //   // Show a regular notification
      //   await notifee.displayNotification({
      //     title: remoteMessage.notification?.title ?? 'No Title',
      //     body: remoteMessage.notification?.body ?? 'No Body',
      //     android: {
      //       channelId: 'alarm_channel',
      //       sound: 'alarm_sound',
      //       importance: AndroidImportance.HIGH,
      //     },
      //   });
      // }

      await getToken();

      ///////////////////////////  Show full-screen notification /////////////////////////// 
      if (remoteMessage?.data?.type === 'alarm') {
        // When the app is open, show the custom alarm UI
        showAlarmUI(remoteMessage);
      } else {
        // For other types of messages, show a regular notification
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

    setupNotificationChannel();
  
    return unsubscribe;
  }, []);

  // State for sensor data
  const [temperature, setTemperature] = useState(11.8);
  const [humidity, setHumidity] = useState(63);
  const [gasLeak, setGasLeak] = useState(false);
  
  // Animated value for temperature
  const animatedTemp = new Animated.Value(0);
  const tempOpacity = new Animated.Value(1);
  
  // Function to generate random temperature changes
  const updateTemperature = () => {
    // Random value between -1.0 and 1.0
    const randomChange = (Math.random() * 2 - 1).toFixed(1);
    const newTemp = parseFloat((temperature + parseFloat(randomChange)).toFixed(1));
    
    // Keep temperature in a reasonable range (75-87)
    const boundedTemp = Math.min(Math.max(newTemp, 75), 87);
    
    // Animate temperature change
    tempOpacity.setValue(0.3);
    Animated.timing(tempOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    setTemperature(boundedTemp);
  };
  
  // Update temperature every 3 seconds
  useEffect(() => {
    const interval = setInterval(updateTemperature, 3000);
    return () => clearInterval(interval);
  }, [temperature]);
  
  // Generate dynamic messages based on sensor values
  const temperatureMessage =
    temperature > 80
      ? 'Temperature is high! Consider turning on air conditioning.'
      : temperature < 77
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

  // Additional suggestions
  const suggestions = [
    'Check ventilation regularly.',
    'Keep a fire extinguisher handy.',
    'Install a smoke alarm and test it monthly.',
    'Have an evacuation plan ready.',
    'Store flammable materials safely.'
  ];
  
  // Function to toggle gas leak status (for demo purposes)
  const toggleGasLeak = () => {
    setGasLeak(!gasLeak);
  };

  return (
    <PaperProvider>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
      {/* Header with Linear Gradient */}
      <LinearGradient
        colors={['#D32F2F', '#FF5722']}
        style={styles.headerGradient}>
        <Card.Content style={styles.headerContainer}>
          <Title style={styles.headerTitle}>Smart Fire & Gas Leak Alert System</Title>
          <Text style={styles.headerSubtitle}>Arduino PH</Text>
          <Text style={{ color: '#FFEB3B' }}>{token}</Text>
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
                <Animated.Text 
                  style={[
                    styles.readingValue, 
                    { 
                      opacity: tempOpacity,
                      color: temperature > 80 ? '#FF5722' : '#1976D2'
                    }
                  ]}>
                  {temperature.toFixed(1)}°F
                </Animated.Text>
                {/* Using ProgressBar for indicator */}
                <ProgressBar 
                  progress={Math.min(1, (temperature - 60) * 0.025)} 
                  color={temperature > 80 ? '#F44336' : '#2196F3'}
                  style={styles.indicatorBar}
                />
              </View>
              <View style={styles.readingItem}>
                <Text style={styles.readingLabel}>Humidity</Text>
                <Text style={[styles.readingValue, { color: '#009688' }]}>{humidity}%</Text>
                <ProgressBar 
                  progress={Math.min(1, humidity / 100)} 
                  color="#009688"
                  style={styles.indicatorBar}
                />
              </View>
            </View>

            {/* Dynamic messages based on sensor values */}
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
    </PaperProvider>
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
