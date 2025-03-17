package com.arduinoph

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

object CustomNotificationManager {

    private const val NOTIFICATION_ID = 101

    /**
     * Displays a custom notification with dynamic title, message, sound, and image.
     *
     * @param context   The context to use.
     * @param title     The title for the notification.
     * @param message   The description/message for the notification.
     * @param soundType The filename in res/raw without extension (e.g., "alarm_sound").
     * @param imageUrl  Optional URL for an image to display in the expanded view.
     */
    fun showCustomNotification(
        context: Context,
        title: String,
        message: String,
        soundType: String? = null,
        imageUrl: String? = null
    ) {
        // Use default sound if none provided
        val finalSoundType = soundType ?: "alarm_sound"
        // Create a unique channel ID based on the sound type
        val dynamicChannelId = "custom_notification_channel_$finalSoundType"

        // Resolve the raw resource ID for the sound
        val soundResId = context.resources.getIdentifier(finalSoundType, "raw", context.packageName)
        val finalSoundResId = if (soundResId == 0) {
            context.resources.getIdentifier("alarm_sound", "raw", context.packageName)
        } else {
            soundResId
        }
        // Build the URI for the sound
        val soundUri: Uri = Uri.parse("android.resource://${context.packageName}/$finalSoundResId")

        // Create notification channel for Android O and above with the selected sound.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channelName = "Custom Notifications - $finalSoundType"
            val channelDescription = "Channel for custom notifications with sound type $finalSoundType"
            val importance = NotificationManager.IMPORTANCE_HIGH

            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .build()

            val channel = NotificationChannel(dynamicChannelId, channelName, importance).apply {
                description = channelDescription
                setSound(soundUri, audioAttributes)
            }
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }

        // Prepare collapsed and expanded RemoteViews.
        val collapsedView = RemoteViews(context.packageName, R.layout.custom_notification_collapsed)
        val expandedView = RemoteViews(context.packageName, R.layout.custom_notification_expanded)

        // Set dynamic text for the collapsed layout.
        collapsedView.setTextViewText(R.id.notification_title, title)
        collapsedView.setTextViewText(R.id.notification_text, message)

        // Set dynamic text for the expanded layout.
        expandedView.setTextViewText(R.id.notification_title_big, title)
        expandedView.setTextViewText(R.id.notification_text_big, message)

        // Load dynamic image if provided.
        imageUrl?.let {
            val bitmap = getBitmapFromURL(it)
            bitmap?.let { bmp ->
                expandedView.setImageViewBitmap(R.id.notification_image, bmp)
            }
        }

        // Create a PendingIntent to open MainActivity and navigate to a specific screen.
        val intent = Intent(context, MainActivity::class.java).apply {
            putExtra("screen", "Alarm")
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Build the custom notification.
        val notification = NotificationCompat.Builder(context, dynamicChannelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setSound(soundUri) // For pre-Oreo devices.
            .setStyle(NotificationCompat.DecoratedCustomViewStyle())
            .setCustomContentView(collapsedView)
            .setCustomBigContentView(expandedView)
            .build()

        // Show the notification.
        NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
    }

    // Helper function to load an image from a URL.
    private fun getBitmapFromURL(src: String): Bitmap? {
        return try {
            val url = URL(src)
            val connection = url.openConnection() as HttpURLConnection
            connection.doInput = true
            connection.connect()
            val input = connection.inputStream
            BitmapFactory.decodeStream(input)
        } catch (e: IOException) {
            e.printStackTrace()
            null
        }
    }
}
