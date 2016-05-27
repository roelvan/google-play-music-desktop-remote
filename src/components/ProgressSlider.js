import React, { PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { MKSlider } from 'react-native-material-kit'
import colors from '../theme/colors'
import metrics from '../theme/metrics'

export default class ProgressSlider extends React.Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    onTouchUp: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isTouched: false
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value) this.setValue(this.props.value)
  }

  setValue = (value) => {
    if (!this.state.isTouched) this.refs.slider.value = value
  }

  _handleTouchDown = (value) => {
    this.setState({ isTouched: true })
  }

  _handleTouchUp = (value) => {
    this.setState({ isTouched: false })
    this.props.onTouchUp(value)
  }

  render () {
    const { min, max } = this.props
    return (
      <MKSlider
        ref={'slider'}
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
    width: metrics.DEVICE_WIDTH + 30,
    marginLeft: -15,
    marginRight: -15,
    left: 0,
    elevation: 9
  }
})
