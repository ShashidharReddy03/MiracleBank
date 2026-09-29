package com.react_framework.security;

import android.Manifest;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.InstallSourceInfo;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.os.Debug;
import android.provider.Settings;
import android.telephony.SubscriptionInfo;
import android.telephony.SubscriptionManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

public class SecurityModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public SecurityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "MFSecurityModule";
    }

    // ================================================================
    // 1. HARDWARE + EMULATOR DETECTION
    // ================================================================

    @ReactMethod
    public void getHardware(Promise promise) {
        try {
            WritableMap ret = Arguments.createMap();

            String hardware = safeLower(Build.HARDWARE);
            String model = safeLower(Build.MODEL);
            String manufacturer = safeLower(Build.MANUFACTURER);
            String product = safeLower(Build.PRODUCT);
            String device = safeLower(Build.DEVICE);
            String brand = safeLower(Build.BRAND);
            String board = safeLower(Build.BOARD);
            String fingerprint = safeLower(Build.FINGERPRINT);

            // --------------------------------------------------------
            // Signal 1: General build properties
            // --------------------------------------------------------

            boolean buildSignal =
                    hardware.contains("goldfish") ||
                    hardware.contains("ranchu") ||
                    hardware.contains("qemu") ||
                    model.contains("emulator") ||
                    model.contains("android sdk built for") ||
                    manufacturer.contains("genymotion") ||
                    manufacturer.contains("unknown") ||
                    product.contains("sdk") ||
                    product.contains("emulator") ||
                    product.contains("vbox") ||
                    device.contains("generic") ||
                    device.contains("emulator") ||
                    brand.equals("generic") ||
                    board.contains("goldfish") ||
                    board.contains("ranchu");

            // --------------------------------------------------------
            // Signal 2: Fingerprint
            // --------------------------------------------------------

            boolean fingerprintSignal =
                    fingerprint.contains("generic") ||
                    fingerprint.contains("unknown") ||
                    fingerprint.contains("emulator") ||
                    fingerprint.contains("goldfish") ||
                    fingerprint.contains("ranchu") ||
                    fingerprint.contains("test-keys");

            // --------------------------------------------------------
            // Signal 3: QEMU / virtualization
            // --------------------------------------------------------

            boolean qemuSignal =
                    hardware.contains("qemu") ||
                    board.contains("qemu") ||
                    product.contains("qemu") ||
                    device.contains("qemu");

            // --------------------------------------------------------
            // Signal 4: Generic Android device
            // --------------------------------------------------------

            boolean genericDeviceSignal =
                    (brand.equals("generic") && device.equals("generic")) ||
                    model.contains("sdk_gphone") ||
                    model.contains("sdk") ||
                    device.contains("generic_x86") ||
                    device.contains("generic_x86_64");

            // --------------------------------------------------------
            // Signal 5: Emulator model
            // --------------------------------------------------------

            boolean emulatorModelSignal =
                    model.contains("sdk_gphone") ||
                    model.contains("android sdk") ||
                    model.contains("emulator") ||
                    model.contains("aosp") ||
                    model.contains("virtual");

            // --------------------------------------------------------
            // Signal 6: Emulator manufacturer
            // --------------------------------------------------------

            boolean manufacturerSignal =
                    manufacturer.contains("genymotion") ||
                    manufacturer.contains("unknown") ||
                    manufacturer.contains("the android sdk built for") ||
                    manufacturer.contains("google")
                    && (
                        model.contains("sdk") ||
                        product.contains("sdk")
                    );

            // --------------------------------------------------------
            // Count independent signal groups
            // --------------------------------------------------------

            int emulatorSignals = 0;

            if (buildSignal) {
                emulatorSignals++;
            }

            if (fingerprintSignal) {
                emulatorSignals++;
            }

            if (qemuSignal) {
                emulatorSignals++;
            }

            if (genericDeviceSignal) {
                emulatorSignals++;
            }

            if (emulatorModelSignal) {
                emulatorSignals++;
            }

            if (manufacturerSignal) {
                emulatorSignals++;
            }

            /*
             * Do not block based on one weak Build property.
             *
             * 2 or more signal groups:
             *     emulator suspected
             */
            boolean isEmulator = emulatorSignals >= 2;

            // --------------------------------------------------------
            // Return raw diagnostic values
            // --------------------------------------------------------

            ret.putString("hardware", Build.HARDWARE);
            ret.putString("model", Build.MODEL);
            ret.putString("manufacturer", Build.MANUFACTURER);
            ret.putString("product", Build.PRODUCT);
            ret.putString("device", Build.DEVICE);
            ret.putString("brand", Build.BRAND);
            ret.putString("board", Build.BOARD);
            ret.putString("fingerprint", Build.FINGERPRINT);

            ret.putBoolean("buildSignal", buildSignal);
            ret.putBoolean("fingerprintSignal", fingerprintSignal);
            ret.putBoolean("qemuSignal", qemuSignal);
            ret.putBoolean("genericDeviceSignal", genericDeviceSignal);
            ret.putBoolean("emulatorModelSignal", emulatorModelSignal);
            ret.putBoolean("manufacturerSignal", manufacturerSignal);

            ret.putInt("emulatorSignals", emulatorSignals);
            ret.putBoolean("isEmulator", isEmulator);

            promise.resolve(ret);

        } catch (Exception e) {
            promise.reject(
                    "HARDWARE_ERROR",
                    e.getMessage() != null ? e.getMessage() : "Hardware detection failed"
            );
        }
    }

    // ================================================================
    // 2. VPN DETECTION
    // ================================================================

    @ReactMethod
    public void isVPNActive(Promise promise) {
        try {
            boolean isVpn = false;

            ConnectivityManager cm =
                    (ConnectivityManager)
                            reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);

            if (cm != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {

                Network network = cm.getActiveNetwork();

                if (network != null) {
                    NetworkCapabilities caps =
                            cm.getNetworkCapabilities(network);

                    if (caps != null) {
                        isVpn = caps.hasTransport(
                                NetworkCapabilities.TRANSPORT_VPN
                        );
                    }
                }
            }

            WritableMap ret = Arguments.createMap();
            ret.putBoolean("active", isVpn);

            promise.resolve(ret);

        } catch (Exception e) {
            promise.reject(
                    "VPN_ERROR",
                    e.getMessage() != null ? e.getMessage() : "VPN detection failed"
            );
        }
    }

    // ================================================================
    // 3. PROXY DETECTION
    // ================================================================

    @ReactMethod
    public void isProxyEnabled(Promise promise) {
        try {
            String proxyHost = System.getProperty("http.proxyHost");
            String proxyPort = System.getProperty("http.proxyPort");

            boolean systemProxy =
                    proxyHost != null &&
                    !proxyHost.trim().isEmpty() &&
                    proxyPort != null &&
                    !proxyPort.equals("0") &&
                    !proxyPort.trim().isEmpty();

            // Android global HTTP proxy
            String globalProxy = "";

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                globalProxy = Settings.Global.getString(
                        reactContext.getContentResolver(),
                        "http_proxy"
                );
            }

            boolean globalProxyEnabled =
                    globalProxy != null &&
                    !globalProxy.trim().isEmpty() &&
                    !" :0".equals(globalProxy.trim());

            boolean enabled =
                    systemProxy || globalProxyEnabled;

            WritableMap ret = Arguments.createMap();

            ret.putBoolean("enabled", enabled);
            ret.putBoolean("systemProxy", systemProxy);
            ret.putBoolean("globalProxy", globalProxyEnabled);

            promise.resolve(ret);

        } catch (Exception e) {
            promise.reject(
                    "PROXY_ERROR",
                    e.getMessage() != null ? e.getMessage() : "Proxy detection failed"
            );
        }
    }

    // ================================================================
    // 4. USB DEBUGGING / DEVELOPER OPTIONS
    // ================================================================

    @ReactMethod
    public void isUsbDebuggingEnabled(Promise promise) {
        try {
            boolean adbEnabled =
                    Settings.Global.getInt(
                            reactContext.getContentResolver(),
                            Settings.Global.ADB_ENABLED,
                            0
                    ) == 1;

            boolean developerOptions =
                    Settings.Global.getInt(
                            reactContext.getContentResolver(),
                            Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
                            0
                    ) == 1;

            boolean debuggerConnected =
                    Debug.isDebuggerConnected();

            WritableMap ret = Arguments.createMap();

            ret.putBoolean("adbEnabled", adbEnabled);
            ret.putBoolean("devOptions", developerOptions);
            ret.putBoolean("debuggerConnected", debuggerConnected);

            promise.resolve(ret);

        } catch (Exception e) {
            promise.reject(
                    "USB_ERROR",
                    e.getMessage() != null ? e.getMessage() : "USB debugging check failed"
            );
        }
    }

    // ================================================================
    // 5. ROOT DETECTION
    // ================================================================

    @ReactMethod
    public void isDeviceRooted(Promise promise) {
        try {

            int rootSignals = 0;

            // --------------------------------------------------------
            // Signal 1: test-keys
            // --------------------------------------------------------

            boolean testKeys =
                    Build.TAGS != null &&
                    Build.TAGS.contains("test-keys");

            if (testKeys) {
                rootSignals++;
            }

            // --------------------------------------------------------
            // Signal 2: su binaries
            // --------------------------------------------------------

            String[] suPaths = {
                    "/system/bin/su",
                    "/system/xbin/su",
                    "/sbin/su",
                    "/system/su",
                    "/vendor/bin/su",
                    "/product/bin/su",
                    "/data/local/bin/su",
                    "/data/local/xbin/su",
                    "/data/local/su"
            };

            boolean suBinaryFound = false;

            for (String path : suPaths) {
                if (new File(path).exists()) {
                    suBinaryFound = true;
                    break;
                }
            }

            if (suBinaryFound) {
                rootSignals++;
            }

            // --------------------------------------------------------
            // Signal 3: root management applications
            // --------------------------------------------------------

            boolean rootAppFound =
                    isPackageInstalled("com.topjohnwu.magisk") ||
                    isPackageInstalled("eu.chainfire.supersu") ||
                    isPackageInstalled("com.koushikdutta.superuser") ||
                    isPackageInstalled("com.noshufou.android.su");

            if (rootAppFound) {
                rootSignals++;
            }

            // --------------------------------------------------------
            // Signal 4: dangerous writable system locations
            // --------------------------------------------------------

            boolean suspiciousWritablePath =
                    isWritable("/system") ||
                    isWritable("/system/bin") ||
                    isWritable("/system/xbin");

            if (suspiciousWritablePath) {
                rootSignals++;
            }

            // --------------------------------------------------------
            // Signal 5: suspicious mount information
            // --------------------------------------------------------

            boolean suspiciousMount = hasWritableSystemMount();

            if (suspiciousMount) {
                rootSignals++;
            }

            /*
             * Multiple signals reduce false positives.
             *
             * One signal alone is not treated as confirmed root.
             */
            boolean rooted = rootSignals >= 2;

            WritableMap ret = Arguments.createMap();

            ret.putBoolean("rooted", rooted);
            ret.putBoolean("testKeys", testKeys);
            ret.putBoolean("suBinaryFound", suBinaryFound);
            ret.putBoolean("rootAppFound", rootAppFound);
            ret.putBoolean("writableSystemPath", suspiciousWritablePath);
            ret.putBoolean("suspiciousMount", suspiciousMount);
            ret.putInt("rootSignals", rootSignals);

            promise.resolve(ret);

        } catch (Exception e) {
            promise.reject(
                    "ROOT_ERROR",
                    e.getMessage() != null ? e.getMessage() : "Root detection failed"
            );
        }
    }

    // ================================================================
    // 6. FRIDA / INSTRUMENTATION DETECTION
    // ================================================================

    @ReactMethod
    public void isFridaDetected(Promise promise) {
        try {

            boolean detected = false;

            String[] suspiciousStrings = {
                    "frida",
                    "frida-agent",
                    "frida-gadget",
                    "gum-js-loop",
                    "gmain",
                    "linjector"
            };

            File maps =
                    new File(
                            "/proc/" +
                                    android.os.Process.myPid() +
                                    "/maps"
                    );

            if (maps.exists()) {

                try (
                        FileInputStream fis =
                                new FileInputStream(maps);
                        BufferedReader reader =
                                new BufferedReader(
                                        new InputStreamReader(fis)
                                )
                ) {

                    String line;

                    while ((line = reader.readLine()) != null) {

                        String lower =
                                line.toLowerCase(Locale.ROOT);

                        for (String suspicious : suspiciousStrings) {

                            if (lower.contains(suspicious)) {
                                detected = true;
                                break;
                            }
                        }

                        if (detected) {
                            break;
                        }
                    }
                }
            }

            WritableMap ret = Arguments.createMap();
            ret.putBoolean("detected", detected);

            promise.resolve(ret);

        } catch (Exception e) {

            /*
             * Failure to inspect /proc does not prove that
             * Frida is absent.
             *
             * Return false here only because this method is
             * designed as a detection signal.
             */
            WritableMap ret = Arguments.createMap();
            ret.putBoolean("detected", false);
            ret.putBoolean("checkFailed", true);

            promise.resolve(ret);
        }
    }

    // ================================================================
    // 7. SIM DATA
    // ================================================================

    @ReactMethod
    public void getSimData(Promise promise) {
        try {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {

                if (reactContext.checkSelfPermission(
                        Manifest.permission.READ_PHONE_STATE
                ) != PackageManager.PERMISSION_GRANTED) {

                    promise.reject(
                            "PERMISSION_DENIED",
                            "READ_PHONE_STATE not granted"
                    );

                    return;
                }
            }

            SubscriptionManager sm =
                    (SubscriptionManager)
                            reactContext.getSystemService(
                                    Context.TELEPHONY_SUBSCRIPTION_SERVICE
                            );

            WritableArray arr =
                    Arguments.createArray();

            if (sm != null) {

                List<SubscriptionInfo> list =
                        sm.getActiveSubscriptionInfoList();

                if (list != null) {

                    for (SubscriptionInfo info : list) {

                        WritableMap obj =
                                Arguments.createMap();

                        obj.putInt(
                                "slot",
                                info.getSimSlotIndex()
                        );

                        CharSequence carrier =
                                info.getCarrierName();

                        obj.putString(
                                "carrier",
                                carrier != null
                                        ? carrier.toString()
                                        : ""
                        );

                        arr.pushMap(obj);
                    }
                }
            }

            WritableMap ret =
                    Arguments.createMap();

            ret.putArray("sims", arr);

            promise.resolve(ret);

        } catch (Exception e) {
            promise.reject(
                    "SIM_ERROR",
                    e.getMessage() != null ? e.getMessage() : "SIM check failed"
            );
        }
    }

    // ================================================================
    // 8. APP INSTALL SOURCE
    // ================================================================

    @ReactMethod
    public void isAppInstalledFromAppStore(Promise promise) {
        try {

            String packageName =
                    reactContext.getPackageName();

            PackageManager pm =
                    reactContext.getPackageManager();

            boolean isFromStore = false;
            String storeId = "unknown";

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {

                InstallSourceInfo info =
                        pm.getInstallSourceInfo(packageName);

                String initiating =
                        info.getInitiatingPackageName();

                String installing =
                        info.getInstallingPackageName();

                storeId =
                        initiating != null
                                ? initiating
                                : installing != null
                                ? installing
                                : "unknown";

                isFromStore =
                        isKnownStore(initiating) ||
                        isKnownStore(installing);

            } else {

                String installer =
                        pm.getInstallerPackageName(packageName);

                storeId =
                        installer != null
                                ? installer
                                : "unknown";

                isFromStore =
                        isKnownStore(installer);
            }

            WritableMap ret =
                    Arguments.createMap();

            ret.putBoolean(
                    "isFromStore",
                    isFromStore
            );

            ret.putString(
                    "storeId",
                    storeId
            );

            promise.resolve(ret);

        } catch (Exception e) {

            WritableMap ret =
                    Arguments.createMap();

            ret.putBoolean(
                    "isFromStore",
                    false
            );

            ret.putString(
                    "storeId",
                    "unknown"
            );

            ret.putBoolean(
                    "checkFailed",
                    true
            );

            promise.resolve(ret);
        }
    }

    // ================================================================
    // 9. SYSTEM VERSION
    // ================================================================

    @ReactMethod
    public void currentSystemVersion(Promise promise) {
        try {

            WritableMap ret =
                    Arguments.createMap();

            ret.putString(
                    "release",
                    Build.VERSION.RELEASE
            );

            ret.putInt(
                    "sdkInt",
                    Build.VERSION.SDK_INT
            );

            ret.putString(
                    "securityPatch",
                    Build.VERSION.SECURITY_PATCH
            );

            ret.putString(
                    "incremental",
                    Build.VERSION.INCREMENTAL
            );

            ret.putString(
                    "codename",
                    Build.VERSION.CODENAME
            );

            promise.resolve(ret);

        } catch (Exception e) {

            promise.reject(
                    "VERSION_ERROR",
                    e.getMessage() != null
                            ? e.getMessage()
                            : "System version check failed"
            );
        }
    }

    // ================================================================
    // 10. USB / LAPTOP CONNECTION
    // ================================================================

    @ReactMethod
    public void isConnectedToLaptop(Promise promise) {
        try {

            UsbManager usbManager =
                    (UsbManager)
                            reactContext.getSystemService(
                                    Context.USB_SERVICE
                            );

            boolean usbDeviceAttached = false;

            if (usbManager != null) {

                HashMap<String, UsbDevice> deviceList =
                        usbManager.getDeviceList();

                usbDeviceAttached =
                        deviceList != null &&
                        !deviceList.isEmpty();
            }

            boolean adbEnabled =
                    Settings.Global.getInt(
                            reactContext.getContentResolver(),
                            Settings.Global.ADB_ENABLED,
                            0
                    ) == 1;

            boolean debuggerConnected =
                    Debug.isDebuggerConnected();

            /*
             * A USB device being attached does NOT necessarily mean
             * the phone is connected to a laptop.
             *
             * Therefore expose the individual signals instead of
             * treating every USB device as a laptop connection.
             */
            boolean connected =
                    adbEnabled &&
                    debuggerConnected;

            WritableMap ret =
                    Arguments.createMap();

            ret.putBoolean(
                    "connected",
                    connected
            );

            ret.putBoolean(
                    "adbEnabled",
                    adbEnabled
            );

            ret.putBoolean(
                    "debuggerConnected",
                    debuggerConnected
            );

            ret.putBoolean(
                    "usbDeviceAttached",
                    usbDeviceAttached
            );

            promise.resolve(ret);

        } catch (Exception e) {

            promise.reject(
                    "USB_LAPTOP_ERROR",
                    e.getMessage() != null
                            ? e.getMessage()
                            : "USB connection check failed"
            );
        }
    }

   // ================================================================
    // 11. isAppDebuggable
    // ================================================================

