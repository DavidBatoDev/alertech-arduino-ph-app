const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Send a data-only notification to the "all" topic
const message = {
  topic: 'all',
  data: {
    type: 'alarm',         // Your service will check for this value.
    title: 'Fire Detecteddasdasdsad',
    body: 'Fire Detected in PUP Sta. Mesa Room 101'
    // Optionally, add more custom fields as needed.
  },
  android: {
    priority: 'high'
  }
};

admin.messaging().send(message)
  .then(response => console.log('Notification sent successfully:', response))
  .catch(err => console.error('Error sending notification:', err));
