/**
 * @providesModule CircleButton
 */
import React, { StyleSheet } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'

export default ({ onPress, size, style, children }) =>
  <MKButton
    style={[{ width: size, height: size, borderRadius: size / 2 }, styles.container, style]}
    rippleColor={`rgba(${colors.GREY_RGB},.2)`}
    fab={true}
    onPress={onPress}
    rippleLocation='center'>
    {children}
  </MKButton>

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
