import React, { Component, PropTypes } from 'react'
import SongList from './SongList'

export default class Queue extends Component {
  static propTypes = {
    data: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  _formatTime (milli) {
    const seconds = Math.round((milli / 1000) % 60)
    return `${Math.floor(milli / 60000)}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  _handlePress = (track) =>
    () => {
      this.props.webSocketStore.sendPlayQueueTrack(track)
    }

  render () {
    const { data } = this.props

    return (
      <SongList data={data} handlePress={this._handlePress} />
    )
  }
}
