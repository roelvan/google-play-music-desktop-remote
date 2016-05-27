import React, { PropTypes } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IconEntypo from 'react-native-vector-icons/Entypo'
import colors from '../theme/colors'

const PlayPauseButton = ({ isPlaying, isStopped }) => {
  const playIcon = (
    <View style={[styles.playPauseButton, styles.playIcon]}>
      <Text>
        {' '}<IconEntypo name={'controller-play'} size={40} color={colors.WHITE} />
      </Text>
    </View>
  )

  const pauseIcon = (
    <View style={[styles.playPauseButton, styles.pauseIcon]}>
      <IconEntypo name={'controller-paus'} size={32} color={colors.WHITE} />
    </View>
  )

  const greyIcon = (
    <View style={[styles.playPauseButton, styles.greyIcon]}>
      <Text>
        {' '}<IconEntypo name={'controller-play'} size={40} color={colors.WHITE} />
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

PlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool,
  isStopped: PropTypes.bool
}

const styles = StyleSheet.create({
  playPauseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 27
  },
  playIcon: { backgroundColor: colors.ORANGE },
  pauseIcon: { backgroundColor: colors.ORANGE },
  greyIcon: { backgroundColor: colors.GREY_LIGHT }
})

export default PlayPauseButton
