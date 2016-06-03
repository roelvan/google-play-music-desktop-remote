import React, { Component, PropTypes } from 'react'
import { ListView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import colors from '../theme/colors'

export default class PlaylistNavigation extends Component {
  static propTypes = {
    playlistsDataStore: PropTypes.object,
    navigate: PropTypes.func
  }

  render () {
    const { playlistsDataStore, navigate } = this.props

    return (
      <ListView
        dataSource={playlistsDataStore}
        enableEmptySections={true}
        renderHeader={() => (
          <View style={styles.listItem}>
            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Playlists</Text>
          </View>
        )}
        renderRow={(playlist) => {
          return (
            <TouchableNativeFeedback
              onPress={navigate(playlist)}
              background={TouchableNativeFeedback.Ripple(colors.GREY_LIGHT, false)}
            >
              <View>
                <View style={styles.listItem}>
                  <Text>{playlist.name}</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          )
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    margin: 12
  }
})
