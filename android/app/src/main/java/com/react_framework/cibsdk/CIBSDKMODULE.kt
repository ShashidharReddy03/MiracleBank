package com.react_framework.cibsdk

import com.facebook.react.bridge.*
import com.modefin.modeapi.core.request.RequestBuilder
import com.modefin.modeapi.cib.request.FundTransfer

class CIBSDKModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "CIBSDKBridge"

    @ReactMethod
    fun buildRequest(metadataJson: String, requestJson: String, promise: Promise) {
        promise.resolve(RequestBuilder.build(metadataJson, requestJson))
    }


    @ReactMethod
    fun ownAccountConfirm(params: ReadableMap, promise: Promise) {
        val request = FundTransfer.OwnAccountConfirm(
            sourceAccount    = params.getString("sourceAccount"),
            toAccount        = params.getString("toAccount"),
            amount           = params.getString("amount"),
            remarks          = params.getString("remarks"),
            exchangeAmount   = params.getString("exchangeAmount"),
            exchangeRate     = params.getString("exchangeRate"),
            ticketNumber     = params.getString("ticketNumber"),
            isAutoDebit      = params.getString("isAutoDebit"),
            debitDate        = params.getString("debitDate"),
            fromCurrency     = params.getString("fromCurrency"),
            fromCurrencyCode = params.getString("fromCurrencyCode"),
            toCurrency       = params.getString("toCurrency"),
            toCurrencyCode   = params.getString("toCurrencyCode")
        )
        promise.resolve(request.toJsonString())
    }
}
