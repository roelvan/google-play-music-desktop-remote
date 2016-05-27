import React, { Component } from 'react'
import { setTheme, MKColor } from 'react-native-material-kit'
import HomeScreen from './screens/HomeScreen'
import TrackStore from './stores/TrackStore'
import WebSocketStore from './stores/WebSocketStore'

const trackStore = new TrackStore()
const webSocketStore = new WebSocketStore(trackStore)

setTheme({
  primaryColor: MKColor.Orange,
  primaryColorRGB: MKColor.RGBOrange,
  accentColor: MKColor.Amber
})

export default class App extends Component {
  render () {
    return (
      <HomeScreen trackStore={trackStore} webSocketStore={webSocketStore} />
    )
  }
}
