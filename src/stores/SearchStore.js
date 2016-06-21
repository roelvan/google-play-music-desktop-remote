import { observable } from 'mobx'
import { ListView } from 'react-native'

export default class SearchStore {
  @observable searchText = ''
  albums = []
  @observable albumDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })
  artists = []
  @observable artistDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })
  tracks = []
  @observable trackDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })

  setSearchText = (newSearchText) => {
    this.searchText = newSearchText
  }

  setSearchResults = (results) => {
    this.albums = results.albums
    this.albumDataStore = this.albumDataStore.cloneWithRows(this.albums)
    this.artists = results.artists
    this.artistDataStore = this.artistDataStore.cloneWithRows(this.artists)
    this.tracks = results.tracks
    this.trackDataStore = this.trackDataStore.cloneWithRows(this.tracks.map((track) => Object.assign({}, track, { duration: track.duration * 1000 })))
  }
}
