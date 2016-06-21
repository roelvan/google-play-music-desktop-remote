import React, { Component, PropTypes } from 'react'
import { Image, ListView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import { styles } from './AlbumList'

export default class ArtistList extends Component {
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
            const srcObj = { uri: album.image || 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg' }
            return (
              <TouchableNativeFeedback
                onPress={this.props.handlePress(album)}
                background={TouchableNativeFeedback.SelectableBackground()}
              >
                <View>
                  <View style={styles.album}>
                    <Image source={srcObj} style={{ height: 150, width: 150 }} />
                    <View style={styles.trackMeta}>
                      <Text numberOfLines={1} style={{ fontSize: 18, color: black ? 'black' : 'white', width: 150 }}>{album.name}</Text>
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
