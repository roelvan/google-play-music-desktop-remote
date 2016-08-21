import React, { Component, PropTypes } from 'react'
import { BackAndroid, StatusBar, StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react/native'
import DrawerLayout from 'react-native-drawer-layout'
import Navigation from '../components/Navigation'

import PlaylistsView from '../views/PlaylistsView'
import RemoteView from '../views/RemoteView'
import SearchView from '../views/SearchView'
import TracksView from '../views/TracksView'

@observer
export default class HomeScreen extends Component {
  static propTypes = {
    libraryStore: PropTypes.object,
    navigator: PropTypes.object,
    searchStore: PropTypes.object,
    settingsStore: PropTypes.object,
    trackStore: PropTypes.object,
    themeStore: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  constructor (...args) {
    super(...args)

    this.state = {
      view: 'remote'
    }
  }

  componentDidMount () {
    const { webSocketStore, settingsStore } = this.props
    webSocketStore.connect(settingsStore.IP_ADDRESS)
    this.CONNECTED_IP = settingsStore.IP_ADDRESS

    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        this.props.navigator.pop()
        return true
      }
      return false
    })
  }

  componentDidUpdate () {
    const { webSocketStore, settingsStore } = this.props
    if (this.CONNECTED_IP !== settingsStore.IP_ADDRESS) {
      webSocketStore.disconnect()
      webSocketStore.connect(settingsStore.IP_ADDRESS)
      this.CONNECTED_IP = settingsStore.IP_ADDRESS
    }
  }

  _handleNavigation = (viewName) => {
    this.refs.drawer.closeDrawer()
    this.setState({
      view: viewName
    })
  }

  _handlePlaylistNavigation = (playlist) =>
    () => {
      this.refs.drawer.closeDrawer()
      this.props.navigator.push({
        name: 'playlist',
        playlist: playlist, // eslint-disable-line
      })
    }

  render () {
    const { themeStore } = this.props

    const props = {
      openDrawer: () => this.refs.drawer.openDrawer()
    }

    let view
    switch (this.state.view) {
      case 'tracks': {
        view = (
          <TracksView
            navigator={this.props.navigator} settingsStore={this.props.settingsStore}
            trackStore={this.props.trackStore} themeStore={this.props.themeStore}
            webSocketStore={this.props.webSocketStore} libraryStore={this.props.libraryStore}
            {...props}
          />
        )
        break
      }
      case 'playlists': {
        view = (
          <PlaylistsView
            playlistsDataStore={this.props.trackStore.playlistsDataStore} themeStore={this.props.themeStore}
            navigate={this._handlePlaylistNavigation} webSocketStore={this.props.webSocketStore}
            handleNavigate={this._handleNavigation}
            {...props}
          />
        )
        break
      }
      case 'search': {
        view = (
          <SearchView
            navigator={this.props.navigator} settingsStore={this.props.settingsStore}
            trackStore={this.props.trackStore} themeStore={this.props.themeStore}
            webSocketStore={this.props.webSocketStore} searchStore={this.props.searchStore}
            {...props}
          />
        )
        break
      }
      case 'remote':
      default: {
        view = (
          <RemoteView
            navigator={this.props.navigator} settingsStore={this.props.settingsStore}
            trackStore={this.props.trackStore} themeStore={this.props.themeStore}
            webSocketStore={this.props.webSocketStore} {...props}
          />
        )
      }
    }

    return (
      <DrawerLayout
        ref="drawer"
        drawerWidth={300}
        drawerPosition={DrawerLayout.positions.Left}
        renderNavigationView={() =>
          <Navigation
            backgroundColor={themeStore.backgroundColor()} foreColor={themeStore.foreColor()}
            navigate={this._handleNavigation} active={this.state.view}
          />}
      >
        <View style={[styles.container, { backgroundColor: this.props.themeStore.backgroundColor() }]}>
          <StatusBar animated hidden={this.state.bouncing} backgroundColor={this.props.themeStore.barColor()} />
          {
            view
          }
        </View>
      </DrawerLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch'
  }
})
