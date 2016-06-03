import React, { Component, PropTypes } from 'react'
import { Animated, DrawerLayoutAndroid, DeviceEventEmitter, Image, NativeModules, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { observer } from 'mobx-react/native'
import Zeroconf from 'react-native-zeroconf'
import ControlBar from '../components/ControlBar'
import PlaylistNavigation from '../components/PlaylistNavigation'
import ProgressSlider from '../components/ProgressSlider'
import Queue from '../components/Queue'
import SongInfo from '../components/SongInfo'
import Toolbar from '../components/Toolbar'
import colors from '../theme/colors'

const { DeviceInfo } = NativeModules

@observer
export default class HomeScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    settingsStore: PropTypes.object,
    trackStore: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  constructor (...args) {
    super(...args)

    this.state = {
      bouncing: false,
      bounceDownValue: new Animated.Value(0),
      bounceUpValue: new Animated.Value(0),
      orientation: 'PORTRAIT',
      showQueue: false
    }
    DeviceInfo.getDeviceOrientation()
      .then((o) => this.setState({
        orientation: o === 1 ? 'PORTRAIT' : 'LANDSCAPE'
      }))
  }

  componentDidMount () {
    const { webSocketStore, settingsStore } = this.props
    webSocketStore.connect(settingsStore.IP_ADDRESS)
    this.CONNECTED_IP = settingsStore.IP_ADDRESS

    this.zeroconf = new Zeroconf()
    this.zeroconf.scan('GPMDP')
    // this.zeroconf.scan('GPMDP')
    this.zeroconf.on('start', () => console.log('start.'))
    this.zeroconf.on('found', () => console.log('found'))
    this.zeroconf.on('resolved', (service) => {
      if (service.host !== this.CONNECTED_IP) {
        console.log('found service, updating IP')
        this.props.settingsStore.updateIPAddress(service.host)
      }
    })
    this.zeroconf.on('error', () => console.log('error.'))

    DeviceEventEmitter.addListener('orientation', (data) => {
      this.setState({
        orientation: data.orientation
      })
    })
  }

  componentDidUpdate () {
    const { webSocketStore, settingsStore } = this.props
    if (this.CONNECTED_IP !== settingsStore.IP_ADDRESS) {
      webSocketStore.disconnect()
      webSocketStore.connect(settingsStore.IP_ADDRESS)
      this.CONNECTED_IP = settingsStore.IP_ADDRESS
    }
  }

  _imageTap = () => {
    this.setState({
      bouncing: !this.state.bouncing
    })
    Animated.timing(this.state.bounceDownValue,
      {
        toValue: this.state.bouncing ? 0 : 128,
        duration: 400
      }
    ).start()
    Animated.timing(this.state.bounceUpValue,
      {
        toValue: this.state.bouncing ? 0 : -60,
        duration: 400
      }
    ).start()
  }

  _handlePlayPress = () => this.props.webSocketStore.sendPlay()

  _handlePrevPress = () => {
    this.props.webSocketStore.sendPrev()
    this.props.trackStore.stop()
  }

  _handleNextPress = () => {
    this.props.webSocketStore.sendNext()
    this.props.trackStore.stop()
  }

  _handleShufflePress = () => {
    this.props.webSocketStore.sendToggleShuffle()
    this.props.webSocketStore.sendGetShuffle()
  }

  _handleRepeatPress = () => {
    this.props.webSocketStore.sendToggleRepeat()
    this.props.webSocketStore.sendGetRepeat()
  }

  _handleProgressBarTouch = (value) => this.props.webSocketStore.sendSetTime(value)

  _handlePlaylistNavigation = (playlist) =>
    () => {
      this.refs.drawer.closeDrawer()
      this.props.navigator.push({
        name: 'playlist',
        playlist: playlist, // eslint-disable-line
      })
    }

  _handleSongInfoPress = () => {
    this.setState({
      showQueue: !this.state.showQueue
    })
  }

  render () {
    let { title, artist, album, albumArt, isPlaying,
      isStopped, currentTime, totalTime, repeatMode, shuffleMode } = this.props.trackStore
    const { playlistsDataStore, queueDataStore } = this.props.trackStore
    const { isConnected } = this.props.webSocketStore

    if (!isConnected) {
      title = 'Not Connected'
      artist = 'Check your settings'
      album = ''
      albumArt = 'NOT_CONNECTED'
    }

    let art = albumArt
    if (art === 'NOT_CONNECTED') {
      art = require('../components/img/cloud-off.png') // eslint-disable-line
    } else {
      art = { uri: art === null ? 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg' : `${art}=s1000-c-e1200` }
    }

    return (
      <DrawerLayoutAndroid
        ref="drawer"
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => <PlaylistNavigation playlistsDataStore={playlistsDataStore} navigate={this._handlePlaylistNavigation} />}
      >
        <View style={styles.container}>
          <StatusBar animated hidden={this.state.bouncing} backgroundColor={colors.ORANGE_DARK} />
          <View style={styles.content}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableWithoutFeedback onPress={this._imageTap}>
                <Image
                  source={art}
                  style={[styles.artImage, {
                    resizeMode: !art.uri ? 'contain' : 'cover',
                    margin: !art.uri ? 24 : 0
                  }]}
                />
              </TouchableWithoutFeedback>
            </View>
            {
              this.state.showQueue ?
              (
                <Animated.View style={[styles.queue, { opacity: this.state.queueOpacity, top: this.state.bouncing ? 50 : 106, bottom: this.state.orientation === 'LANDSCAPE' ? 65 : 100 }]} >
                  <Queue data={queueDataStore} webSocketStore={this.props.webSocketStore} />
                </Animated.View>
              )
              : null
            }
            <Animated.View style={[styles.toolbar, { transform: [{ translateY: this.state.bounceUpValue }] }]} >
              <Toolbar title={'Home'} navigator={this.props.navigator} settingsMenu showDrawer drawerFunction={() => { this.refs.drawer.openDrawer() }} />
            </Animated.View>
            <Animated.View style={[styles.toolbarSongInfo, { transform: [{ translateY: this.state.bounceUpValue }] }]} >
              <SongInfo title={title} artist={artist} album={album} onPress={this._handleSongInfoPress} />
            </Animated.View>
            <Animated.View style={[styles.controlBar, { transform: [{ translateY: this.state.bounceDownValue }] }]} >
              <ControlBar
                isPlaying={isPlaying} isStopped={isStopped} landscape={this.state.orientation === 'LANDSCAPE'}
                repeatMode={repeatMode} shuffleMode={shuffleMode}
                onPlayPress={this._handlePlayPress} onPrevPress={this._handlePrevPress} onNextPress={this._handleNextPress}
                onShufflePress={this._handleShufflePress} onRepeatPress={this._handleRepeatPress}
              />
            </Animated.View>
            <Animated.View
              style={[styles.progress, {
                bottom: this.state.orientation === 'LANDSCAPE' ? 52 : 85,
                transform: [{ translateY: this.state.bounceDownValue }]
              }]}
            >
              <ProgressSlider
                ref={'progressSlider'} min={0} max={totalTime}
                value={currentTime} onValueChange={this._handleProgressBarTouch}
              />
            </Animated.View>
          </View>
        </View>
      </DrawerLayoutAndroid>
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
    backgroundColor: colors.GREY_LIGHTER,
    alignItems: 'stretch'
  },
  controlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 0,
    height: null,
    elevation: 4
  },
  listItem: {
    margin: 12
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    elevation: 9
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 10
  },
  toolbarSongInfo: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    elevation: 10
  },
  artImage: {
    flex: 1,
    alignSelf: 'stretch',
    top: 0,
    height: null,
    width: null
  },
  queue: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 11
  }
})
