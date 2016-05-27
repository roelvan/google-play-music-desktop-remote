import React, { PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import colors from '../theme/colors'

const CircleButton = ({ onPress, size, style, children }) => (
  <MKButton
    style={[{ width: size, height: size, borderRadius: size / 2 }, styles.container, style]}
    rippleColor={`rgba(${colors.GREY_RGB},.2)`}
    fab={true}
    onPress={onPress}
    rippleLocation={'center'}
  >
    {children}
  </MKButton>
)

CircleButton.propTypes = {
  onPress: PropTypes.func,
  size: PropTypes.number,
  style: PropTypes.any,
  children: PropTypes.node
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default CircleButton
