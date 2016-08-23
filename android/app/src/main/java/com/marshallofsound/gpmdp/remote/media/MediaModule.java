package com.marshallofsound.gpmdp.remote.media;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.marshallofsound.gpmdp.remote.InternalMediaService;


public class MediaModule extends ReactContextBaseJavaModule {

    public static String PREV_INTENT_ACTION = "com.marshallofsound.gpmdp.remote.media.CONTROLLER.prev";
    public static String PLAYPAUSE_INTENT_ACTION = "com.marshallofsound.gpmdp.remote.media.CONTROLLER.playpause";
    public static String NEXT_INTENT_ACTION = "com.marshallofsound.gpmdp.remote.media.CONTROLLER.next";

    private static MediaModule _instance  = null;

    public MediaModule(final ReactApplicationContext reactContext) {
        super(reactContext);
        InternalMediaService.getInstance(reactContext);
    }

    @Override
    public String getName() {
        return "MediaAndroid";
    }
}