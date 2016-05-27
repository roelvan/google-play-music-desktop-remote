import React, { Component, PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../theme/colors'

export default class Toolbar extends Component {
  static propTypes = {
    title: PropTypes.string,
    onLeftPress: PropTypes.func,
    showDrawer: PropTypes.bool
  }

  render () {
    const { title, onLeftPress } = this.props
    return (
      <Icon.ToolbarAndroid
        navIconName={'md-arrow-back'}
        onIconClicked={onLeftPress}
        style={styles.toolbar}
        titleColor={'white'}
        title={title}
      />
    )
  }
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: colors.ORANGE,
    height: 56,
    elevation: 2
  }
})
