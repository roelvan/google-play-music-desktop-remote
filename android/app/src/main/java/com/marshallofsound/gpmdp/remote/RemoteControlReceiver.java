package com.marshallofsound.gpmdp.remote;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.view.KeyEvent;

import com.marshallofsound.gpmdp.remote.media.MediaModule;

public class RemoteControlReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_MEDIA_BUTTON.equals(intent.getAction())) {
            final KeyEvent event = intent.getParcelableExtra(Intent.EXTRA_KEY_EVENT);

            if (event != null && event.getAction() == KeyEvent.ACTION_DOWN) {
                switch (event.getKeyCode()) {
                    case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
                        MediaModule.sEmitEvent("play_pause_track", null);
                        break;
                }
            }
        }
        if (intent.getAction().equals(MediaModule.PREV_INTENT_ACTION)) {
            MediaModule.sEmitEvent("prev_track", null);
        } else if (intent.getAction().equals(MediaModule.PLAYPAUSE_INTENT_ACTION)) {
            MediaModule.sEmitEvent("play_pause_track", null);
        } else if (intent.getAction().equals(MediaModule.NEXT_INTENT_ACTION)) {
            MediaModule.sEmitEvent("next_track", null);
        }
    }
}
