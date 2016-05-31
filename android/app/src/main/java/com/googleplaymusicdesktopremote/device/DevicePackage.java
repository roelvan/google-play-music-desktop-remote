package com.googleplaymusicdesktopremote.device;

import android.content.res.Configuration;
import android.view.KeyEvent;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DevicePackage implements ReactPackage {

  private DeviceModule dm = null;

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  public void configurationUpdate(Configuration config) {
    if (dm != null) {
      dm.configurationUpdate(config);
    }
  }

  @Override
  public List<NativeModule> createNativeModules(
          ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();

    dm = new DeviceModule(reactContext);

    modules.add(dm);

    return modules;
  }
}
