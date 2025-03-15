import React, { useState, useEffect, JSX } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Vibration 
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidCategory } from '@notifee/react-native';
import { setupNotificationChannel } from './src/utils/notificationSetup';

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
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
      <LinearGradient
        colors={['#D32F2F', '#FF5722']}
        style={styles.headerGradient}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Smart Fire & Gas Leak Alert System</Text>
          <Text style={styles.headerSubtitle}>Arduino PH</Text>
          <Text style={{color: '#FFEB3B'}}> {token}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Card: Temperature & Humidity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current Readings</Text>
            <View style={styles.updateIndicator} />
          </View>
          
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
              <View style={[styles.indicatorBar, {backgroundColor: temperature > 80 ? '#FFCDD2' : '#BBDEFB'}]}>
                <View 
                  style={[
                    styles.indicatorFill, 
                    {
                      width: `${Math.min(100, (temperature - 60) * 2.5)}%`,
                      backgroundColor: temperature > 80 ? '#F44336' : '#2196F3'
                    }
                  ]} 
                />
              </View>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Humidity</Text>
              <Text style={[styles.readingValue, {color: '#009688'}]}>{humidity}%</Text>
              <View style={[styles.indicatorBar, {backgroundColor: '#B2DFDB'}]}>
                <View 
                  style={[
                    styles.indicatorFill, 
                    {
                      width: `${humidity}%`,
                      backgroundColor: '#009688'
                    }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Dynamic messages based on sensor values */}
          <View style={styles.messagesContainer}>
            <Text style={styles.dynamicMessage}>{temperatureMessage}</Text>
            <Text style={styles.dynamicMessage}>{humidityMessage}</Text>
          </View>
        </View>

        {/* Card: Gas Leak */}
        <TouchableOpacity 
          style={[
            styles.card, 
            gasLeak ? styles.alertCard : {}
          ]}
          onPress={toggleGasLeak}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Gas Leak Status</Text>
            {gasLeak && <View style={styles.pulsatingDot} />}
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusIndicator, 
              {backgroundColor: gasLeak ? '#FF1744' : '#00C853'}
            ]} />
            <Text
              style={[
                styles.gasLeakStatus,
                {color: gasLeak ? '#FF1744' : '#00C853'},
              ]}>
              {gasLeak ? 'ALERT: GAS LEAK DETECTED!' : 'Normal - No Leaks Detected'}
            </Text>
          </View>
          <Text style={styles.dynamicMessage}>{gasLeakMessage}</Text>
          <Text style={styles.tapHint}>(Tap to toggle status for demo)</Text>
        </TouchableOpacity>

        {/* Card: Recommendations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Safety Recommendations</Text>
          </View>
          {suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionContainer}>
              <View style={styles.bulletPoint} />
              <Text style={styles.suggestionItem}>{suggestion}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Last Updated: Just Now</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    // Shadow for Android
    elevation: 4,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF1744',
    backgroundColor: '#FFF8F8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#424242',
    fontWeight: 'bold',
  },
  updateIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  pulsatingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF1744',
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
    width: '100%',
  },
  indicatorFill: {
    height: '100%',
    borderRadius: 3,
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
  suggestionContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'center',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5722',
    marginRight: 8,
    marginTop: 2,
  },
  suggestionItem: {
    fontSize: 14,
    color: '#616161',
    flex: 1,
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
});