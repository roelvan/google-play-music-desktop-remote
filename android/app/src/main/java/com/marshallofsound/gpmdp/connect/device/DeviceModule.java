package com.marshallofsound.gpmdp.connect.device;

import android.content.DialogInterface;
import android.content.res.Configuration;
import android.support.annotation.Nullable;
import android.text.InputType;

import com.afollestad.materialdialogs.MaterialDialog;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class DeviceModule extends ReactContextBaseJavaModule {
    private ReactContext reactContext;

    public DeviceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DeviceInfo";
    }

    private void emitEvent(String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void configurationUpdate(Configuration config) {
        WritableMap params = new WritableNativeMap();
        if (config.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            params.putString("orientation", "LANDSCAPE");
        } else {
            params.putString("orientation", "PORTRAIT");
        }
        this.emitEvent("orientation", params);
    }

    @ReactMethod
    public void getDeviceName(Promise promise) {
        promise.resolve(android.os.Build.MODEL);
    }

    @ReactMethod
    public void getDeviceOrientation(Promise promise) {
        promise.resolve(reactContext.getResources().getConfiguration().orientation);
    }

    @ReactMethod
    public void dialog(String title, String content, String positiveText, final Promise promise) {
        if (getCurrentActivity() == null) return;
        final CharSequence[] cs = new CharSequence[1];
        new MaterialDialog.Builder(getCurrentActivity())
            .title(title)
            .content(content)
            .positiveText(positiveText)
            .inputType(InputType.TYPE_CLASS_TEXT)
            .input("", null, false, new MaterialDialog.InputCallback() {
                @Override
                public void onInput(MaterialDialog dialog, CharSequence input) {
                    promise.resolve(input.toString());
                }
            })
            .cancelListener(new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface dialogInterface) {
                    promise.reject("", "");
                }
            })
            .show();
    }
}
