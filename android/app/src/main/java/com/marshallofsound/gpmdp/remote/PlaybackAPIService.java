package com.marshallofsound.gpmdp.remote;

import android.app.Service;
import android.content.Intent;
import android.media.AudioManager;
import android.os.IBinder;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.neovisionaries.ws.client.WebSocket;
import com.neovisionaries.ws.client.WebSocketException;
import com.neovisionaries.ws.client.WebSocketFactory;
import com.neovisionaries.ws.client.WebSocketFrame;
import com.neovisionaries.ws.client.WebSocketListener;
import com.neovisionaries.ws.client.WebSocketState;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class PlaybackAPIService extends Service implements AudioManager.OnAudioFocusChangeListener {
    private static final String TAG = "PlaybackAPIService";

    private boolean isRunning  = false;
    public static Thread t = null;
    private WebSocketFactory factory;
    public static WebSocket ws;
    private int ws_id_counter = 0;

    @Override
    public void onCreate() {
        Log.i(TAG, "Service onCreate");

        isRunning = true;
        factory = new WebSocketFactory();
        InternalMediaService.mService = this;
    }

    public void emitEvent(String evName, String msg) {
        Log.i(TAG, "Event: " + evName);
        Intent WebSocketMessage = new Intent("com.gpmdp.WebSocketEvent");
        WebSocketMessage.putExtra("evName", evName);
        WebSocketMessage.putExtra("msg", msg);
        LocalBroadcastManager.getInstance(this).sendBroadcast(WebSocketMessage);
    }

    public void sendCommand(String namespace, String method) {
        sendCommand(namespace, method, "[]");
    }

    public void sendCommand(String namespace, String method, String argArray) {
        if (ws != null) {
            ws.sendText("{\"namespace\": \"" + namespace + "\", \"method\": \"" + method + "\", \"arguments\": " + argArray + "}");
        }
    }

    @Override
    public int onStartCommand(final Intent intent, int flags, int startId) {
        if (intent != null && intent.hasExtra("command") && ws != null) {
            String command = intent.getStringExtra("command");
            switch (command) {
                case "prev_track":
                    sendCommand("playback", "rewind");
                    break;
                case "play_pause_track":
                    sendCommand("playback", "playPause");
                    break;
                case "next_track":
                    sendCommand("playback", "forward");
                    break;
            }
        }  else if (intent != null && intent.hasExtra("IP")) {
            if (t != null) {
                Log.d(TAG, "Killing existing thread");
                try {
                    ws.disconnect();
                    t.stop();
                    t.destroy();
                } catch (UnsupportedOperationException e) {
                    // Do nothing
                }
                t = null;
            }

            Log.i(TAG, "Service onStartCommand");

            //Creating new thread for my service
            //Always write your long running tasks in a separate thread, to avoid ANR
            t = new Thread(new Runnable() {
                private String WS_TAG = "PlaybackAPIServer_WS";
                private int ws_id = ++ws_id_counter;

                @Override
                public void run() {
                    String ip = intent.getStringExtra("IP");
                    Log.d(WS_TAG, "Connecting to " + ip);
                    if (ws != null) {
                        ws.disconnect();
                        ws = null;
                    }
                    try {
                        ws = factory.createSocket("ws://" + ip + ":5672");
                        ws.addListener(new WebSocketListener() {
                            @Override
                            public void onStateChanged(WebSocket websocket, WebSocketState newState) throws Exception {
                                Log.d(WS_TAG, newState.toString());
                            }

                            @Override
                            public void onConnected(WebSocket websocket, Map<String, List<String>> headers) throws Exception {
                                Log.d(WS_TAG, "OPEN");
                                if (ws_id == ws_id_counter) emitEvent("WebSocket:Open", null);
                                InternalMediaService.getInstance().createNotification();
                            }

                            @Override
                            public void onConnectError(WebSocket websocket, WebSocketException cause) throws Exception {
                                Log.d(WS_TAG, "ERROR");
                                if (ws_id == ws_id_counter) emitEvent("WebSocket:Error", null);
                                InternalMediaService.destroy();
                            }

                            @Override
                            public void onDisconnected(WebSocket websocket, WebSocketFrame serverCloseFrame, WebSocketFrame clientCloseFrame, boolean closedByServer) throws Exception {
                                Log.d(WS_TAG, "CLOSE");
                                if (ws_id == ws_id_counter) emitEvent("WebSocket:Close", null);
                                InternalMediaService.destroy();
                            }

                            @Override
                            public void onFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onContinuationFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onTextFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onBinaryFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onCloseFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onPingFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onPongFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onTextMessage(WebSocket websocket, String text) throws Exception {
                                if (ws_id == ws_id_counter) emitEvent("WebSocket:Message", text);
                                // Handle message internally
                                try {
                                    JSONObject o = new JSONObject(text);
                                    if (o.getString("channel").equals("track")) {
                                        JSONObject payload = o.getJSONObject("payload");
                                        InternalMediaService.getInstance().updateMetaData(
                                                payload.getString("title"),
                                                payload.getString("artist"),
                                                payload.getString("album"),
                                                payload.getString("albumArt")
                                        );
                                    } else if (o.getString("channel").equals("playState")) {
                                        InternalMediaService.getInstance().updatePlayState(
                                                o.getBoolean("payload")
                                        );
                                    } else if (o.getString("channel").equals("time")) {
                                        JSONObject payload = o.getJSONObject("payload");
                                        InternalMediaService.getInstance().updatePlaybackPosition(
                                                payload.getInt("current"),
                                                payload.getInt("total")
                                        );
                                    }
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }

                            @Override
                            public void onBinaryMessage(WebSocket websocket, byte[] binary) throws Exception {

                            }

                            @Override
                            public void onSendingFrame(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onFrameSent(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onFrameUnsent(WebSocket websocket, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onError(WebSocket websocket, WebSocketException cause) throws Exception {

                            }

                            @Override
                            public void onFrameError(WebSocket websocket, WebSocketException cause, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onMessageError(WebSocket websocket, WebSocketException cause, List<WebSocketFrame> frames) throws Exception {

                            }

                            @Override
                            public void onMessageDecompressionError(WebSocket websocket, WebSocketException cause, byte[] compressed) throws Exception {

                            }

                            @Override
                            public void onTextMessageError(WebSocket websocket, WebSocketException cause, byte[] data) throws Exception {

                            }

                            @Override
                            public void onSendError(WebSocket websocket, WebSocketException cause, WebSocketFrame frame) throws Exception {

                            }

                            @Override
                            public void onUnexpectedError(WebSocket websocket, WebSocketException cause) throws Exception {

                            }

                            @Override
                            public void handleCallbackError(WebSocket websocket, Throwable cause) throws Exception {

                            }

                            @Override
                            public void onSendingHandshake(WebSocket websocket, String requestLine, List<String[]> headers) throws Exception {

                            }
                        });
                        ws.connect();
                    } catch (IOException | WebSocketException e) {
                        Log.d(WS_TAG, "FAILED TO CONNECT TO " + ip);
                        ws.disconnect();
                        ws = null;
                    }
                    if (ws != null) {
                        Log.d(WS_TAG, "CONNECTED TO " + ip);
                    } else {
                        Log.d("Failed to connect", "Failed to connect");
                    }
                }
            });

            t.start();
        } else if (intent != null && intent.hasExtra("MSG")) {
            ws.sendText(intent.getStringExtra("MSG"));
        }

        return Service.START_STICKY;
    }


    @Override
    public IBinder onBind(Intent arg0) {
        Log.i(TAG, "Service onBind");
        return null;
    }

    @Override
    public void onDestroy() {

        isRunning = false;

        if (t != null) {
            try {
                t.stop();
                t.destroy();
            } catch (UnsupportedOperationException e) {
                // Do nothing
            }
            t = null;
        }

        InternalMediaService.destroy();

        Log.i(TAG, "Service onDestroy");
    }

    @Override
    public void onAudioFocusChange(int i) {
        // Do nothing
    }
}
