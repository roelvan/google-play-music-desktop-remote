import React, { Component } from 'react'
import { setTheme, MKColor } from 'react-native-material-kit'
import HomeScreen from './screens/HomeScreen'

setTheme({
  primaryColor: MKColor.Orange,
  primaryColorRGB: MKColor.RGBOrange,
  accentColor: MKColor.Amber
})

export default class App extends Component {
  render () {
    return (
      <HomeScreen />
    )
  }
}
