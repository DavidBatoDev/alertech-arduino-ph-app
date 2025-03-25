# Alertech App

## Overview

## Related Repositories
- 🔥 [Alertech FCM API](https://github.com/DavidBatoDev/alertech-fcm-api) — The API for the FCM to send Notifications to all mobile app for users and neighbors to monitor alerts in real-time.
- 🌐 [Alertech Fire Station Dashboard](https://github.com/geraldsberongoy/Arduino-Hackathon-Web) — The web dashboard for fire stations to monitor and respond to emergencies.
- ⚙️ [Alertech IoT Device Code](https://github.com/DavidBatoDev/alertech-iot-device) — The ESP32 code for reading sensor data and sending alerts via Firebase.

Alertech is an integrated fire detection and alert system composed of a mobile app, a website, and an IoT device. It enables real-time monitoring of temperature, humidity, and smoke levels, and provides instant alerts to users and fire authorities in case of a fire.

---

## Research Motivation

### Smart Fire & Gas Leak Alert System (Using ESP32 & Firebase)

This project focuses on real-time fire and gas leak detection using ESP32 and Firebase. By integrating IoT sensors, a mobile app, and a web dashboard, we ensure instant alerts to users and fire stations, even triggering an automated call if necessary.

#### Empowering Women with Technology

- **Protecting Mothers & Families**: Many mothers worry about home safety while taking care of their children. This system allows them to focus on what matters, knowing they’ll be alerted if danger arises.
- **Helping Independent Women**: For women living alone, home safety is a real concern. This system ensures they have a reliable, automated backup in case of fire or gas leaks.
- **Supporting Women with Disabilities & Elderly Women**: Those who may struggle to react quickly in an emergency will benefit from automated alerts and fire station intervention.

#### Bayanihan (Neighbor Alert System)

- **Community Support**: Neighbors are alerted when a nearby device detects a fire or gas leak, encouraging immediate local assistance before emergency services arrive.
- **Shared Safety Network**: Users without personal IoT devices can still benefit from the system by receiving alerts when their neighbors’ devices detect danger.
- **Strengthening Community Bonds**: Promotes a culture of communal responsibility, where everyone contributes to neighborhood safety.

#### More Than Just Technology—It’s About Trust & Security

This project isn’t just about IoT, sensors, and alerts. It’s about creating a future where women feel safer, knowing their homes are monitored and protected. It’s about giving them confidence and control over their surroundings, reducing anxiety, and ensuring help is always available when needed.

---

## System Overview

### Mobile App (For Users and Neighbors)

- Monitor home environment (temperature, humidity, smoke) in real time.
- Receive alerts when a fire is detected nearby.
- Users without the IoT device can still receive alerts if a neighbor's device detects a fire.

### Website (For Fire Authority)

- Displays geolocation of all users with devices.
- Provides access to a user database containing contact information and addresses.
- Allows monitoring of temperature, smoke, and humidity levels in real time.
- Monitor and respond to fire alerts.

### IoT Device

- Built with ESP32, DHT22 (for temperature and humidity), and MQ-2 (for smoke detection).
- Detects temperature, humidity, and smoke levels.
- Sends alerts to both the user and fire station via Firebase Cloud Messaging (FCM).
- Updates real-time data to Firebase, accessible through mobile and web apps.

---

## How It Works

### ESP32 Monitors the Environment

- Reads smoke levels and temperature.
- Sends data to Firebase in real-time.

### Instant Notifications to Users, Neighbors, & Fire Stations

- Mobile app receives alerts via Firebase Cloud Messaging (FCM).
- Neighbors receive alerts if a nearby device detects danger.
- Web dashboard updates instantly.

---

## IoT Device Code (MVP)

The IoT device code for the ESP32 integrates multiple components to enable real-time data transmission and alerting through Firebase:

1. **Wi-Fi Setup:** Configures the ESP32 to connect to a Wi-Fi network using provided credentials.
2. **Firebase Integration:** Authenticates the device and connects to Firestore for real-time data storage.
3. **Sensor Data Collection:** Uses the DHT22 sensor to measure temperature and humidity, and the MQ-2 sensor to detect smoke levels.
4. **Data Transmission:** Sends collected data to Firebase, making it accessible through mobile and web apps.
5. **Alert System:** Triggers Firebase Cloud Messaging (FCM) alerts to notify users, neighbors, and fire authorities via mobile and web apps when smoke levels exceed a predefined threshold.

These components work seamlessly to ensure continuous environmental monitoring and instant fire detection alerts.

---

## Technology Stack

- **Mobile App:** React Native CLI with Firebase integration.
- **Web App:** React with Firebase for real-time monitoring.
- **IoT Device:** ESP32 with DHT22 and MQ-2 sensors, integrated with Firebase.
- **Cloud:** Firebase for authentication, database, and notifications.

---

## Usage

1. Power on the IoT device.
2. Launch the mobile app to monitor your home or receive alerts.
3. Fire authorities can use the web app to track alerts and monitor user data.

For any issues or suggestions, please open an issue in the repository.


## Program Flow (Mobile App)

<div align="center">

| Welcome Screen | Choose Type: Neighbor or User |
|----------------|------------------------------|
| ![Welcome Screen](https://github.com/user-attachments/assets/aed02182-05f4-4c67-baf1-be0dbfd6944e) | ![Choose Type](https://github.com/user-attachments/assets/00cc7e7a-e4ab-4b33-9120-5736b5f7b12b) |

| Enter Registered Device | User Dashboard: Monitor Sensors |
|-------------------------|--------------------------------|
| ![Enter Registered Device](https://github.com/user-attachments/assets/b7df1f32-e225-4a65-80eb-31102743fb56) | ![User Dashboard](https://github.com/user-attachments/assets/7f3bca66-6002-42b5-b823-283d2fe4c35f) |

| Choose Fire Station If Neighbor | Neighbor Dashboard |
|--------------------------------|--------------------|
| ![Choose Fire Station](https://github.com/user-attachments/assets/44f0a0fa-2258-45d3-9e42-1e2e3d7caaac) | ![image](https://github.com/user-attachments/assets/cd0a8113-1529-4788-a122-b07de1992601) |

| Alarm Triggered (Foreground) | Alarm Triggered (Background) |
|--------------------------------|--------------------|
| ![image](https://github.com/user-attachments/assets/52d1a36f-0ab9-41e0-a0f8-664f8eaa4d31) | ![image](https://github.com/user-attachments/assets/2a0bc023-22b0-465a-8545-c0792e7600f2) |

</div>


Stay safe with **Alertech**! 🚨
