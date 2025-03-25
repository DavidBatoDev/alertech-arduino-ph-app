// src/screens/ChooseTypeScreen.tsx

import React, {useEffect} from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useSelector } from 'react-redux';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseType'>;

export default function ChooseTypeScreen({ navigation }: Props) {
  const { user } = useSelector((state: { user: { user: any } }) => state.user);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Choose Type</Text>
      
      {/* Bullet list description */}
      <View style={styles.bulletContainer}>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletPoint}>{'\u2022'}</Text>
          <Text style={styles.bulletText}>I have the device - For those user who have the alertech device installed on their homes</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletPoint}>{'\u2022'}</Text>
          <Text style={styles.bulletText}>I don't have the device - For those user who does't have the alertech device but want's to be alerted in their neighborhood</Text>
        </View>
      </View>

      {/* Card 1 */}
      <Card onPress={() => navigation.navigate('DeviceId')} style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={require('../../assets/images/device.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>I have the alert system device</Text>
            <Text style={styles.cardSubtitle}>Tap to proceed</Text>
          </View>
        </View>
      </Card>

      {/* Card 2 */}
      <Card onPress={() => navigation.navigate('ChooseFireStation')} style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={require('../../assets/images/marker.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>
              I don't have an alert system but I want to be alerted
            </Text>
            <Text style={styles.cardSubtitle}>Tap to proceed</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const CARD_HEIGHT = 90;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 80,
    backgroundColor: '#FB4F4F',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    // color: '#333',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'justify',
  },
  bulletContainer: {
    alignSelf: 'stretch',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: 8,
    // color: '#333',
    color: '#fff',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    // color: '#666',
    color: '#fff',
    lineHeight: 22,
  },
  card: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3, // Android shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // backgroundColor: '#fff',
    // backgroundColor: '#FF7E5F'
    backgroundColor: '#FF8A80'
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CARD_HEIGHT,
    paddingHorizontal: 16,
  },
  cardImage: {
    width: CARD_HEIGHT * 0.8,
    height: CARD_HEIGHT * 0.8,
    resizeMode: 'contain',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    // color: '#333',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 14,
    // color: '#888',
    color: '#fff',
    marginTop: 4,
  },
});
