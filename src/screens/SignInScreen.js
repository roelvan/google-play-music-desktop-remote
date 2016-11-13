import React, { Component, PropTypes } from 'react'
import { AsyncStorage, StatusBar, StyleSheet, View } from 'react-native'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'
import { observer } from 'mobx-react/native'
import Toolbar from '../components/Toolbar'

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
      ready: false
    }
  }

  componentDidMount () {
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      GoogleSignin.configure({
        webClientId: '',
        offlineAccess: true
      })
      .then(() => {
        this._signIn()
        setTimeout(() => {
          this.setState({
            ready: true
          })
        })
      })
    }).catch((err) => {
      console.error('Play services error', err.code, err.message)
    })
  }

  componentDidUpdate () {
  }

  componentWillUnmount () {
  }

  _signIn = async () => {
    GoogleSignin.signIn()
    .then(async (user) => {
    // const user = { email: 'samuel.r.attard@gmail.com' }
      await AsyncStorage.setItem('email', user.email)
      this.props.webSocketStore.connect()
      this.props.navigator.replace({ name: 'remote' })
    })
    .catch(err => {
      console.error('google sign in error', err)
    })
  }

  render () {
    const { themeStore } = this.props
    return (
      <View style={[styles.container, { backgroundColor: themeStore.backgroundColor() }]}>
        <StatusBar animated backgroundColor={themeStore.barColor()} />
        <Toolbar title={'Sign In to Continue'} navigator={this.props.navigator} color={themeStore.barColor()} noIcon />
        <View style={styles.content}>
        {
          this.state.ready ? (
            <GoogleSigninButton
              style={styles.signIn}
              size={GoogleSigninButton.Wide}
              color={GoogleSigninButton.Dark}
              onPress={this._signIn}
            />
          ) : null
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
  signIn: {
    width: 312,
    height: 48
  }
})
