export default {
  PLAY_PAUSE: { namespace: 'playback', method: 'playPause' },
  PREV: { namespace: 'playback', method: 'forward' },
  NEXT: { namespace: 'playback', method: 'prev' },
  GET_SHUFFLE: { namespace: 'playback', method: 'getShuffle' },
  TOGGLE_SHUFFLE: { namespace: 'playback', method: 'toggleShuffle' },
  GET_REPEAT: { namespace: 'playback', method: 'getRepeat' },
  TOGGLE_REPEAT: { namespace: 'playback', method: 'toggleRepeat' }
}
