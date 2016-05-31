import React, { PropTypes } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import colors from '../theme/colors'
import metrics from '../theme/metrics'

const theme = getTheme()

const placeholder = 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg'

const TrackCard = ({ title, artist, album, albumArt }) => {
  let art = albumArt
  let imageWidth = metrics.DEVICE_WIDTH * 0.7
  let imageMargin = 0
  let resizeMode = 'cover'
  if (art === 'NOT_CONNECTED') {
    art = require('./img/cloud-off.png') // eslint-disable-line
    imageWidth -= 40
    imageMargin = 20
    resizeMode = 'contain'
  } else {
    art = {
      uri: art === null ? placeholder : art
    }
  }

  return (
    <View style={[theme.cardStyle, styles.container]}>
      <View style={{ flex: 1, margin: imageMargin }}>
        <Image
          source={art}
          style={{ flex: 1, margin: -2, resizeMode, width: imageWidth, height: imageWidth }}
        />
      </View>
      <View style={{ margin: 15 }}>
        <Text style={[theme.cardContentStyle, styles.titleText]}>
          {title || 'No song is currently playing'}
        </Text>
        <Text style={[theme.cardContentStyle, styles.subText]}>
          {artist}{!album || !artist ? '' : ' - '}{album}
        </Text>
      </View>
    </View>
  )
}

TrackCard.propTypes = {
  title: PropTypes.string,
  artist: PropTypes.string,
  album: PropTypes.string,
  albumArt: PropTypes.string
}

TrackCard.defaultProps = {
  albumArt: placeholder
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    elevation: 2,
    marginVertical: 40,
    width: metrics.DEVICE_WIDTH * 0.7
  },
  titleText: {
    padding: 0,
    color: colors.BLACK,
    fontSize: 16
  },
  subText: {
    padding: 0
  }
})

export default TrackCard
