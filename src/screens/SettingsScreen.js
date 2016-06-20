import React, { Component, PropTypes } from 'react'
import { AsyncStorage, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { observer } from 'mobx-react/native'
import { getTheme } from 'react-native-material-kit'
// import Zeroconf from 'react-native-zeroconf'
import Toolbar from '../components/Toolbar'
import colors from '../theme/colors'

const theme = getTheme()

@observer
export default class SettingsScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    settingsStore: PropTypes.object,
    themeStore: PropTypes.object
  }

  _ipChanged = (newIP) => {
    this.props.settingsStore.updateIPAddress(newIP)
  }

  render () {
    const { themeStore } = this.props
    return (
      <View style={[styles.container, { backgroundColor: themeStore.backgroundColor() }]}>
        <StatusBar animated backgroundColor={themeStore.barColor()} />
        <Toolbar title={'Settings'} navigator={this.props.navigator} color={themeStore.barColor()} />
        <View style={styles.content}>
          <View style={styles.settingsContent}>
            <Text style={{ color: themeStore.foreColor() }}>GPMDP IP Address</Text>
            <TextInput
              style={{ color: themeStore.foreColor() }}
              autoCorrect={false}
              defaultValue={this.props.settingsStore.IP_ADDRESS === 'NOT_SET' ? '' : this.props.settingsStore.IP_ADDRESS}
              keyboardType="numeric"
              underlineColorAndroid={themeStore.highlightColor()}
              placeholder="GPMDP IP Address"
              placeholderTextColor={themeStore.foreColor()}
              onChangeText={this._ipChanged}
            />
          </View>
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
