/* eslint-disable no-unused-expressions */
import { beforeEach, describe, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'
import TrackStore from '../../src/stores/TrackStore'
import WebSocketStore, { TEST_IP_ADDRESS, TEST_PORT } from '../../src/stores/WebSocketStore'

describe('WebSocket Store - Connection', () => {
  it('creates the store with defaults', () => {
    const webSocketStore = new WebSocketStore()
    expect(webSocketStore.trackStore).to.be.undefined
    expect(webSocketStore.ipAddress).to.deep.equal(TEST_IP_ADDRESS)
    expect(webSocketStore.port).to.deep.equal(TEST_PORT)
    expect(webSocketStore.webSocket).to.be.null
    expect(webSocketStore.isConnecting).to.be.false
    expect(webSocketStore.isConnected).to.be.false
    expect(webSocketStore.lastMessage).to.be.null
  })

  it('creates the store with parameters', () => {
    const trackStore = new TrackStore()
    const webSocketStore = new WebSocketStore(trackStore, 'testIpAddress', 'testPort')
    expect(webSocketStore.trackStore).to.deep.equal(trackStore)
    expect(webSocketStore.ipAddress).to.deep.equal('testIpAddress')
    expect(webSocketStore.port).to.deep.equal('testPort')
    expect(webSocketStore.webSocket).to.be.null
    expect(webSocketStore.isConnecting).to.be.false
    expect(webSocketStore.isConnected).to.be.false
    expect(webSocketStore.lastMessage).to.be.null
  })

  it('connects', () => {
    const webSocketStore = new WebSocketStore()
    webSocketStore.connect()
    expect(webSocketStore.isConnecting).to.be.true
    expect(webSocketStore.webSocket.ip).to.deep.equal(`ws://${TEST_IP_ADDRESS}:${TEST_PORT}`)
  })

  it('opens connection', () => {
    const webSocketStore = new WebSocketStore()
    webSocketStore.connect()
    webSocketStore._onConnectionOpen()
    expect(webSocketStore.isConnecting).to.be.false
    expect(webSocketStore.isConnected).to.be.true
  })

  it('handles a connection error', () => {
    const webSocketStore = new WebSocketStore()
    webSocketStore.connect()
    webSocketStore._onConnectionError()
    expect(webSocketStore.isConnecting).to.be.false
    expect(webSocketStore.isConnected).to.be.false
  })

  it('closes connection', () => {
    const webSocketStore = new WebSocketStore()
    webSocketStore.connect()
    webSocketStore._onConnectionClose()
    expect(webSocketStore.isConnecting).to.be.false
    expect(webSocketStore.isConnected).to.be.false
  })
})

describe('WebSocket Store - Receive messages', () => {
  let trackStore
  let webSocketStore

  beforeEach((done) => {
    trackStore = new TrackStore()
    trackStore.changeTrack = sinon.spy()
    trackStore.updateTime = sinon.spy()
    trackStore.setPlayingStatus = sinon.spy()
    trackStore.updateShuffleMode = sinon.spy()
    trackStore.updateRepeatMode = sinon.spy()
    trackStore.start = sinon.spy()
    webSocketStore = new WebSocketStore(trackStore)
    webSocketStore.connect()
    webSocketStore._onConnectionOpen()
    done()
  })

  it('handles a song message', () => {
    const data = JSON.stringify({
      channel: 'song',
      payload: {
        title: 'testTitle',
        artist: 'testArtist',
        album: 'testAlbum',
        albumArt: 'https://test.com/test'
      }
    })
    webSocketStore._onMessage({ data })
    expect(trackStore.changeTrack.calledWithExactly(
      'testTitle',
      'testArtist',
      'testAlbum',
      'https://test.com/test'
    )).to.be.true
    expect(trackStore.start.calledOnce).to.be.true
  })

  it('handles a time message', () => {
    const data = JSON.stringify({
      channel: 'time',
      payload: { current: 1, total: 12 }
    })
    webSocketStore._onMessage({ data })
    expect(trackStore.updateTime.calledWithExactly(1, 12)).to.be.true
    expect(trackStore.start.calledOnce).to.be.true
  })

  it('handles a state message', () => {
    const data = JSON.stringify({
      channel: 'state',
      payload: true
    })
    webSocketStore._onMessage({ data })
    expect(trackStore.setPlayingStatus.calledWithExactly(true)).to.be.true
  })

  it('handles a shuffle message', () => {
    const data = JSON.stringify({
      channel: 'shuffle',
      payload: 'NO_SHUFFLE'
    })
    webSocketStore._onMessage({ data })
    expect(trackStore.updateShuffleMode.calledWithExactly('NO_SHUFFLE')).to.be.true
  })

  it('handles a repeat message', () => {
    const data = JSON.stringify({
      channel: 'repeat',
      payload: 'NO_REPEAT'
    })
    webSocketStore._onMessage({ data })
    expect(trackStore.updateRepeatMode.calledWithExactly('NO_REPEAT')).to.be.true
  })
})

describe('WebSocket Store - Send messages', () => {
  let trackStore
  let webSocketStore

  beforeEach((done) => {
    trackStore = new TrackStore()
    trackStore.stop = sinon.spy()
    webSocketStore = new WebSocketStore(trackStore)
    webSocketStore.connect()
    webSocketStore._onConnectionOpen()
    done()
  })

  it('sends a play message', () => {
    webSocketStore.sendPlay()
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'playPause' })
    )
  })

  it('sends a prev message', () => {
    webSocketStore.sendPrev()
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'prev' })
    )
  })

  it('sends a next message', () => {
    webSocketStore.sendNext()
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'forward' })
    )
  })

  it('sends a getShuffle message', () => {
    webSocketStore.sendGetShuffle()
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'getShuffle' })
    )
  })

  it('sends a toggleShuffle message', () => {
    webSocketStore.sendToggleShuffle()
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'toggleShuffle' })
    )
  })

  it('sends a getRepeat message', () => {
    webSocketStore.sendGetRepeat()
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'getRepeat' })
    )
  })

  it('sends a toggleRepeat message', () => {
    webSocketStore.sendToggleRepeat()
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'toggleRepeat' })
    )
  })

  it('sends a setTime message', () => {
    webSocketStore.sendSetTime(100)
    expect(webSocketStore.webSocket.lastmessage).to.deep.equal(
      JSON.stringify({ namespace: 'playback', method: 'setPlaybackTime', arguments: [100] })
    )
    expect(trackStore.stop.calledOnce).to.be.true
  })
})
