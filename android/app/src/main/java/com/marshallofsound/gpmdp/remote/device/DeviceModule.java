package com.marshallofsound.gpmdp.remote.device;

import android.content.res.Configuration;
import android.support.annotation.Nullable;

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
    if(config.orientation == Configuration.ORIENTATION_LANDSCAPE){
      params.putString("orientation", "LANDSCAPE");
    }else{
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
}
