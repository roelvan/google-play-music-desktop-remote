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

  setValue = value => {
    if (!this.state.isTouched) this.sliderRef.value = value
  }

  render () {
    const { min, max, onChange, onTouchUp } = this.props
    return (
      <MKSlider
        ref={r => this.sliderRef = r}
        style={styles.slider}
        min={min}
        max={max}
        trackSize={6}
        onChange={onChange}
        onTouchUp={onTouchUp}
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
