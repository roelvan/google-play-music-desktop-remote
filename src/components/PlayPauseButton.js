import React, { PropTypes } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IconEntypo from 'react-native-vector-icons/Entypo'
import colors from '../theme/colors'


export default class PlayPauseButton extends React.Component {
  static propTypes = {
    isPlaying: PropTypes.bool,
    isStopped: PropTypes.bool,
    landscape: PropTypes.bool
  }

  render () {
    const { isPlaying, isStopped, landscape } = this.props

    const playIcon = (
      <View style={[landscape ? styles.playPauseButtonLandscape : styles.playPauseButton, styles.playIcon]}>
        <Text>
          {' '}<IconEntypo name={'controller-play'} size={landscape ? 26 : 40} color={colors.WHITE} />
        </Text>
      </View>
    )

    const pauseIcon = (
      <View style={[landscape ? styles.playPauseButtonLandscape : styles.playPauseButton, styles.pauseIcon]}>
        <IconEntypo name={'controller-paus'} size={landscape ? 26 : 40} color={colors.WHITE} />
      </View>
    )

    const greyIcon = (
      <View style={[landscape ? styles.playPauseButtonLandscape : styles.playPauseButton, styles.greyIcon]}>
        <Text>
          {' '}<IconEntypo name={'controller-play'} size={landscape ? 26 : 40} color={colors.WHITE} />
        </Text>
      </View>
    )

    if (isStopped) {
      return greyIcon
    } else if (isPlaying) {
      return pauseIcon
    } else {
      return playIcon
    }
  }
}

const styles = StyleSheet.create({
  playPauseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 27
  },
  playPauseButtonLandscape: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
    borderRadius: 19
  },
  playIcon: { backgroundColor: colors.ORANGE },
  pauseIcon: { backgroundColor: colors.ORANGE },
  greyIcon: { backgroundColor: colors.GREY_LIGHT }
})
