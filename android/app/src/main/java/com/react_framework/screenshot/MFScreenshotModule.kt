package com.react_framework.screenshot

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MFScreenshotModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MFScreenshotModule"
    }

    @ReactMethod
    fun setSecure(enabled: Boolean) {
        val activity = reactApplicationContext.currentActivity ?: return

        activity.runOnUiThread {
            if (enabled) {
                activity.window.addFlags(
                    WindowManager.LayoutParams.FLAG_SECURE
                )
            } else {
                activity.window.clearFlags(
                    WindowManager.LayoutParams.FLAG_SECURE
                )
            }
        }
    }
}
