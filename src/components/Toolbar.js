import React, { Component, PropTypes } from 'react'
import { Platform, TabBarIOS, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../theme/colors'

export default class Toolbar extends Component {
  static propTypes = {
    backFn: PropTypes.func,
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
    if (this.props.backFn) {
      this.props.backFn()
    } else {
      this.props.navigator.pop()
    }
  }

  render () {
    const { color, title, settingsMenu, showDrawer, drawerFunction } = this.props
    const actions = [
      {
        title: 'Settings'
      }
    ]

    if (Platform.OS === 'android') {
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
    const search = settingsMenu ? (
      <TouchableOpacity onPress={() => this.props.navigator.push({ name: 'search' })}>
        <Icon color="white" size={22} name="md-search" style={{ flex: 0, marginLeft: 14, width: 24 }} />
      </TouchableOpacity>
    ) : null
    const settings = settingsMenu ? (
      <TouchableOpacity onPress={() => this.props.navigator.push({ name: 'settings' })}>
        <Icon color="white" size={22} name="md-settings" style={{ flex: 0, marginHorizontal: 14, width: 24 }} />
      </TouchableOpacity>
    ) : null
    return (
      <View style={[styles.toolbar, { backgroundColor: color, paddingTop: 22 }]}>
        <TouchableOpacity onPress={showDrawer ? drawerFunction : this._backButtonPressed}>
          <Icon color="white" size={22} name={showDrawer ? 'md-menu' : 'md-arrow-back'} style={{ flex: 0, marginLeft: 14, width: 24 }} />
        </TouchableOpacity>
        <Text style={{ color: 'white', marginLeft: 8, fontSize: 22, flex: 1 }}>{title}</Text>
        {search}
        {settings}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start'
  }
})
