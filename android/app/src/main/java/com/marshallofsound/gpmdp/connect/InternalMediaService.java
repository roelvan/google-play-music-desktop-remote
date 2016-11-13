package com.marshallofsound.gpmdp.connect;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.support.v4.app.NotificationManagerCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.VolumeProviderCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.support.v7.app.NotificationCompat;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;

public class InternalMediaService {
    public static ReactContext sReactContext;
    public static MediaSessionCompat mediaSession;
    public static VolumeProviderCompat volumeController;
    private MediaMetadataCompat.Builder meta;
    private android.support.v4.app.NotificationCompat.Builder builder;
    private PlaybackStateCompat.Builder stateBuilder;
    private Bitmap image = null;
    private boolean playing = false;
    private Integer pos = 0;

    public static String PREV_INTENT_ACTION = "com.marshallofsound.gpmdp.connect.media.CONTROLLER.prev";
    public static String PLAYPAUSE_INTENT_ACTION = "com.marshallofsound.gpmdp.connect.media.CONTROLLER.playpause";
    public static String NEXT_INTENT_ACTION = "com.marshallofsound.gpmdp.connect.media.CONTROLLER.next";

    private static InternalMediaService mInstance;
    public static PlaybackAPIService mService;

    public static InternalMediaService getInstance() {
        return mInstance;
    }

    public static InternalMediaService getInstance(ReactContext mContext) {
        sReactContext = mContext;
        mInstance = new InternalMediaService();
        return mInstance;
    }

    public void createNotification() {
        AudioManager audioManager = (AudioManager)
                mService.getSystemService(Context.AUDIO_SERVICE);
        audioManager.requestAudioFocus(mService,
                AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);

        mediaSession = new MediaSessionCompat(mService, "GPMDP_MusicService");

        volumeController = new VolumeProviderCompat(VolumeProviderCompat.VOLUME_CONTROL_ABSOLUTE, 20, 10) {
            @Override
            public void onSetVolumeTo(int volume) {
                mService.sendCommand("volume", "setVolume", "[" + String.valueOf(volume * 5) + "]");
                super.onSetVolumeTo(volume);
                setCurrentVolume(volume);
            }

            @Override
            public void onAdjustVolume(int direction) {
                super.onAdjustVolume(direction);
                mService.sendCommand("volume", "setVolume", "[" + String.valueOf(getCurrentVolume() * 5) + "]");
                setCurrentVolume(getCurrentVolume() + direction);
            }
        };

        mediaSession.setPlaybackToRemote(volumeController);

        sReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                mediaSession.setCallback(new MediaSessionCompat.Callback() {
                    @Override
                    public void onCommand(String command, Bundle extras, ResultReceiver cb) {
                        super.onCommand(command, extras, cb);
                    }

                    @Override
                    public void onPlay() {
                        mService.sendCommand("playback", "playPause");
                        super.onPlay();
                    }

                    @Override
                    public void onPause() {
                        mService.sendCommand("playback", "playPause");
                        super.onPause();
                    }

                    @Override
                    public void onSkipToNext() {
                        mService.sendCommand("playback", "forward");
                        super.onSkipToNext();
                    }

                    @Override
                    public void onSkipToPrevious() {
                        mService.sendCommand("playback", "rewind");
                        super.onSkipToPrevious();
                    }
                });
            }
        });

        mediaSession.setFlags(
                MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS |
                        MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS);

        stateBuilder = new PlaybackStateCompat.Builder()
                .setActions(PlaybackStateCompat.ACTION_PLAY | PlaybackStateCompat.ACTION_PAUSE |
                            PlaybackStateCompat.ACTION_PLAY_PAUSE | PlaybackStateCompat.ACTION_SKIP_TO_NEXT |
                            PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)
                .setState(PlaybackStateCompat.STATE_PAUSED, PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, 0);

        mediaSession.setPlaybackState(stateBuilder.build());
        try {
            URL url = new URL("http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg");
            image = BitmapFactory.decodeStream(url.openConnection().getInputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
        meta = new MediaMetadataCompat.Builder();
        mediaSession.setMetadata(meta.build());

        builder = new NotificationCompat.Builder(mService)
                .setSmallIcon(R.drawable.ic_headset_white_48dp)
                .setStyle(new NotificationCompat.MediaStyle()
                .setMediaSession(mediaSession.getSessionToken()));

        Log.d("FOOBAR", "BUILT NOTIFY");

        PendingIntent contentIntent =
                PendingIntent.getActivity(mService, 0, new Intent(mService, MainActivity.class), 0);
        builder.setContentIntent(contentIntent);
    }

    private int mCurrent = -1;
    private int mDuration = -1;

    public void updatePlaybackPosition(Integer current, Integer duration) {
        if (duration / 1000 != mDuration) {
            mDuration = duration / 1000;
            meta.putLong(MediaMetadataCompat.METADATA_KEY_DURATION, mDuration);
            mediaSession.setMetadata(meta.build());
        }
        if (current / 1000 != mCurrent) {
            mCurrent = current / 1000;
            stateBuilder.setState(playing ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED, mCurrent, 1);
            mediaSession.setPlaybackState(stateBuilder.build());
        }
    }

    public void updatePlayState(Boolean isPlaying) {
        playing = isPlaying;
        stateBuilder.setState(playing ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED, pos, 1);
        mediaSession.setPlaybackState(stateBuilder.build());
        updateNotificationActions();
        showNotification();
    }

    public void updateMetaData(String title, String artist, String album, String albumArt) {
        Log.d("InternalMediaService", "Updating metadata: " + title + ", " + artist + ", " + album + ", " + albumArt);

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
        stateBuilder.setState(PlaybackStateCompat.STATE_PLAYING, 0, 1);
        mediaSession.setPlaybackState(stateBuilder.build());

        builder.setContentTitle(title)
                .setContentText(artist + " - " + album)
                .setOngoing(true)
                .setLargeIcon((image));

        updateNotificationActions();

        mediaSession.setActive(true);

        showNotification();
    }

    public void showNotification() {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(mService);
        notificationManager.notify(0, builder.build());
    }

    public void emitEvent(String evName) {
        sReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(evName, null);
    }

    private void updateNotificationActions() {
        builder.mActions = new ArrayList<>();

        Intent prevIntent = new Intent();
        prevIntent.setAction(PREV_INTENT_ACTION);
        PendingIntent pendPrevIntent = PendingIntent.getBroadcast(mService, 0, prevIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        Intent playIntent = new Intent();
        playIntent.setAction(PLAYPAUSE_INTENT_ACTION);
        PendingIntent pendPlayIntent = PendingIntent.getBroadcast(mService, 0, playIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        Intent nextIntent = new Intent();
        nextIntent.setAction(NEXT_INTENT_ACTION);
        PendingIntent pendNextIntent = PendingIntent.getBroadcast(mService, 0, nextIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        builder.addAction(R.drawable.ic_skip_previous_white_48dp, "Previous", pendPrevIntent)
                .addAction(playing ? R.drawable.ic_pause_white_48dp : R.drawable.ic_play_arrow_white_48dp, playing ? "Pause" : "Play", pendPlayIntent)
                .addAction(R.drawable.ic_skip_next_white_48dp, "Next", pendNextIntent);
    }

    public static void destroy() {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(mService);
        notificationManager.cancelAll();
        if (mediaSession != null) {
            mediaSession.setActive(false);
            mediaSession.release();
        }
    }
}
