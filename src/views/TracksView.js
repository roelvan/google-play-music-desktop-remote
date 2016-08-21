import React, { Component, PropTypes } from 'react'
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { observer } from 'mobx-react/native'
import Toolbar from '../components/Toolbar'
import SongList from '../components/SongList'

@observer
export default class TracksView extends Component {
  static propTypes = {
    libraryStore: PropTypes.object,
    navigator: PropTypes.object,
    searchStore: PropTypes.object,
    settingsStore: PropTypes.object,
    themeStore: PropTypes.object,
    webSocketStore: PropTypes.object,
    openDrawer: PropTypes.func
  }

  constructor (props, ...args) {
    super(props, ...args)

    const { libraryStore, themeStore } = props
    const data = {}

    const black = !(themeStore.themeEnabled && themeStore.themeType === 'FULL')
    libraryStore.tracks.forEach((track) => {
      const letter = track.title[0].toUpperCase()
      data[letter] = data[letter] || []
      track.black = black // eslint-disable-line
      track.handlePress = this._playTrack.bind(this) // eslint-disable-line
      data[letter].push(track)
    })

    this.data = data

    this.state = {
      currentLetter: null,
      touched: null
    }
  }

  _playTrack = (track) => {
    return () => {
      this.props.webSocketStore.sendLibraryPlayTrack(track)
    }
  }

  _chooseLetter = (letter) =>
    () => this.setState({
      currentLetter: letter
    })

  _touchIn = (letter) =>
    () => this.setState({
      touched: letter
    })

  _touchOut = () =>
    () => this.setState({
      touched: null
    })

  render () {
    const { libraryStore, themeStore } = this.props
    const data = this.data

    const backProps = {
      showDrawer: true
    }
    if (this.state.currentLetter) {
      backProps.backFn = () => {
        this.setState({
          currentLetter: null
        })
      }
      delete backProps.showDrawer
    }
    const keys = Object.keys(data)
    keys.sort((l1, l2) => {
      const l1IsLetter = /[a-zA-Z]/g.test(l1)
      const l2IsLetter = /[a-zA-Z]/g.test(l2)
      if (l1IsLetter && l2IsLetter) {
        return l1.localeCompare(l2)
      } else if (l1IsLetter) {
        return -1
      } else if (l2IsLetter) {
        return 1
      } else {
        return l1.localeCompare(l2)
      }
    })

    return (
      <View style={[styles.container, { backgroundColor: themeStore.backgroundColor() }]}>
        <Toolbar title={this.state.currentLetter ? `Tracks - ${this.state.currentLetter}` : 'Tracks'} navigator={this.props.navigator} color={themeStore.barColor()} {...backProps} settingsMenu drawerFunction={() => { this.props.openDrawer() }} />
        <View style={styles.content}>
        {
          <ScrollView>
            {
              this.state.currentLetter ?
                <SongList
                  black={!(themeStore.themeEnabled && themeStore.themeType === 'FULL')} data={libraryStore.tracks.filter((track) => track.title.toLowerCase()[0] === this.state.currentLetter.toLowerCase())}
                  filterLetter={this.state.currentLetter} handlePress={this._playTrack}
                />
              : keys.map((letter) => {
                const back = {}
                if (this.state.touched === letter) {
                  back.backgroundColor = '#999'
                }
                return (<TouchableWithoutFeedback
                  onPress={this._chooseLetter(letter)}
                  key={letter}
                  onPressIn={this._touchIn(letter)}
                  onPressOut={this._touchOut()}
                >
                  <View style={back}>
                    <View style={styles.listItem}>
                      <Text style={[styles.listItemText, { color: themeStore.foreColor() }]}>{letter}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>)
              })
            }
          </ScrollView>
        }
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
    flex: 1
  },
  controlBar: {
    flex: 0,
    height: 100,
    elevation: 4
  },
  settingsContent: {
    margin: 4
  },
  listItem: {
    margin: 6,
    flex: 1,
    flexDirection: 'row'
  },
  listItemText: {
    marginLeft: 16,
    marginTop: 0
  }
})
