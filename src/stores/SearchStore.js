import { observable } from 'mobx'
import { ListView } from 'react-native'

export default class SearchStore {
  @observable searchText = ''
  @observable albums = []
  @observable artists = []
  tracks = []
  @observable trackDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })

  setSearchText = (newSearchText) => {
    this.searchText = newSearchText
  }

  setSearchResults = (results) => {
    this.albums = results.albums
    this.artists = results.artists
    this.tracks = results.tracks
    this.trackDataStore = this.trackDataStore.cloneWithRows(this.tracks.map((track) => Object.assign({}, track, { duration: track.duration * 1000 })))
  }
}
