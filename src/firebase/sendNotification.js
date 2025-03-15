const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const FCM_TOKEN = "cKzXDOmJSd-xbeb_3GZkbQ:APA91bFrxZWjwD0uahsmjpg9jDJKUgQxCVzevuzSRMQM6j9tlMQ2Wzev325J_E_rXHMOY5pVJJt9AS8lKzP4ThETl03FWhWZz8AjRmYnUJxi4WlfUSpB5aA"

const message = {
  token: FCM_TOKEN,
  notification: {
    title: 'Test Alarm',
    body: 'This is a test alarm via FCM v1'
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
