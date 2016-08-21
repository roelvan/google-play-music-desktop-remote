import React, { Component, PropTypes } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { MKTextField } from 'react-native-material-kit'
import { observer } from 'mobx-react/native'
import Toolbar from '../components/Toolbar'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import AlbumList from '../components/AlbumList'
import ArtistList from '../components/ArtistList'
import SongList from '../components/SongList'

@observer
export default class SearchView extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    searchStore: PropTypes.object,
    settingsStore: PropTypes.object,
    themeStore: PropTypes.object,
    webSocketStore: PropTypes.object,
    openDrawer: PropTypes.func
  }

  constructor (...args) {
    super(...args)
    this.state = {
      searchText: ''
    }
  }

  _handleResultPress = (result) => {
    const searchText = this.props.searchStore.searchText
    return () => {
      this.props.webSocketStore.sendSearchAndPlayResult(searchText, result)
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
        <Toolbar title={'Search'} navigator={this.props.navigator} color={themeStore.barColor()} settingsMenu showDrawer drawerFunction={() => { this.props.openDrawer() }} />
        <View style={styles.content}>
          <View style={styles.settingsContent}>
            <MKTextField
              textInputStyle={{ color: themeStore.foreColor() }}
              autoCorrect={true}
              defaultValue={searchStore.searchText}
              keyboardType="web-search"
              underlineEnabled
              underlineSize={2}
              highlightColor={themeStore.highlightColor()}
              placeholder="Search text here..."
              placeholderTextColor={themeStore.foreColor()}
              onChangeText={this._updateSearchText}
              onSubmitEditing={this._search}
              tintColor="#999"
            />
          </View>
          <ScrollableTabView
            renderTabBar={() => <DefaultTabBar />}
            tabBarUnderlineColor={themeStore.highlightColor()}
            tabBarActiveTextColor={themeStore.highlightColor()}
            tabBarInactiveTextColor={themeStore.foreColor()}
          >
            <ScrollView tabLabel="Tracks">
              <SongList black={!(themeStore.themeEnabled && themeStore.themeType === 'FULL')} data={searchStore.trackDataStore} handlePress={this._handleResultPress} />
            </ScrollView>
            <ScrollView tabLabel="Albums">
              <AlbumList black={!(themeStore.themeEnabled && themeStore.themeType === 'FULL')} data={searchStore.albumDataStore} handlePress={this._handleResultPress} />
            </ScrollView>
            <ScrollView tabLabel="Artists">
              <ArtistList black={!(themeStore.themeEnabled && themeStore.themeType === 'FULL')} data={searchStore.artistDataStore} handlePress={this._handleResultPress} />
            </ScrollView>
          </ScrollableTabView>
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
  }
})
