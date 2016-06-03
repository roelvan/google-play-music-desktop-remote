import React, { Component, PropTypes } from 'react'
import { Image, ListView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import colors from '../theme/colors'

export default class SongList extends Component {
  static propTypes = {
    black: PropTypes.bool,
    data: PropTypes.object,
    handlePress: PropTypes.func
  }

  _formatTime (milli) {
    const seconds = Math.round((milli / 1000) % 60)
    return `${Math.floor(milli / 60000)}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  render () {
    const { black, data } = this.props

    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={data}
          style={{ flex: 1 }}
          renderRow={(track, sectionID, rowID) => {
            const srcObj = { uri: track.albumArt || 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg' }
            if (track.playing) {
              srcObj.uri = `https://play.google.com/music/ani_equalizer_${black ? 'black' : 'white'}_x2.gif`
            }
            return (
              <TouchableNativeFeedback
                onPress={this.props.handlePress(track)}
                background={TouchableNativeFeedback.SelectableBackground()}
              >
                <View>
                  <View style={styles.track}>
                    <Image source={srcObj} style={styles.trackImage} />
                    <View style={styles.trackMeta}>
                      <Text numberOfLines={1} style={{ fontSize: 18, color: black ? 'black' : 'white' }}>{track.title}</Text>
                      <Text numberOfLines={1} style={{ color: black ? 'black' : 'white' }}>{`${track.artist} - ${this._formatTime(track.duration)}`}</Text>
                    </View>
                  </View>
                </View>
              </TouchableNativeFeedback>
            )
          }}
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
