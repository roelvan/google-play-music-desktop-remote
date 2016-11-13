package com.marshallofsound.gpmdp.connect;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.KeyEvent;

public class RemoteControlReceiver extends BroadcastReceiver {
    static String TAG = "RemoteControlReceiver";
    @Override
    public void onReceive(Context context, Intent intent) {
        if (InternalMediaService.sReactContext == null) return;
        Intent mIntent = new Intent(InternalMediaService.sReactContext, PlaybackAPIService.class);

        if (Intent.ACTION_MEDIA_BUTTON.equals(intent.getAction())) {
            final KeyEvent event = intent.getParcelableExtra(Intent.EXTRA_KEY_EVENT);

            if (event != null && event.getAction() == KeyEvent.ACTION_DOWN) {
                switch (event.getKeyCode()) {
                    case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
                    case KeyEvent.KEYCODE_MEDIA_PLAY:
                    case KeyEvent.KEYCODE_MEDIA_PAUSE:
                        mIntent.putExtra("command", "play_pause_track");
                        break;
                    case KeyEvent.KEYCODE_MEDIA_SKIP_BACKWARD:
                    case KeyEvent.KEYCODE_MEDIA_PREVIOUS:
                        mIntent.putExtra("command", "prev_track");
                        break;
                    case KeyEvent.KEYCODE_MEDIA_SKIP_FORWARD:
                    case KeyEvent.KEYCODE_MEDIA_NEXT:
                        mIntent.putExtra("command", "prev_track");
                        break;
                }
            }
        }

        if (mIntent.hasExtra("command")) {
            InternalMediaService.sReactContext.startService(mIntent);
            return;
        }

        if (intent.getAction().equals(InternalMediaService.PREV_INTENT_ACTION)) {
            mIntent.putExtra("command", "prev_track");
        } else if (intent.getAction().equals(InternalMediaService.PLAYPAUSE_INTENT_ACTION)) {
            Log.d(TAG, "Play_Pause Intent Recieved");
            mIntent.putExtra("command", "play_pause_track");
        } else if (intent.getAction().equals(InternalMediaService.NEXT_INTENT_ACTION)) {
            mIntent.putExtra("command", "next_track");
        } else {
            return;
        }
        InternalMediaService.sReactContext.startService(mIntent);
    }
}