//     @ReactMethod
//    public void isAppDebuggable(Promise promise) {
//     try {
//         ApplicationInfo appInfo =
//                 getReactApplicationContext().getApplicationInfo();

//         boolean debuggable =
//                 (appInfo.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;

//         promise.resolve(debuggable);

//     } catch (Exception e) {
//         promise.resolve(false);
//     }
//   }

    // ================================================================
    // HELPER METHODS
    // ================================================================

    private String safeLower(String value) {
        return value == null
                ? ""
                : value.toLowerCase(Locale.ROOT);
    }

    private boolean isPackageInstalled(String packageName) {

        try {

            reactContext.getPackageManager()
                    .getPackageInfo(packageName, 0);

            return true;

        } catch (PackageManager.NameNotFoundException e) {

            return false;
        }
    }

    private boolean isWritable(String path) {

        try {

            File file = new File(path);

            return file.exists() &&
                    file.canWrite();

        } catch (Exception e) {

            return false;
        }
    }

    private boolean hasWritableSystemMount() {

        try {

            File mounts =
                    new File("/proc/self/mounts");

            if (!mounts.exists()) {
                return false;
            }

            try (
                    FileInputStream fis =
                            new FileInputStream(mounts);
                    BufferedReader reader =
                            new BufferedReader(
                                    new InputStreamReader(fis)
                            )
            ) {

                String line;

                while ((line = reader.readLine()) != null) {

                    String lower =
                            line.toLowerCase(Locale.ROOT);

                    if ((lower.contains(" /system ") ||
                            lower.contains(" /system/")) &&
                            (lower.contains(" rw,") ||
                             lower.contains(" rw "))) {

                        return true;
                    }
                }
            }

        } catch (Exception ignored) {
        }

        return false;
    }

    private boolean isKnownStore(String packageName) {

        if (packageName == null) {
            return false;
        }

        return "com.android.vending".equals(packageName) ||
                "com.amazon.venezia".equals(packageName);
    }
}
