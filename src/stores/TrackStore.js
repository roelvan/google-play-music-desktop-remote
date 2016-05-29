import { observable } from 'mobx'

export default class TrackStore {
  @observable title = null
  @observable artist = null
  @observable album = null
  @observable albumArt = null
  @observable repeatMode = 'NO_REPEAT'
  @observable shuffleMode = 'NO_SHUFFLE'
  @observable isPlaying = false
  @observable isStopped = true
  @observable currentTime = 0
  @observable totalTime = 0

  changeTrack = (title, artist, album, albumArt) => {
    this.title = title
    this.artist = artist
    this.album = album
    this.albumArt = albumArt
  }

  setPlayingStatus = (isPlaying) => {
    this.isPlaying = isPlaying
  }

  updateTime = (currentTime, totalTime) => {
    this.currentTime = currentTime
    this.totalTime = totalTime
  }

  updateRepeatMode = (repeatMode) => {
    this.repeatMode = repeatMode
  }

  updateShuffleMode = (shuffleMode) => {
    this.shuffleMode = shuffleMode
  }

  start = () => {
    this.isStopped = false
  }

  stop = () => {
    this.isStopped = true
  }

  reset = () => {
    this.title = null
    this.artist = null
    this.album = null
    this.albumArt = null
    this.repeatMode = 'NO_REPEAT'
    this.shuffleMode = 'NO_SHUFFLE'
    this.isPlaying = false
    this.isStopped = true
    this.currentTime = 0
    this.totalTime = 0
  }
}
