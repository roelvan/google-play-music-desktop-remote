import { observable } from 'mobx'
import { DeviceEventEmitter, NativeModules } from 'react-native'
const { DeviceInfo } = NativeModules

export const TEST_IP_ADDRESS = '192.168.1.60'
export const TEST_PORT = 5672

export default class WebSocketStore {
  trackStore
  @observable ipAddress
  @observable port
  @observable webSocket = null
  @observable isConnecting = false
  @observable isConnected = false
  @observable lastMessage = null
  shouldReconnect = false

  constructor (trackStore, port = TEST_PORT) {
    this.trackStore = trackStore
    this.port = port

    this.hook()
  }

  hook = () => {
    DeviceEventEmitter.addListener('volume_up', () => {
      if (this.isConnected) {
        this._sendMessage({ namespace: 'volume', method: 'increaseVolume' })
      }
    })
    DeviceEventEmitter.addListener('volume_down', () => {
      if (this.isConnected) {
        this._sendMessage({ namespace: 'volume', method: 'decreaseVolume' })
      }
    })
  }

  connect (ip) {
    this.isConnecting = true
    try {
      this.ipAddress = ip
      this.webSocket = new WebSocket(`ws://${this.ipAddress}:${this.port}`)
      this.shouldReconnect = true
    } catch (err) {
      this.disconnect()
    }
    this.webSocket.onopen = this._onConnectionOpen
    this.webSocket.onerror = this._onConnectioError
    this.webSocket.onmessage = this._onMessage
    this.webSocket.onclose = this._onConnectionClose
  }

  disconnect = () => {
    this.shouldReconnect = false
    this.webSocket.close()
    this.webSocket = null
  }

  _onConnectionOpen = () => {
    this.isConnecting = false
    this.isConnected = true
    DeviceInfo.getDeviceName()
      .then((deviceName) => {
        this._sendMessage({ namespace: 'connect', method: 'connect', arguments: [deviceName] })
      })
  }

  _onConnectionError = (error) => {
    this.isConnecting = false
    this.isConnected = false
  }

  _onConnectionClose = () => {
    this.isConnecting = false
    this.isConnected = false

    // Reset the trackStore
    this.trackStore.reset()

    if (this.shouldReconnect) {
      this.connect(this.ipAddress)
    }
  }

  _onMessage = (msg) => {
    this.lastMessage = msg
    const { channel, payload } = JSON.parse(msg.data)
    switch (channel) {
      case 'song': {
        const { title, artist, album } = payload
        const albumArt = payload.albumArt && payload.albumArt.replace(/=s90-c-e100$/g, '')
        this.trackStore.changeTrack(title, artist, album, albumArt)
        this.trackStore.start()
        break
      }
      // API is glitched in an old release.  We should leave this here for historical reasons
      case 'playState':
      case 'state': {
        const isPlaying = payload
        this.trackStore.setPlayingStatus(isPlaying)
        break
      }
      case 'time': {
        this.trackStore.updateTime(payload.current, payload.total)
        this.trackStore.start()
        break
      }
      case 'shuffle': {
        this.trackStore.updateShuffleMode(payload)
        break
      }
      case 'repeat': {
        this.trackStore.updateRepeatMode(payload)
        break
      }
      case 'playlists': {
        this.trackStore.updatePlaylists(payload)
        break
      }
      case 'queue': {
        this.trackStore.updateQueue(payload)
        break
      }
      default: {
        if (channel === 'lyrics') return
        console.log(`WebSocket message received, channel: ${channel}, payload: ${payload}`)
        break
      }
    }
  }

  sendPlay = () => {
    this._sendMessage({ namespace: 'playback', method: 'playPause' })
  }

  sendPlayPlaylistTrack = (playlist, track) => {
    this._sendMessage({ namespace: 'playlists', method: 'playWithTrack', arguments: [playlist, track] })
  }

  sendPrev = () => {
    this._sendMessage({ namespace: 'playback', method: 'rewind' })
  }

  sendNext = () => {
    this._sendMessage({ namespace: 'playback', method: 'forward' })
  }

  sendGetShuffle = () => {
    this._sendMessage({ namespace: 'playback', method: 'getShuffle' })
  }

  sendToggleShuffle = () => {
    this._sendMessage({ namespace: 'playback', method: 'toggleShuffle' })
  }

  sendGetRepeat = () => {
    this._sendMessage({ namespace: 'playback', method: 'getRepeat' })
  }

  sendToggleRepeat = () => {
    this._sendMessage({ namespace: 'playback', method: 'toggleRepeat' })
  }

  sendSetTime = (time) => {
    this._sendMessage({ namespace: 'playback', method: 'setPlaybackTime', arguments: [time] })
    this.trackStore.stop()
  }

  _sendMessage = (msg) => {
    if (this.webSocket.readyState === 1) {
      this.webSocket.send(JSON.stringify(msg))
    }
  }

}
