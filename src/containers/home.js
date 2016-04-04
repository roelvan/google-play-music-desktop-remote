/** @providesModule HomeScreen */
import React, { StatusBar, StyleSheet, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import TrackCard from 'TrackCard'
import ControlBar from 'ControlBar'
import ProgressSlider from 'ProgressSlider'
import Toolbar from 'Toolbar'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'
import wsMessages from 'GooglePlayMusicDesktopRemote/src/utils/wsMessages'

const theme = getTheme()

const IP_ADDRESS = '192.168.1.50'
const PORT = 5672
const WEBSOCKET_ADDRESS = `ws://${IP_ADDRESS}:${PORT}`

export default class HomeScreen extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      title: '',
      artist: '',
      album: '',
      albumArt: '',
      shuffleStatus: '',
      repeatStatus: '',
      isPlaying: false,
      isStopped: true,
      currentTime: 0,
      totalTime: 0
    }
  }

  componentDidMount () {
    this.ws = new WebSocket(WEBSOCKET_ADDRESS)
    this.ws.onopen = this._onWsOpen
    this.ws.onerror = this._onWsError
    this.ws.onmessage = this._onWsMessage
    this.ws.onclose = this._onWsClose
  }

  _onWsOpen = () =>
    console.log(`WebSocket connection open: ${WEBSOCKET_ADDRESS} `)

  _onWsError = (error) =>
    console.log(`WebSocket error: ${error.message} `)

  _onWsClose = (e) =>
    console.log(`WebSocket connection closed: ${WEBSOCKET_ADDRESS} `)

  _onWsMessage = (msg) => {
    const { channel, payload } = JSON.parse(msg.data)
    if (channel === 'song') {
      let { title, artist, album, albumArt } = payload
      albumArt = albumArt.substring(0, albumArt.length - 11)
      this.setState({ title, artist, album, albumArt })
      this.setState({ isStopped: false })
    }
    if (channel === 'playState') {
      const isPlaying = payload
      this.setState({ isPlaying })
    }
    if (channel === 'time') {
      this.setState({ currentTime: payload.current, totalTime: payload.total })
      this.progressSliderRef.setValue(this.state.currentTime)
    }
    if (channel !== 'time') {
      console.log(`WebSocket message received, channel: ${channel}, payload: ${payload}`)
    }
  }

  _handlePlayPress = () =>
    this._sendMessage(wsMessages.PLAY_PAUSE)

  _handlePrevPress = () => {
    this._sendMessage(wsMessages.PREV)
    this.setState({ isStopped: true })
  }

  _handleNextPress = () => {
    this._sendMessage(wsMessages.PREV)
    this.setState({ isStopped: true })
  }

  _handleShufflePress = () =>
    this._sendMessage([wsMessages.TOGGLE_SHUFFLE, wsMessages.GET_SHUFFLE])

  _handleRepeatPress = () =>
    this._sendMessage([wsMessages.TOGGLE_REPEAT, wsMessages.GET_REPEAT])

  _handleProgressBarTouch = (value) =>
    this._sendMessage(wsMessages.SET_TIME([value]))

  _sendMessage = (message) => {
    if (message.isArray) {
      message.forEach((msg) => this.ws.send(JSON.stringify(message)))
    } else {
      this.ws.send(JSON.stringify(message))
    }
  }

  render () {
    const { title, artist, album, albumArt, isPlaying, isStopped, totalTime } = this.state
    return (
      <View style={styles.container}>
        <StatusBar animated backgroundColor={colors.ORANGE_DARK} />
        <Toolbar title='Home' />
        <View style={styles.content}>
          <TrackCard
            title={title}
            artist={artist}
            album={album}
            albumArt={albumArt}
          />
          <View style={[theme.cardStyle, styles.controlBar]}>
            <ControlBar
              isPlaying={isPlaying}
              isStopped={isStopped}
              onPlayPress={this._handlePlayPress}
              onPrevPress={this._handlePrevPress}
              onNextPress={this._handleNextPress}
              onShufflePress={this._handleShufflePress}
              onRepeatPress={this._handleRepeatPress}
            />
          </View>
          <ProgressSlider
            ref={(r) => this.progressSliderRef = r}
            min={0}
            max={totalTime}
            onTouchUp={this._handleProgressBarTouch}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  content: {
    flex: 1,
    backgroundColor: colors.GREY_LIGHTER
  },
  controlBar: {
    flex: 0,
    height: 100,
    elevation: 4
  }
})
