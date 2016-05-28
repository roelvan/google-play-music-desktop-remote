/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha'
import { expect } from 'chai'
import TrackStore from '../../src/stores/TrackStore'

describe('Track Store', () => {
  it('creates the store', () => {
    const trackStore = new TrackStore()
    expect(trackStore.title).to.deep.equal('')
    expect(trackStore.artist).to.deep.equal('')
    expect(trackStore.album).to.deep.equal('')
    expect(trackStore.albumArt).to.deep.equal('')
    expect(trackStore.repeatMode).to.deep.equal('')
    expect(trackStore.shuffleMode).to.deep.equal('')
    expect(trackStore.isPlaying).to.be.false
    expect(trackStore.isStopped).to.be.true
    expect(trackStore.currentTime).to.deep.equal(0)
    expect(trackStore.totalTime).to.deep.equal(0)
  })

  it('changes the track', () => {
    const trackStore = new TrackStore()
    trackStore.changeTrack('testTitle', 'testArtist', 'testAlbum', 'testAlbumArt')
    expect(trackStore.title).to.deep.equal('testTitle')
    expect(trackStore.artist).to.deep.equal('testArtist')
    expect(trackStore.album).to.deep.equal('testAlbum')
    expect(trackStore.albumArt).to.deep.equal('testAlbumArt')
  })

  it('sets the playing status', () => {
    const trackStore = new TrackStore()
    trackStore.setPlayingStatus(true)
    expect(trackStore.isPlaying).to.be.true
  })

  it('updates the time', () => {
    const trackStore = new TrackStore()
    trackStore.updateTime(2, 8)
    expect(trackStore.currentTime).to.deep.equal(2)
    expect(trackStore.totalTime).to.deep.equal(8)
  })

  it('updates repeat mode', () => {
    const trackStore = new TrackStore()
    trackStore.updateRepeatMode('NO_REPEAT')
    expect(trackStore.repeatMode).to.deep.equal('NO_REPEAT')
  })

  it('updates shuffle mode', () => {
    const trackStore = new TrackStore()
    trackStore.updateShuffleMode('NO_SHUFFLE')
    expect(trackStore.shuffleMode).to.deep.equal('NO_SHUFFLE')
  })

  it('starts the track', () => {
    const trackStore = new TrackStore()
    trackStore.start()
    expect(trackStore.isStopped).to.deep.be.false
  })

  it('stops the track', () => {
    const trackStore = new TrackStore()
    trackStore.stop()
    expect(trackStore.isStopped).to.deep.be.true
  })
})
