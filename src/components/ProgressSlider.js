import React, { PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { observer } from 'mobx-react/native'
import CustomSlider from './CustomSlider'
import colors from '../theme/colors'
import metrics from '../theme/metrics'

@observer
export default class ProgressSlider extends React.Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    onValueChange: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isTouched: false
    }
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.value === this.props.value || this.state.isTouched) {
      return false
    }
    this.refs.slider.value = nextProps.value
    return true
  }

  _handlePress = (value) => {
    this.setState({ isTouched: true })
  }

  _handleConfirm = (value) => {
    this.setState({ isTouched: false })
    this.props.onValueChange(value)
  }

  render () {
    const { min, max } = this.props
    return (
      <CustomSlider
        ref={'slider'}
        style={styles.slider}
        min={min}
        max={max}
        trackSize={6}
        onPress={this._handlePress}
        onConfirm={this._handleConfirm}
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
