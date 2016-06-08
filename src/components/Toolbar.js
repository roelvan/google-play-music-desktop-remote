import React, { Component, PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../theme/colors'

export default class Toolbar extends Component {
  static propTypes = {
    color: PropTypes.string,
    drawerFunction: PropTypes.func,
    navigator: PropTypes.object,
    title: PropTypes.string,
    settingsMenu: PropTypes.bool,
    showDrawer: PropTypes.bool
  }

  _actionSelected = (actionIndex) => {
    switch (actionIndex) {
      case 0: {
        this.props.navigator.push({
          name: 'settings'
        })
        break
      }
      default: {
        break
      }
    }
  }

  _backButtonPressed = () => {
    this.props.navigator.pop()
  }

  render () {
    const { color, title, settingsMenu, showDrawer, drawerFunction } = this.props
    const actions = [
      {
        title: 'Settings'
      }
    ]

    return (
      <Icon.ToolbarAndroid
        navIconName={showDrawer ? 'md-menu' : 'md-arrow-back'}
        onIconClicked={showDrawer ? drawerFunction : this._backButtonPressed}
        style={[styles.toolbar, { backgroundColor: color }]}
        titleColor={'white'}
        title={title}
        actions={(settingsMenu ? actions : null)}
        onActionSelected={this._actionSelected}
      />
    )
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    elevation: 2
  }
})
