/**
 * @providesModule HomeScreen
 */
import React, { StyleSheet, View } from 'react-native'
import TrackCard from 'TrackCard'
import ControlBar from 'ControlBar'
import Toolbar from 'Toolbar'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'
import wsMessages from 'GooglePlayMusicDesktopRemote/src/utils/wsMessages'

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
      albumArt: ''
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

  _onWsError = error =>
    console.log(`WebSocket error: ${error.message} `)

  _onWsClose = e =>
    console.log(`WebSocket connection closed: ${WEBSOCKET_ADDRESS} `)

  _onWsMessage = msg => {
    const { channel, payload } = JSON.parse(msg.data)
    if (channel === 'song') {
      let { title, artist, album, albumArt } = payload
      albumArt = albumArt.substring(0, albumArt.length - 11)
      this.setState({ title, artist, album, albumArt })
    }
    if (channel !== 'time') {
      console.log(`WebSocket message received, channel: ${channel}, payload: ${payload}`)
    }
  }

  _handlePlayPress = () =>
    this._sendMessage(wsMessages.PLAY_PAUSE)

  _handlePrevPress = () =>
    this._sendMessage(wsMessages.PREV)

  _handleNextPress = () =>
    this._sendMessage(wsMessages.PREV)

  _sendMessage = message => this.ws.send(JSON.stringify(message))

  render () {
    const { title, artist, album, albumArt } = this.state
    return (
      <View style={styles.container}>
        <Toolbar title='Home' />
        <View style={styles.content}>
          <TrackCard
            title={title}
            artist={artist}
            album={album}
            albumArt={albumArt}
          />
          <ControlBar
            onPlayPress={this._handlePlayPress}
            onPrevPress={this._handlePrevPress}
            onNextPress={this._handleNextPress}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.GREY_LIGHT
  }
})
