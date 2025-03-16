import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../assets/svgs/logo.svg'
import LogoLight from '../../assets/svgs/logo-light.svg'

// Type Props
type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <LinearGradient
      // colors={['#FFD9DA', "#FF7E5F"]}
      colors={['#FB4F4F', "#FB4F4F"]}
      style={styles.gradientContainer}
    >
      <View style={styles.contentContainer}>
        <LogoLight width={100} height={100} style={{ marginBottom: 16 }} />
        <Text style={styles.title}>ALERTECH</Text>
        <Text style={styles.subtitle}>TECHNOQUATRO</Text>
        <Text style={styles.description}>
          Your app to stay safe and informed about fires and gas leaks.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ChooseType')}
          style={styles.button}
        >
          Get Started
        </Button>
      </View>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    // color: '#FF7E5F',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    // color: '#000',
    color: '#fff',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    // color: '#333',
    color: '#fff',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF7E5F',
  },
});
