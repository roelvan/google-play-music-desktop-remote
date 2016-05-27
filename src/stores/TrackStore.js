import { observable } from 'mobx'

export default class TrackStore {
  @observable title = ''
  @observable artist = ''
  @observable album = ''
  @observable albumArt = ''
  @observable shuffleStatus = ''
  @observable repeatStatus = ''
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

  start = () => {
    this.isStopped = false
  }

  stop = () => {
    this.isStopped = true
  }

}
