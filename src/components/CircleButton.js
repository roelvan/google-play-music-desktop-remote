import React, { PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import colors from '../theme/colors'


export default class CircleButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    size: PropTypes.number,
    style: PropTypes.any,
    children: PropTypes.node
  }

  render () {
    const { onPress, size, style, children } = this.props

    return (
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
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
