package com.arduinoph

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d("MyFirebaseMessagingService", "Message received: $remoteMessage")
        // Check if the message contains a data payload.
        remoteMessage.data?.let {
            // You can use the data payload to determine if it is an alarm message.
            if (it["type"] == "alarm") {
                // Trigger the custom notification even if the app is not running.
                CustomNotificationManager.showCustomNotification(this)
            }
        }
    }

    override fun onNewToken(token: String) {
        Log.d("MyFirebaseMessagingService", "New token: $token")
        // Send the token to your server if needed.
    }
}
