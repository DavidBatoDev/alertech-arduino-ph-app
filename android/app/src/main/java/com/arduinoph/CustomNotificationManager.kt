package com.arduinoph

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

object CustomNotificationManager {

    private const val CHANNEL_ID = "custom_notification_channel"
    private const val NOTIFICATION_ID = 101

    fun showCustomNotification(context: Context) {
        // Create a URI for the custom sound from the raw resource folder.
        val soundUri: Uri = Uri.parse("android.resource://${context.packageName}/${R.raw.alarm_sound}")

        // 1. Create notification channel for Android O and above with custom sound.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelName = "Custom Notifications"
            val channelDescription = "Channel for custom notifications"
            val importance = NotificationManager.IMPORTANCE_HIGH

            // Set up AudioAttributes for the notification sound.
            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .build()

            val channel = NotificationChannel(CHANNEL_ID, channelName, importance).apply {
                description = channelDescription
                setSound(soundUri, audioAttributes)
            }
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }

        // 2. Prepare collapsed and expanded RemoteViews.
        val collapsedView = RemoteViews(context.packageName, R.layout.custom_notification_collapsed)
        val expandedView = RemoteViews(context.packageName, R.layout.custom_notification_expanded)

        // Set dynamic text if needed.
        collapsedView.setTextViewText(R.id.notification_title, "Fire Alarm Activated")
        collapsedView.setTextViewText(R.id.notification_text, "Tap to view details.")

        expandedView.setTextViewText(R.id.notification_title_big, "Alarm Activated (BIG)")
        expandedView.setTextViewText(R.id.notification_text_big, "Swipe down to see more info...")

        // 3. Create a PendingIntent to open MainActivity.
        val intent = Intent(context, MainActivity::class.java).apply {
            putExtra("screen", "Alarm") // Pass parameter to navigate to a specific screen.
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // 4. Build the custom notification.
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)  // Required small icon.
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)      // Open your app when tapped.
            .setSound(soundUri)                   // Set custom sound for pre-Oreo devices.
            .setStyle(NotificationCompat.DecoratedCustomViewStyle())
            .setCustomContentView(collapsedView)    // Collapsed layout.
            .setCustomBigContentView(expandedView)  // Expanded layout.
            .build()

        // 5. Show the notification.
        NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
    }
}
