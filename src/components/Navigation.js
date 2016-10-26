import React, { Component, PropTypes } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'

export default class Navigation extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    foreColor: PropTypes.string,
    navigate: PropTypes.func,
    active: PropTypes.string
  }

  constructor (...args) {
    super(...args)

    this.state = {
      touched: null
    }
  }

  _navigate (viewName) {
    return () => this.props.navigate(viewName)
  }

  _touchIn (id) {
    return () => this.setState({
      touched: id
    })
  }

  _touchOut () {
    return () => this.setState({
      touched: null
    })
  }

  render () {
    const { backgroundColor, foreColor } = this.props

    const views = [
      {
        name: 'Home',
        id: 'remote',
        icon: 'home'
      },
      // {
      //   name: 'Albums',
      //   id: 'albums',
      //   icon: 'album'
      // },
      // {
      //   name: 'Artists',
      //   id: 'artists',
      //   icon: 'person'
      // },
      {
        name: 'Tracks',
        id: 'tracks',
        icon: 'audiotrack'
      },
      {
        name: 'Playlists',
        id: 'playlists',
        icon: 'playlist-play'
      },
      {
        name: 'Search',
        id: 'search',
        icon: 'search'
      }
    ]
    return (
      <View style={[styles.container, { backgroundColor }]}>
      {
        views.map((viewObj) => {
          const back = {}
          if (this.state.touched === viewObj.id || this.props.active === viewObj.id) {
            back.backgroundColor = '#999'
          }
          return (<TouchableWithoutFeedback
            onPress={this._navigate(viewObj.id)}
            key={viewObj.id}
            onPressIn={this._touchIn(viewObj.id)}
            onPressOut={this._touchOut()}
          >
            <View style={back}>
              <View style={styles.listItem}>
                <IconMaterial name={viewObj.icon} size={26} color={foreColor} />
                <Text style={[styles.listItemText, { color: foreColor }]}>{viewObj.name}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>)
        })
      }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    margin: 12,
    flex: 1,
    flexDirection: 'row'
  },
  listItemText: {
    marginLeft: 16,
    marginTop: 3
  }
})
