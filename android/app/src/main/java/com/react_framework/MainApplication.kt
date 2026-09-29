package com.react_framework

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.react_framework.security.SecurityPackage
import com.react_framework.cibsdk.CIBSDKPackage
import com.react_framework.tbanksdk.TBankSDKPackage
import com.react_framework.screenshot.MFScreenshotPackage


class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
         add(SecurityPackage())
         add(CIBSDKPackage())
          add(TBankSDKPackage())
           add(MFScreenshotPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
