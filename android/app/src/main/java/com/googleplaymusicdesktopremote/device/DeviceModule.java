package com.googleplaymusicdesktopremote.device;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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

  @ReactMethod
  public void getDeviceName(Promise promise) {
      promise.resolve(android.os.Build.MODEL);
  }
}
