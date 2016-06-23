import React, { Component, PropTypes } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { observer } from 'mobx-react/native'
import { MKSpinner } from 'react-native-material-kit'
import Zeroconf from 'react-native-zeroconf'
import Toolbar from '../components/Toolbar'
import TouchableView from '../components/TouchableView'

@observer
export default class ZeroConfScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    settingsStore: PropTypes.object,
    themeStore: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  constructor (...args) {
    super(...args)
    this.state = {
      devices: []
    }
  }

  componentDidMount () {
    this.CONNECTED_IP = this.props.settingsStore.IP_ADDRESS
    this.zeroconf = new Zeroconf()
    this.zeroconf.scan('GPMDP')
    // this.zeroconf.scan('GPMDP')
    this.zeroconf.on('start', () => console.log('start.'))
    this.zeroconf.on('found', () => console.log('found'))
    this.zeroconf.on('resolved', (service) => {
      if (service.host !== this.CONNECTED_IP) {
        console.log('found service, adding to list', service)
        this.setState({
          devices: this.state.devices.concat([service])
        })
        // this.props.settingsStore.updateIPAddress(service.host)
      }
    })
    this.zeroconf.on('remove', (serviceName) => {
      console.log('removed', serviceName)
      this.setState({
        devices: this.state.devices.filter((service) => service.name !== serviceName)
      })
    })
    this.zeroconf.on('error', () => console.log('error.'))
  }

  componentDidUpdate () {
    const { webSocketStore, settingsStore } = this.props
    if (this.CONNECTED_IP !== settingsStore.IP_ADDRESS) {
      webSocketStore.disconnect()
      webSocketStore.connect(settingsStore.IP_ADDRESS)
      this.CONNECTED_IP = settingsStore.IP_ADDRESS
    }
  }

  componentWillUnmount () {
    this.zeroconf.stop()
  }

  _ipChanged = (newIP) => {
    this.props.settingsStore.updateIPAddress(newIP)
    this.props.navigator.pop()
  }

  render () {
    const { themeStore } = this.props
    return (
      <View style={[styles.container, { backgroundColor: themeStore.backgroundColor() }]}>
        <StatusBar animated backgroundColor={themeStore.barColor()} />
        <Toolbar title={'Scanning'} navigator={this.props.navigator} color={themeStore.barColor()} />
        <View style={styles.content}>
          <Text style={[styles.zeroContent, styles.header, { color: themeStore.foreColor() }]}>Device List</Text>
          <ScrollView style={styles.zeroContent}>
            {
              this.state.devices.length ?
              this.state.devices.map((device, index) =>
                (<View key={`device_${index}`}>
                  <TouchableView onPress={() => this._ipChanged(device.addresses[0])}>
                    <Text style={[styles.device, { color: themeStore.foreColor() }]}>{device.name}</Text>
                  </TouchableView>
                  <View style={styles.seperator} />
                </View>)
              )
              : (
                <MKSpinner style={styles.spinner} />
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
  },
  header: {
    marginBottom: 0,
    fontSize: 28
  },
  seperator: {
    backgroundColor: '#999',
    height: 2,
    marginVertical: 8
  },
  device: {
    fontSize: 18
  },
  spinner: {
    height: 100,
    width: 100
  }
})
