import React, { Component, PropTypes } from 'react'
import { Image, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../theme/colors'

export default class SongList extends Component {
  static propTypes = {
    alphabet: PropTypes.bool,
    black: PropTypes.bool,
    handlePress: PropTypes.func
  }

  _formatTime (milli) {
    const seconds = Math.round((milli / 1000) % 60)
    return `${Math.floor(milli / 60000)}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  render () {
    const { black, data } = this.props // eslint-disable-line

    let theData = data
    if (Array.isArray(theData)) {
      theData = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id })
      theData = theData.cloneWithRows(data)
    }

    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={theData}
          style={{ flex: 1 }}
          renderRow={(track, sectionID, rowID) => {
            console.log('RENDER ROW')
            const srcObj = { uri: track.albumArt || 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg' }
            if (track.playing) {
              srcObj.uri = `https://play.google.com/music/ani_equalizer_${black ? 'black' : 'white'}_x2.gif`
            }
            return (
              <TouchableOpacity
                onPress={this.props.handlePress(track)}
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
              </TouchableOpacity>
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
