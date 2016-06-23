import React, { Component, PropTypes } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { observer } from 'mobx-react/native'
import Zeroconf from 'react-native-zeroconf'
import Toolbar from '../components/Toolbar'

@observer
export default class ZeroConfScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    settingsStore: PropTypes.object,
    themeStore: PropTypes.object
  }

  constructor (...args) {
    super(...args)
    this.state = {
      devices: []
    }
  }

  componentDidMount () {
    this.zeroconf = new Zeroconf()
    this.zeroconf.scan('GPMDP')
    // this.zeroconf.scan('GPMDP')
    this.zeroconf.on('start', () => console.log('start.'))
    this.zeroconf.on('found', () => console.log('found'))
    this.zeroconf.on('resolved', (service) => {
      if (service.host !== this.CONNECTED_IP) {
        console.log('found service, adding to list')
        this.setState({
          devices: this.state.devices.concat([service])
        })
        // this.props.settingsStore.updateIPAddress(service.host)
      }
    })
    this.zeroconf.on('error', () => console.log('error.'))
  }

  _ipChanged = (newIP) => {
    this.props.settingsStore.updateIPAddress(newIP)
  }

  render () {
    const { themeStore } = this.props
    return (
      <View style={[styles.container, { backgroundColor: themeStore.backgroundColor() }]}>
        <StatusBar animated backgroundColor={themeStore.barColor()} />
        <Toolbar title={'Scanning'} navigator={this.props.navigator} color={themeStore.barColor()} />
        <View style={styles.content}>
          <ScrollView style={styles.zeroContent}>
            <Text>Hello</Text>
            {
              this.state.devices.map((device, index) =>
                (<Text key={`device_${index}`}>Test</Text>)
              )
            }
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
  zeroContent: {
    margin: 20
  }
})
