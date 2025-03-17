package com.arduinoph

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d("MyFirebaseMessagingService", "Message received: $remoteMessage")
        val data = remoteMessage.data
        if (data["type"] == "alarm") {
            // Extract dynamic fields from the data payload
            val title = data["title"] ?: "Default Alarm Title"
            val body = data["body"] ?: "Default Alarm Message"
            val soundType = data["sound_type"]  // e.g., "alarm_sound" or "alert_sound"
            val imageUrl = data["imageUrl"]       // Optional image URL

            // Call the custom notification with dynamic title, message, sound type, and image URL.
            CustomNotificationManager.showCustomNotification(
                context = this,
                title = title,
                message = body,
                soundType = soundType, // May be null; our manager has a default fallback.
                imageUrl = imageUrl    // May be null.
            )
        }
    }

    override fun onNewToken(token: String) {
        Log.d("MyFirebaseMessagingService", "New token: $token")
        // Optionally, send the new token to your server for targeting this device.
    }
}
