package com.arduinoph

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.arduinoph.CustomNotificationManager

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Trigger the custom notification for testing
    // CustomNotificationManager.showCustomNotification(this)
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   */
  override fun getMainComponentName(): String = "ArduinoPH"

  /**
   * Returns the instance of the [ReactActivityDelegate].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
