import React, { PropTypes } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import colors from '../theme/colors'

const theme = getTheme()

const placeholder = 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg'

const TrackCard = ({ title, artist, album, albumArt, landscape }) => {
  const dimensions = Dimensions.get('window')
  let art = albumArt
  let imageWidth = '80%'
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
    <View style={[theme.cardStyle, styles.container, { width: null, flex: 1 }]}>
      <View style={{ flex: 1, margin: imageMargin }}>
        <Image
          source={art}
          style={{ flex: 1, resizeMode, width: null, height: null }}
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
  albumArt: PropTypes.string,
  landscape: PropTypes.string
}

TrackCard.defaultProps = {
  albumArt: placeholder
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    elevation: 2,
    marginVertical: 40
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
