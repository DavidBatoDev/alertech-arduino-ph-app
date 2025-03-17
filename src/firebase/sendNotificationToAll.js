// send notification to all devices subscribed to the "all" topic using FCM v1
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Send notification to the "all" topic
const message = {
  topic: 'all', // This targets all devices subscribed to "all"
  notification: {
    title: 'Fire Detected',
    body: 'Fire Detected in PUP Sta. Mesa Room 101'
  },
  data: {
    type: 'alarm'
  },
  android: {
    notification: {
      channel_id: 'alarm_channel',
      sound: 'alarm_sound'
    }
  }
};

admin.messaging().send(message)
  .then(response => console.log('Notification sent successfully:', response))
  .catch(err => console.error('Error sending notification:', err));
