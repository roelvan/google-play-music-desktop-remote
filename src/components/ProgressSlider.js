import React, { PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { observer } from 'mobx-react/native'
import CustomSlider from './CustomSlider'
import colors from '../theme/colors'
import metrics from '../theme/metrics'

@observer
export default class ProgressSlider extends React.Component {
  static propTypes = {
    highlightColor: PropTypes.string,
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
    this.refs.slider._internalSetValue(nextProps.value, false)
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
    const { highlightColor, min, max, value } = this.props
    return (
      <CustomSlider
        ref={'slider'}
        style={styles.slider}
        min={min}
        max={max}
        value={value}
        trackSize={6}
        onPress={this._handlePress}
        onConfirm={this._handleConfirm}
        upperTrackColor="rgba(0, 0, 0, 0)"
        lowerTrackColor={highlightColor}
      />
    )
  }
}

const styles = StyleSheet.create({
  slider: {
    marginLeft: -18,
    marginRight: -18
  }
})
