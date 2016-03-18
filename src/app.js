import React from 'react-native'
import HomeScreen from 'HomeScreen'
import { setTheme, MKColor } from 'react-native-material-kit'

setTheme({
  primaryColor: MKColor.Orange,
  primaryColorRGB: MKColor.RGBOrange,
  accentColor: MKColor.Amber
})

export default class App extends React.Component {
  render () {
    return (
      <HomeScreen />
    )
  }
}
