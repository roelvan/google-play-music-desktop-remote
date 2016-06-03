import React, { Component, PropTypes } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

export default class SongInfo extends Component {
  static propTypes = {
    album: PropTypes.string,
    artist: PropTypes.string,
    title: PropTypes.string,
    onPress: PropTypes.func
  }

  render () {
    const { title, artist, album } = this.props

    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.infoBar]}>
          <Text numberOfLines={1} style={{ fontSize: 18 }}>{title}</Text>
          <Text numberOfLines={1}>{`${artist || ''}${!artist || !album ? '' : ' - '}${album || ''}`}</Text>
        </View>
      </TouchableWithoutFeedback>
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
