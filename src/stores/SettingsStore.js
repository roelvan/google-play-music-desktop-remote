import { AsyncStorage } from 'react-native'
import { observable } from 'mobx'

export default class SettingsStore {
  @observable IP_ADDRESS

  async init () {
    const savedIP = await AsyncStorage.getItem('IP_ADDRESS')
    this.updateIPAddress(savedIP || 'NOT_SET')
  }

  updateIPAddress = (newIP) => {
    this.IP_ADDRESS = newIP
  }
}
