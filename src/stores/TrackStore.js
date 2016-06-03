import { observable } from 'mobx'
import { ListView } from 'react-native'

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
  @observable playlists = []
  @observable playlistsDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })
  @observable queueDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })

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

  updatePlaylists = (playlists) => {
    const sortedPlaylists = playlists.sort((p1, p2) => p1.name.localeCompare(p2.name))
    this.playlists = sortedPlaylists
    this.playlistsDataStore = this.playlistsDataStore.cloneWithRows(sortedPlaylists)
  }

  updateQueue = (queue) => {
    this.queueDataStore = this.queueDataStore.cloneWithRows(queue)
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
