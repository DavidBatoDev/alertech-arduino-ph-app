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

    /**
     * Displays a custom notification with a dynamic title and message.
     *
     * @param context The context to use.
     * @param title   The title for the notification.
     * @param message The description/message for the notification.
     */
    fun showCustomNotification(context: Context, title: String, message: String) {
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

        // Set the dynamic text for the collapsed layout.
        collapsedView.setTextViewText(R.id.notification_title, title)
        collapsedView.setTextViewText(R.id.notification_text, message)

        // Set the dynamic text for the expanded layout.
        expandedView.setTextViewText(R.id.notification_title_big, title)
        expandedView.setTextViewText(R.id.notification_text_big, message)

        // 3. Create a PendingIntent to open MainActivity.
        val intent = Intent(context, MainActivity::class.java).apply {
            putExtra("screen", "Alarm") // Optionally pass a parameter.
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
            .setContentIntent(pendingIntent)
            .setSound(soundUri)  // For pre-Oreo devices.
            .setStyle(NotificationCompat.DecoratedCustomViewStyle())
            .setCustomContentView(collapsedView)
            .setCustomBigContentView(expandedView)
            .build()

        // 5. Show the notification.
        NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
    }
}
