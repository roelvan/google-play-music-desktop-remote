import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { setTheme, MKColor } from 'react-native-material-kit'
import HomeScreen from './screens/HomeScreen'
import PlaylistScreen from './screens/PlaylistScreen'
import SearchStore from './stores/SearchStore'
import SearchScreen from './screens/SearchScreen'
import SettingsScreen from './screens/SettingsScreen'
import SettingsStore from './stores/SettingsStore'
import ThemeStore from './stores/ThemeStore'
import TrackStore from './stores/TrackStore'
import WebSocketStore from './stores/WebSocketStore'
import ZeroConfScreen from './screens/ZeroConfScreen'

const searchStore = new SearchStore()
const settingsStore = new SettingsStore()
const themeStore = new ThemeStore()
const trackStore = new TrackStore()
const webSocketStore = new WebSocketStore(trackStore, themeStore, searchStore)

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
        initialRoute={{ name: 'remote' }}
        renderScene={(route, navigator) => {
          switch (route.name) {
            case 'playlist': {
              return (<PlaylistScreen navigator={navigator} webSocketStore={webSocketStore} playlist={route.playlist} themeStore={themeStore} />)
            }
            case 'customip': {
              return (<SettingsScreen navigator={navigator} settingsStore={settingsStore} themeStore={themeStore} />)
            }
            case 'search': {
              return (<SearchScreen navigator={navigator} themeStore={themeStore} webSocketStore={webSocketStore} searchStore={searchStore} />)
            }
            case 'settings': {
              return (<ZeroConfScreen navigator={navigator} themeStore={themeStore} settingsStore={settingsStore} webSocketStore={webSocketStore} />)
            }
            default:
            case 'remote': {
              return (<HomeScreen trackStore={trackStore} webSocketStore={webSocketStore} navigator={navigator} settingsStore={settingsStore} themeStore={themeStore} />)
            }
          }
        }}
      />
    )
  }
}
