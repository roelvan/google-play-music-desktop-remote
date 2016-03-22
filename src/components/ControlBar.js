/**
 * @providesModule ControlBar
 */
import React, { StyleSheet, Text, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import CircleButton from 'CircleButton'
import PlayPauseButton from 'PlayPauseButton'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'

const theme = getTheme()

export default class ControlBar extends React.Component {

  static propTypes = {
    isPlaying: React.PropTypes.bool,
    isStopped: React.PropTypes.bool,
    onPlayPress: React.PropTypes.func,
    onPrevPress: React.PropTypes.func,
    onNextPress: React.PropTypes.func,
    onRepeatPress: React.PropTypes.func,
    onShufflePress: React.PropTypes.func
  }

  static defaultProps = {
    isPlaying: false,
    isStopped: true
  }

  render = () => {
    console.log(isStopped)
    const { onPlayPress, onPrevPress, onNextPress, onRepeatPress, onShufflePress, isPlaying, isStopped } = this.props
    const repeatIcon = <IconMaterial name='repeat' size={26} color={colors.GREY_DARK} />
    const prevIcon = <IconMaterial name='skip-previous' size={26} color={colors.GREY_DARK} />
    const nextIcon = <IconMaterial name='skip-next' size={26} color={colors.GREY_DARK} />
    const shuffleIcon = <IconMaterial name='shuffle' size={26} color={colors.GREY_DARK} />

    return (
      <View style={[theme.cardStyle, styles.container]}>
        <CircleButton onPress={onRepeatPress} size={42}>
          {repeatIcon}
        </CircleButton>
        <CircleButton onPress={onPrevPress} size={42}>
          {prevIcon}
        </CircleButton>
        <CircleButton onPress={onPlayPress} size={78}>
          <PlayPauseButton isPlaying={isPlaying} isStopped={isStopped} />
        </CircleButton>
        <CircleButton onPress={onNextPress} size={42}>
          {nextIcon}
        </CircleButton>
        <CircleButton onPress={onShufflePress} size={42}>
          {shuffleIcon}
        </CircleButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 82,
    elevation: 4,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
