package com.arduinoph

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d("MyFirebaseMessagingService", "Message received: $remoteMessage")
        val data = remoteMessage.data
        if (data["type"] == "alarm") {
            // Extract title and body from the data payload
            val title = data["title"] ?: "Default Alarm Title"
            val body = data["body"] ?: "Default Alarm Message"
            // Trigger the custom notification with dynamic content
            CustomNotificationManager.showCustomNotification(this, title, body)
        }
    }

    override fun onNewToken(token: String) {
        Log.d("MyFirebaseMessagingService", "New token: $token")
        // Optionally, send the new token to your server
    }
}
