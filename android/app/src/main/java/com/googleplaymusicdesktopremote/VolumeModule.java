package com.googleplaymusicdesktopremote;

import android.view.KeyEvent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class VolumeModule extends ReactContextBaseJavaModule {
  private ReactContext reactContext;

  public VolumeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "VolumeAndroid";
  }

    private void emitEvent(String eventName) {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, null);
    }

  public boolean onKeyDown(int keyCode, KeyEvent event) {
      if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
          this.emitEvent("volume_up");
          return true;
      }

      if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
          this.emitEvent("volume_down");
          return true;
      }
      return false;
  }
}
