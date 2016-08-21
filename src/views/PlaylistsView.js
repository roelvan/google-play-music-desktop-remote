import React, { Component, PropTypes } from 'react'
import { ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toolbar from '../components/Toolbar'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import CircleButton from '../components/CircleButton'

export default class PlaylistsView extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    playlistsDataStore: PropTypes.object,
    navigate: PropTypes.func,
    openDrawer: PropTypes.func,
    themeStore: PropTypes.object,
    webSocketStore: PropTypes.object,
    handleNavigate: PropTypes.func
  }

  _playPlaylist = (playlist) =>
    () => {
      this.props.webSocketStore.sendPlayPlaylist(playlist)
      this.props.handleNavigate('remote')
    }

  render () {
    const { playlistsDataStore, navigate, themeStore } = this.props
    const backgroundColor = themeStore.backgroundColor()
    const foreColor = themeStore.foreColor()

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Toolbar title={'Playlists'} navigator={this.props.navigator} color={themeStore.barColor()} settingsMenu showDrawer drawerFunction={() => { this.props.openDrawer() }} />
        <View style={styles.content}>
          <ListView
            dataSource={playlistsDataStore}
            enableEmptySections={true}
            style={{ backgroundColor }}
            renderRow={(playlist) => {
              return (
                <View>
                  <View style={styles.listItem}>
                    <CircleButton onPress={this._playPlaylist(playlist)} style={{ backgroundColor: themeStore.highlightColor() }} >
                      <IconMaterial name="play-arrow" size={26} color={foreColor} />
                    </CircleButton>
                    <TouchableOpacity
                      onPress={navigate(playlist)}
                    >
                      <Text style={[styles.listItemText, { color: foreColor }]}>{playlist.name}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  content: {
    flex: 1
  },
  listItem: {
    margin: 12,
    flex: 1,
    flexDirection: 'row'
  },
  listItemText: {
    marginLeft: 16,
    marginTop: 3
  }
})
