package com.marshallofsound.gpmdp.remote.websocket;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.marshallofsound.gpmdp.remote.PlaybackAPIService;

public class WebSocketModule extends ReactContextBaseJavaModule {
    private ReactContext reactContext;

    public WebSocketModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        BroadcastReceiver bReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if(intent.getAction().equals("com.gpmdp.WebSocketEvent")) {
                    Log.i("WebSocketModule", "Event recieved: " + intent.getStringExtra("evName"));
                    WritableNativeMap map = new WritableNativeMap();
                    map.putString("msg", intent.getStringExtra("msg"));
                    emitEvent(intent.getStringExtra("evName"), map);
                }
            }
        };
        LocalBroadcastManager bManager = LocalBroadcastManager.getInstance(reactContext);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.gpmdp.WebSocketEvent");
        bManager.registerReceiver(bReceiver, intentFilter);
    }

    @Override
    public String getName() {
        return "BackgroundWebSocket";
    }

    private void emitEvent(String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void connect(String ip) {
        Intent intent = new Intent(reactContext, PlaybackAPIService.class);
        intent.putExtra("IP", ip);
        reactContext.startService(intent);
    }

    @ReactMethod
    public void send(String msg) {
        Intent intent = new Intent(reactContext, PlaybackAPIService.class);
        intent.putExtra("MSG", msg);
        reactContext.startService(intent);
    }

    @ReactMethod
    public void disconnect() {
        reactContext.stopService(new Intent(reactContext, PlaybackAPIService.class));
    }
}
