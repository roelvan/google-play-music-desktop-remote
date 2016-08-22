package com.marshallofsound.gpmdp.remote.media;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.support.annotation.Nullable;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.support.v7.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.marshallofsound.gpmdp.remote.R;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;

public class MediaModule extends ReactContextBaseJavaModule {
    private ReactContext reactContext;
    private static ReactContext sReactContext;
    public static MediaSessionCompat mediaSession;
    private MediaMetadataCompat.Builder meta;
    private android.support.v4.app.NotificationCompat.Builder builder;
    private Bitmap image = null;
    private boolean playing = false;
    private Integer pos = 0;

    public static String PREV_INTENT_ACTION = "com.marshallofsound.gpmdp.remote.media.CONTROLLER.prev";
    public static String PLAYPAUSE_INTENT_ACTION = "com.marshallofsound.gpmdp.remote.media.CONTROLLER.playpause";
    public static String NEXT_INTENT_ACTION = "com.marshallofsound.gpmdp.remote.media.CONTROLLER.next";

    private static MediaModule _instance  = null;

    public MediaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        sReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "MediaAndroid";
    }

    private void emitEvent(String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public static void sEmitEvent(String eventName, @Nullable WritableMap params) {
        sReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void createNotification() {
        ComponentName mediaButtonReceiver = new ComponentName(reactContext, MediaModule.class);
        mediaSession = new MediaSessionCompat(reactContext, "FOO_BAR", mediaButtonReceiver, null);

        mediaSession.setFlags(
            MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS |
            MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS);

        mediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
                .setState(PlaybackStateCompat.STATE_PAUSED, 0, 0)
                .setActions(PlaybackStateCompat.ACTION_PLAY_PAUSE)
                .build());
        try {
            URL url = new URL("http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg");
            image = BitmapFactory.decodeStream(url.openConnection().getInputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
        meta = new MediaMetadataCompat.Builder();
        mediaSession.setMetadata(meta.build());

        builder = new NotificationCompat.Builder(reactContext)
                .setSmallIcon(R.drawable.ic_headset_white_48dp)
                .setStyle(new NotificationCompat.MediaStyle()
                .setMediaSession(mediaSession.getSessionToken()));
    }

    @ReactMethod
    public void updatePlaybackPosition(Integer current, Integer duration) {
        meta.putLong(MediaMetadataCompat.METADATA_KEY_DURATION, duration);
        pos = current;
        mediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
                .setState(playing ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED, pos, 1)
                .setActions(PlaybackStateCompat.ACTION_PLAY_PAUSE)
                .build());
        mediaSession.setMetadata(meta.build());
    }

    @ReactMethod
    public void updatePlayState(Boolean isPlaying) {
        playing = isPlaying;
        mediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
                .setState(playing ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED, pos, 1)
                .setActions(PlaybackStateCompat.ACTION_PLAY_PAUSE)
                .build());
        updateNotificationActions();
        showNotification();
    }

    @ReactMethod
    public void updateMetaData(String title, String artist, String album, String albumArt) {
        try {
            URL url = new URL(albumArt);
            image = BitmapFactory.decodeStream(url.openConnection().getInputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
        meta.putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
            .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, album)
            .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
            .putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, image);
        mediaSession.setMetadata(meta.build());
        mediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
                .setState(PlaybackStateCompat.STATE_PLAYING, 0, 1)
                .setActions(PlaybackStateCompat.ACTION_PLAY_PAUSE)
                .build());
        mediaSession.setCallback(new MediaSessionCB());

        builder.setContentTitle(title)
                .setContentText(artist + " - " + album)
                .setOngoing(true)
                .setLargeIcon((image));

        updateNotificationActions();

        mediaSession.setActive(true);
        showNotification();
    }

    public void showNotification() {
        NotificationManager mNotificationManager =
                (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);

        mNotificationManager.notify(0, builder.build());
    }

    private void updateNotificationActions() {
        builder.mActions = new ArrayList<>();

        Intent prevIntent = new Intent();
        prevIntent.setAction(PREV_INTENT_ACTION);
        PendingIntent pendPrevIntent = PendingIntent.getBroadcast(reactContext, 0, prevIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        Intent playIntent = new Intent();
        playIntent.setAction(PLAYPAUSE_INTENT_ACTION);
        PendingIntent pendPlayIntent = PendingIntent.getBroadcast(reactContext, 0, playIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        Intent nextIntent = new Intent();
        nextIntent.setAction(NEXT_INTENT_ACTION);
        PendingIntent pendNextIntent = PendingIntent.getBroadcast(reactContext, 0, nextIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        builder.addAction(R.drawable.ic_skip_previous_white_48dp, "Previous", pendPrevIntent)
                .addAction(playing ? R.drawable.ic_pause_white_48dp : R.drawable.ic_play_arrow_white_48dp, playing ? "Pause" : "Play", pendPlayIntent)
                .addAction(R.drawable.ic_skip_next_white_48dp, "Next", pendNextIntent);
    }
}

class MediaSessionCB extends MediaSessionCompat.Callback {
    @Override
    public void onPlay() {
        super.onPlay();
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    @Override
    public void onCommand(String command, Bundle extras, ResultReceiver cb) {
        super.onCommand(command, extras, cb);
    }

    @Override
    public boolean onMediaButtonEvent(Intent mediaButtonEvent) {
        return super.onMediaButtonEvent(mediaButtonEvent);
    }
}