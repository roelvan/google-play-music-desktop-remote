import React, { Component, PropTypes } from 'react'
import { ScrollView, StatusBar, StyleSheet, TextInput, View } from 'react-native'
import { observer } from 'mobx-react/native'
// import Zeroconf from 'react-native-zeroconf'
import Toolbar from '../components/Toolbar'
import SongList from '../components/SongList'

@observer
export default class SearchScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    searchStore: PropTypes.object,
    settingsStore: PropTypes.object,
    themeStore: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  constructor (...args) {
    super(...args)
    this.state = {
      searchText: ''
    }
  }

  _handleTrackPress = (track) => {
    const searchText = this.props.searchStore.searchText
    return () => {
      this.props.webSocketStore.sendSearchAndPlayResult(searchText, track)
    }
  }

  _updateSearchText = (searchText) => {
    this.props.searchStore.setSearchText(searchText)
  }

  _search = () => {
    this.props.webSocketStore.sendSearch(this.props.searchStore.searchText)
  }

  render () {
    const { searchStore, themeStore } = this.props
    return (
      <View style={[styles.container, { backgroundColor: themeStore.backgroundColor() }]}>
        <StatusBar animated backgroundColor={themeStore.barColor()} />
        <Toolbar title={'Search'} navigator={this.props.navigator} color={themeStore.barColor()} />
        <View style={styles.content}>
          <View style={styles.settingsContent}>
            <TextInput
              style={{ color: themeStore.foreColor() }}
              autoCorrect={true}
              defaultValue={searchStore.searchText}
              keyboardType="web-search"
              underlineColorAndroid={themeStore.highlightColor()}
              placeholder="Search text here..."
              placeholderTextColor={themeStore.foreColor()}
              onChangeText={this._updateSearchText}
              onSubmitEditing={this._search}
            />
          </View>
          <ScrollView>
            <SongList black={!(themeStore.themeEnabled && themeStore.themeType === 'FULL')} data={searchStore.trackDataStore} handlePress={this._handleTrackPress} />
          </ScrollView>
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
    margin: 20
  }
})
