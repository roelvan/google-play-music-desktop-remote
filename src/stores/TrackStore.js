import { observable } from 'mobx'
import { ListView, NativeModules } from 'react-native'

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
  playlists = []
  @observable playlistsDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  queue = []
  @observable queueDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })

  changeTrack = (title, artist, album, albumArt) => {
    this.title = title
    this.artist = artist
    this.album = album
    this.albumArt = albumArt
    NativeModules.MediaAndroid.updateMetaData(title, artist, album, albumArt)
    this.updateQueue(this.queue)
  }

  setPlayingStatus = (isPlaying) => {
    this.isPlaying = isPlaying
    NativeModules.MediaAndroid.updatePlayState(isPlaying)
  }

  updateTime = (currentTime, totalTime) => {
    this.currentTime = currentTime
    this.totalTime = totalTime
    NativeModules.MediaAndroid.updatePlaybackPosition(currentTime, totalTime)
  }

  updateRepeatMode = (repeatMode) => {
    this.repeatMode = repeatMode
  }

  updateShuffleMode = (shuffleMode) => {
    this.shuffleMode = shuffleMode
  }

  forceUpdatePlaylists = () => {
    this.playlistsDataStore = this.playlistsDataStore.cloneWithRows(this.playlists.map((playlist) => Object.assign({}, playlist)))
  }

  updatePlaylists = (playlists) => {
    const sortedPlaylists = playlists.sort((p1, p2) => p1.name.localeCompare(p2.name)).map((playlist) => {
      let marked = false
      return Object.assign(playlist, { tracks: playlist.tracks.map((track) => {
        if (!marked && track.title === this.title && track.artist === this.artist && track.album === this.album) {
          marked = true
          return Object.assign({}, track, { playing: true })
        }
        return Object.assign({}, track, { playing: false })
      }) })
    })
    this.playlists = sortedPlaylists
    this.playlistsDataStore = this.playlistsDataStore.cloneWithRows(sortedPlaylists)
  }

  updateQueue = (queue) => {
    let marked = false
    this.queue = queue.map((track) => {
      if (!marked && track.title === this.title && track.artist === this.artist && track.album === this.album) {
        marked = true
        return Object.assign({}, track, { playing: true })
      }
      return Object.assign({}, track, { playing: false })
    })
    this.queueDataStore = this.queueDataStore.cloneWithRows(this.queue)
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
    this.playlistsDataStore = this.playlistsDataStore.cloneWithRows([])
    this.queueDataStore = this.queueDataStore.cloneWithRows([])
  }
}
