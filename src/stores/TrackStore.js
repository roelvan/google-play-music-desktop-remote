import { observable } from 'mobx'

export default class TrackStore {
  @observable title = ''
  @observable artist = ''
  @observable album = ''
  @observable albumArt = ''
  @observable repeatMode = ''
  @observable shuffleMode = ''
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

}
