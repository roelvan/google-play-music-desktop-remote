import React, { Component, PropTypes } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class SongInfo extends Component {
  static propTypes = {
    title: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string
  }

  render () {
    const { title, artist, album } = this.props

    return (
      <View style={[styles.infoBar]}>
        <Text numberOfLines={1} style={{ fontSize: 18 }}>{title}</Text>
        <Text numberOfLines={1}>{`${artist || ''}${!artist || !album ? '' : ' - '}${album || ''}`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  infoBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flex: 1
  }
})
