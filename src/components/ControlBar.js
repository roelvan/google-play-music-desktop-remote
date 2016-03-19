/**
 * @providesModule ControlBar
 */
import React, { StyleSheet, Text, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import TouchableView from 'TouchableView'
import PlayPauseButton from 'PlayPauseButton'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'

const theme = getTheme()

export default ({ onPlayPress, onPrevPress, onNextPress }) =>
  <View style={[theme.cardStyle, styles.container]}>
      <TouchableView onPress={onPrevPress}>
        <Text>Prev</Text>
      </TouchableView>
      <PlayPauseButton onPress={onPlayPress} />
      <TouchableView onPress={onNextPress}>
        <Text>Next</Text>
      </TouchableView>
  </View>

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 82,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
