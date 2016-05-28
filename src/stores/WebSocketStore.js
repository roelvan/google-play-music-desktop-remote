import { observable } from 'mobx'

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

  constructor (trackStore, ipAddress = TEST_IP_ADDRESS, port = TEST_PORT) {
    this.trackStore = trackStore
    this.ipAddress = ipAddress
    this.port = port
  }

  connect = () => {
    this.isConnecting = true
    this.webSocket = new WebSocket(`ws://${this.ipAddress}:${this.port}`)
    this.webSocket.onopen = this._onConnectionOpen
    this.webSocket.onerror = this._onConnectioError
    this.webSocket.onmessage = this._onMessage
    this.webSocket.onclose = this._onConnectionClose
  }

  _onConnectionOpen = () => {
    this.isConnecting = false
    this.isConnected = true
  }

  _onConnectionError = (error) => {
    this.isConnecting = false
    this.isConnected = false
  }

  _onConnectionClose = () => {
    this.isConnecting = false
    this.isConnected = false
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
      default: {
        console.log(`WebSocket message received, channel: ${channel}, payload: ${payload}`)
        break
      }
    }
  }

  sendPlay = () => {
    this._sendMessage({ namespace: 'playback', method: 'playPause' })
  }

  sendPrev = () => {
    this._sendMessage({ namespace: 'playback', method: 'prev' })
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
    this.webSocket.send(JSON.stringify(msg))
  }

}
