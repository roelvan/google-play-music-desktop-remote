import React, { PropTypes } from 'react'
import { Platform, View, TouchableNativeFeedback, TouchableOpacity } from 'react-native'

const IS_ANDROID = Platform.OS === 'android'
const IS_RIPPLE_EFFECT_SUPPORTED = Platform.Version >= 21 && IS_ANDROID

const TouchableView = ({ isRippleEnabled, children, style, ...props }) => {
  if (IS_RIPPLE_EFFECT_SUPPORTED && !isRippleEnabled) {
    const background = TouchableNativeFeedback.Ripple(null, false)
    return (
      <TouchableNativeFeedback {...props} background={background}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    )
  } else {
    return (
      <TouchableOpacity {...props} style={style}>
        {children}
      </TouchableOpacity>
    )
  }
}

TouchableView.propTypes = {
  isRippleEnabled: PropTypes.bool,
  children: PropTypes.any,
  style: View.propTypes.style
}

TouchableView.defaultProps = {
  isRippleEnabled: true
}

export default TouchableView
