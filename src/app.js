import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { setTheme, MKColor } from 'react-native-material-kit'
import HomeScreen from './screens/HomeScreen'
import PlaylistScreen from './screens/PlaylistScreen'
import SettingsScreen from './screens/SettingsScreen'
import SettingsStore from './stores/SettingsStore'
import TrackStore from './stores/TrackStore'
import WebSocketStore from './stores/WebSocketStore'

const settingsStore = new SettingsStore()
const trackStore = new TrackStore()
const webSocketStore = new WebSocketStore(trackStore)

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
              return (<PlaylistScreen navigator={navigator} webSocketStore={webSocketStore} playlist={route.playlist} />)
            }
            case 'settings': {
              return (<SettingsScreen navigator={navigator} settingsStore={settingsStore} />)
            }
            default:
            case 'remote': {
              return (<HomeScreen trackStore={trackStore} webSocketStore={webSocketStore} navigator={navigator} settingsStore={settingsStore} />)
            }
          }
        }}
      />
    )
  }
}
