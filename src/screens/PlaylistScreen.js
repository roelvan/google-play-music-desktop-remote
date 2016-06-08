import React, { Component, PropTypes } from 'react'
import { Image, ListView, StatusBar, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import { observer } from 'mobx-react/native'
import Toolbar from '../components/Toolbar'
import colors from '../theme/colors'
import SongList from '../components/SongList'

@observer
export default class PlaylistScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    playlist: PropTypes.object,
    themeStore: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  _formatTime (milli) {
    const seconds = Math.round((milli / 1000) % 60)
    return `${Math.floor(milli / 60000)}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  _handlePress = (track) => {
    return () => {
      this.props.webSocketStore.sendPlayPlaylistTrack({
        id: this.props.playlist.id,
        name: this.props.playlist.name
      }, track)
    }
  }

  render () {
    const { playlist, themeStore } = this.props
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })
    const cleanTracks = []
    for (let i = 0; i < playlist.tracks.length; i++) {
      const { id, title, artist, album, albumArt, duration, playCount } = playlist.tracks[i]
      cleanTracks.push({
        id,
        title,
        artist,
        album,
        albumArt,
        duration,
        playCount
      })
    }

    ds = ds.cloneWithRows(cleanTracks)

    return (
      <View style={[styles.container]}>
        <StatusBar animated backgroundColor={themeStore.barColor()} />
        <Toolbar title={playlist.name} navigator={this.props.navigator} color={themeStore.barColor()} />
        <View style={[styles.content, { backgroundColor: themeStore.backgroundColor() }]}>
          <SongList black={!(themeStore.themeEnabled && themeStore.themeType === 'FULL')} data={ds} handlePress={this._handlePress} />
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
  controlBar: {
    flex: 0,
    height: 100,
    elevation: 4
  },
  track: {
    margin: 10,
    height: 48,
    flex: 1,
    flexDirection: 'row'
  },
  trackImage: {
    height: 48,
    width: 48
  },
  trackMeta: {
    flex: 1,
    marginLeft: 16
  }
})
