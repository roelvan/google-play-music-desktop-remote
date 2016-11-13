import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { setTheme, MKColor } from 'react-native-material-kit'
import HomeScreen from './screens/HomeScreen'
import PlaylistScreen from './screens/PlaylistScreen'
import SearchStore from './stores/SearchStore'

import LibraryStore from './stores/LibraryStore'
import SettingsStore from './stores/SettingsStore'
import SignInScreen from './screens/SignInScreen'
import ThemeStore from './stores/ThemeStore'
import TrackStore from './stores/TrackStore'
import WebSocketStore from './stores/WebSocketStore'

const libraryStore = new LibraryStore()
const searchStore = new SearchStore()
const settingsStore = new SettingsStore()
const themeStore = new ThemeStore()
const trackStore = new TrackStore()
const webSocketStore = new WebSocketStore(trackStore, themeStore, searchStore, libraryStore)

setTheme({
  primaryColor: MKColor.Orange,
  primaryColorRGB: MKColor.RGBOrange,
  accentColor: MKColor.Amber
})

export default class App extends Component {
  constructor (...args) {
    super(...args)

    this.state = {
      loaded: false
    }
  }

  async componentDidMount () {
    await settingsStore.init()
    setTimeout(() => {
      this.setState({
        loaded: true
      })
    }, 0)
  }

  render () {
    if (!this.state.loaded) return null
    return (
      <Navigator
        initialRoute={{ name: 'signin' }}
        renderScene={(route, navigator) => {
          switch (route.name) {
            case 'playlist': {
              return (<PlaylistScreen navigator={navigator} webSocketStore={webSocketStore} playlist={route.playlist} themeStore={themeStore} />)
            }
            case 'remote': {
              return (<HomeScreen libraryStore={libraryStore} searchStore={searchStore} trackStore={trackStore} webSocketStore={webSocketStore} navigator={navigator} settingsStore={settingsStore} themeStore={themeStore} />)
            }
            default:
            case 'signin': {
              return <SignInScreen navigator={navigator} settingsStore={settingsStore} themeStore={themeStore} webSocketStore={webSocketStore} />
            }
          }
        }}
      />
    )
  }
}
