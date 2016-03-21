/**
 * @providesModule ControlBar
 */
import React, { StyleSheet, Text, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import CircleButton from 'CircleButton'
import Icon from 'react-native-vector-icons/Entypo'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'

const theme = getTheme()

const playIcon = <Text>{' '}<Icon name='controller-play' size={42} color={colors.WHITE} /></Text>

const pauseIcon = <Text><Icon name='controller-paus' size={32} color={colors.WHITE} /></Text>

const prevIcon = <Icon name='controller-jump-to-start' size={26} color={colors.GREY_DARK} />

const nextIcon = <Icon name='controller-next' size={26} color={colors.GREY_DARK} />

export default ({ isPlaying, onPlayPress, onPrevPress, onNextPress }) =>
  <View style={[theme.cardStyle, styles.container]}>
      <CircleButton onPress={onPrevPress} size={42}>
        {prevIcon}
      </CircleButton>
      <CircleButton onPress={onPlayPress} size={68}>
        <View style={styles.playPauseButton}>
          {isPlaying ? pauseIcon : playIcon}
        </View>
      </CircleButton>
      <CircleButton onPress={onNextPress} size={42}>
        {nextIcon}
      </CircleButton>
  </View>

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 82,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playPauseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 27,
    backgroundColor: colors.ORANGE
  }
})
