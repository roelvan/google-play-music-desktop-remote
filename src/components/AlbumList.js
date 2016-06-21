import React, { Component, PropTypes } from 'react'
import { Image, ListView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../theme/colors'

export default class AlbumList extends Component {
  static propTypes = {
    black: PropTypes.bool,
    data: PropTypes.object,
    handlePress: PropTypes.func
  }

  render () {
    const { black, data } = this.props

    return (
      <View style={{ flex: 1 }}>
        <ListView
          contentContainerStyle={styles.list}
          dataSource={data}
          style={{ flex: 1 }}
          renderRow={(album, sectionID, rowID) => {
            const srcObj = { uri: album.albumArt || 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg' }
            return (
              <TouchableOpacity
                onPress={this.props.handlePress(album)}
              >
                <View>
                  <View style={styles.album}>
                    <Image source={srcObj} style={{ height: 150, width: 150 }} />
                    <View style={styles.trackMeta}>
                      <Text numberOfLines={1} style={{ fontSize: 18, color: black ? 'black' : 'white', width: 150 }}>{album.name}</Text>
                      <Text numberOfLines={1} style={{ color: black ? 'black' : 'white', width: 150 }}>{`${album.artist}`}</Text>
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

export const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
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
  album: {
    width: 150,
    margin: 10,
    marginBottom: 18
  },
  albumImage: {
    flex: 0.5
  }
})
