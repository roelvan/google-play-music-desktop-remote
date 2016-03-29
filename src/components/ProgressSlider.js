/** @providesModule ProgressSlider */
import React, { StyleSheet } from 'react-native'
import { MKSlider } from 'react-native-material-kit'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'
import dimensions from 'GooglePlayMusicDesktopRemote/src/config/dimensions'

export default class ProgressSlider extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isTouched: false
    }
  }

  setValue = (value) => {
    if (!this.state.isTouched) this.sliderRef.value = value
  }

  _handleTouchDown = (value) =>
    this.setState({ isTouched: true })

  _handleTouchUp = (value) => {
    this.setState({ isTouched: false })
    this.props.onTouchUp(value)
  }

  render () {
    const { min, max } = this.props
    return (
      <MKSlider
        ref={r => this.sliderRef = r}
        style={styles.slider}
        min={min}
        max={max}
        trackSize={6}
        onTouchDown={this._handleTouchDown}
        onTouchUp={this._handleTouchUp}
        upperTrackColor={colors.WHITE}
        lowerTrackColor={colors.ORANGE}
      />
    )
  }
}

const styles = StyleSheet.create({
  slider: {
    position: 'absolute',
    bottom: 82,
    width: dimensions.DEVICE_WIDTH + 30,
    marginLeft: -15,
    marginRight: -15,
    left: 0,
    elevation: 9
  }
})
