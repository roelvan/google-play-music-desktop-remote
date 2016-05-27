import React, { PropTypes } from 'react'
import { StyleSheet, View } from 'react-native'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import CircleButton from './CircleButton'
import PlayPauseButton from './PlayPauseButton'
import colors from '../theme/colors'

export default class ControlBar extends React.Component {
  static propTypes = {
    isPlaying: PropTypes.bool,
    isStopped: PropTypes.bool,
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
    const { onPlayPress, onPrevPress, onNextPress, onRepeatPress, onShufflePress, isPlaying, isStopped } = this.props
    const repeatIcon = <IconMaterial name={'repeat'} size={26} color={colors.GREY_DARK} />
    const prevIcon = <IconMaterial name={'skip-previous'} size={26} color={colors.GREY_DARK} />
    const nextIcon = <IconMaterial name={'skip-next'} size={26} color={colors.GREY_DARK} />
    const shuffleIcon = <IconMaterial name={'shuffle'} size={26} color={colors.GREY_DARK} />

    return (
      <View style={styles.container}>
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
    height: 100,
    elevation: 4,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
