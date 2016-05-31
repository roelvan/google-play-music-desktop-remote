import React, { PropTypes } from 'react'
import { StyleSheet, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import CircleButton from './CircleButton'
import PlayPauseButton from './PlayPauseButton'
import colors from '../theme/colors'

const theme = getTheme()

export default class ControlBar extends React.Component {
  static propTypes = {
    isPlaying: PropTypes.bool,
    isStopped: PropTypes.bool,
    landscape: PropTypes.bool,
    repeatMode: PropTypes.string,
    shuffleMode: PropTypes.string,
    onPlayPress: PropTypes.func,
    onPrevPress: PropTypes.func,
    onNextPress: PropTypes.func,
    onRepeatPress: PropTypes.func,
    onShufflePress: PropTypes.func
  }

  static defaultProps = {
    isPlaying: false,
    isStopped: true
  }

  render = () => {
    const { landscape, onPlayPress, onPrevPress, onNextPress, onRepeatPress, onShufflePress, isPlaying, isStopped, repeatMode, shuffleMode } = this.props

    let repeatColor = colors.GREY_DARK
    let shuffleColor = colors.GREY_DARK
    if (repeatMode !== 'NO_REPEAT') {
      repeatColor = colors.ORANGE
    }
    if (shuffleMode !== 'NO_SHUFFLE') {
      shuffleColor = colors.ORANGE
    }
    const repeatIcon = <IconMaterial name={repeatMode === 'SINGLE_REPEAT' ? 'repeat-one' : 'repeat'} size={landscape ? 20 : 26} color={repeatColor} />
    const prevIcon = <IconMaterial name={'skip-previous'} size={landscape ? 20 : 26} color={colors.GREY_DARK} />
    const nextIcon = <IconMaterial name={'skip-next'} size={landscape ? 20 : 26} color={colors.GREY_DARK} />
    const shuffleIcon = <IconMaterial name={'shuffle'} size={landscape ? 20 : 26} color={shuffleColor} />

    return (
      <View style={[theme.cardStyle, landscape ? styles.landscapeContainer : styles.container]}>
        <CircleButton onPress={onRepeatPress} size={landscape ? 32 : 42}>
          {repeatIcon}
        </CircleButton>
        <CircleButton onPress={onPrevPress} size={landscape ? 32 : 42}>
          {prevIcon}
        </CircleButton>
        <CircleButton onPress={onPlayPress} size={landscape ? 55 : 84}>
          <PlayPauseButton isPlaying={isPlaying} isStopped={isStopped} landscape={landscape} />
        </CircleButton>
        <CircleButton onPress={onNextPress} size={landscape ? 32 : 42}>
          {nextIcon}
        </CircleButton>
        <CircleButton onPress={onShufflePress} size={landscape ? 32 : 42}>
          {shuffleIcon}
        </CircleButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 100,
    elevation: 4,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  landscapeContainer: {
    flex: 0,
    height: 65,
    elevation: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
