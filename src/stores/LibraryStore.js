import { observable } from 'mobx'
import { ListView } from 'react-native'

export default class LibraryStore {
  albums = []
  @observable albumDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })
  artists = []
  @observable artistDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })
  @observable tracks = []
  // trackDataStore = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })

  setLibrary = (library) => {
    library.albums.sort((a1, a2) => a1.name.localeCompare(a2.name))
    this.albums = library.albums
    this.albumDataStore = this.albumDataStore.cloneWithRows(this.albums)
    library.artists.sort((a1, a2) => a1.name.localeCompare(a2.name))
    this.artists = library.artists
    this.artistDataStore = this.artistDataStore.cloneWithRows(this.artists)
    library.tracks.sort((t1, t2) => t1.title.localeCompare(t2.title))
    this.tracks = library.tracks
    // this.trackDataStore = this.trackDataStore.cloneWithRows(this.tracks.map((track) => Object.assign({}, track, { duration: track.duration * 1000 })))
  }
}
