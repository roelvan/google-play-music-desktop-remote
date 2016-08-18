package com.marshallofsound.gpmdp.remote.volume;

import android.view.KeyEvent;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.*;

public class VolumePackage implements ReactPackage {

    private VolumeModule vM = null;

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    public boolean onKeyDown(int keyCode, KeyEvent event) {
        return vM != null && vM.onKeyDown(keyCode, event);
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        vM = new VolumeModule(reactContext);
        modules.add(vM);

        return modules;
    }
}
