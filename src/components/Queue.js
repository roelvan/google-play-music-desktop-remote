import React, { Component, PropTypes } from 'react'
import { Image, ListView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import { observer } from 'mobx-react/native'
import colors from '../theme/colors'

@observer
export default class PlaylistScreen extends Component {
  static propTypes = {
    data: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  _formatTime (milli) {
    const seconds = Math.round((milli / 1000) % 60)
    return `${Math.floor(milli / 60000)}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  _handlePress = (track) =>
    () => {
      this.props.webSocketStore.sendPlayQueueTrack(track)
    }

  render () {
    const { data } = this.props

    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={data}
          style={{ flex: 1 }}
          renderRow={(track) => (
            <TouchableNativeFeedback
              onPress={this._handlePress(track)}
              background={TouchableNativeFeedback.SelectableBackground()}
            >
              <View>
                <View style={styles.track}>
                  <Image source={{ uri: track.albumArt || 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg' }} style={styles.trackImage} />
                  <View style={styles.trackMeta}>
                    <Text numberOfLines={1} style={{ fontSize: 18, color: 'white' }}>{track.title}</Text>
                    <Text numberOfLines={1} style={{ color: 'white' }}>{`${track.artist} - ${this._formatTime(track.duration)}`}</Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          )}
        />
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
    flex: 1,
    backgroundColor: colors.GREY_LIGHTER
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
