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
                        InternalMediaService.getInstance().emitEvent("play_pause_track");
                        break;
                }
            }
        }
        if (intent.getAction().equals(InternalMediaService.PREV_INTENT_ACTION)) {
            InternalMediaService.getInstance().emitEvent("prev_track");
        } else if (intent.getAction().equals(InternalMediaService.PLAYPAUSE_INTENT_ACTION)) {
            InternalMediaService.getInstance().emitEvent("play_pause_track");
        } else if (intent.getAction().equals(InternalMediaService.NEXT_INTENT_ACTION)) {
            InternalMediaService.getInstance().emitEvent("next_track");
        }
    }
}
