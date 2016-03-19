/**
 * @providesModule PlayPauseButton
 */
import React, { StyleSheet, Text, View } from 'react-native'
import { MKButton } from 'react-native-material-kit'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'
import Icon from 'react-native-vector-icons/Entypo'

const playIcon =
  <Text>{' '}<Icon name='controller-play' size={42} color={colors.WHITE} /></Text>

const pauseIcon =
  <Text><Icon name='controller-paus' size={32} color={colors.WHITE} /></Text>

export default ({ isPlaying, onPress }) =>
  <MKButton
    style={styles.container}
    rippleColor={`rgba(${colors.GREY_RGB},.2)`}
    fab={true}
    onPress={onPress}
    rippleLocation='center'>
    <View style={styles.content}>
      {isPlaying ? pauseIcon : playIcon}
    </View>
  </MKButton>

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 68,
    height: 68,
    borderRadius: 34
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 27,
    backgroundColor: colors.ORANGE
  }
})
