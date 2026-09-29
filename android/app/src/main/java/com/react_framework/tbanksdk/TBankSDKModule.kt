package com.react_framework.tbanksdk

import com.facebook.react.bridge.*
import com.modefin.modeapi.core.request.RequestMetadata
import com.modefin.modeapi.tbank.TBankAccountKind
import com.modefin.modeapi.tbank.TBankAccountService
import com.modefin.modeapi.tbank.TBankAuthService
import com.modefin.modeapi.tbank.TBankException
import com.modefin.modeapi.tbank.TBankSDK
import com.modefin.modenetwork.ModeNetworkOptions
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class TBankSDKModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.Main)

    override fun getName() = "TBankSDKBridge"   // same as iOS — one JS wrapper serves both

    @ReactMethod
    fun configure(promise: Promise) {
        TBankSDK.configure(
 options = ModeNetworkOptions.plain("https://devapp.tbank.bt:8060//mfmbs/mbintf/ina/processapirequest.jsp"),
      metadata = RequestMetadata(
            reqLK = "yN21qw+rjznMF4TawKXNClQ==",
            reqSource = "android",
            reqAPIV = "1.0",
            appType = "static",
            mbManufacturer = "Google",
            mbModel = "Pixel 7 Emulator",
            reqSourceID = "HARNESS-TEST-DEVICE",
            isEmulator = "Y",
            isRootedApp = "N", isProxy = "N", isVPNConnected = "N",
            custLatiVal = "0.0", custLongiVal = "0.0",
            langCode = "en_US"
        )
        )
        promise.resolve(null)
    }

    @ReactMethod
    fun login(uid: String, pwd: String, promise: Promise) = run(promise) {
        TBankAuthService.loginJson(uid = uid, pwd = pwd, fetchDBData = "Y")
    }

    // kind: "SAVINGS" | "CURRENT" | "OVERDRAFT" | "BLA_INVESTMENT"
    @ReactMethod
    fun fetchBalance(sourceAccount: String, kind: String, promise: Promise) = run(promise) {
        TBankAccountService.fetchBalanceJson(sourceAccount, TBankAccountKind.valueOf(kind.uppercase()))
    }

    // Shared plumbing: run a suspend call, resolve/reject the promise.
    private fun run(promise: Promise, block: suspend () -> String) {
        scope.launch {
            try { promise.resolve(block()) }
            catch (e: TBankException) { promise.reject(e.code, e.serverMessage, e) }
            catch (e: Exception)      { promise.reject("UNKNOWN", e.message, e) }
        }
    }
}