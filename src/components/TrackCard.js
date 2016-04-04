/** @providesModule TrackCard */
import React, { Image, StyleSheet, Text, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'
import dimensions from 'GooglePlayMusicDesktopRemote/src/config/dimensions'

const theme = getTheme()

const placeholder = 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg'

export default ({ title, artist, album, albumArt }) =>
  <View style={[theme.cardStyle, styles.container]}>
    <Image
      source={{ uri: albumArt === '' ? placeholder : albumArt }}
      resizeMode='cover'
      style={{ flex: 1, margin: -2 }}
    />
    <View style={{ margin: 15 }}>
      <Text style={[theme.cardContentStyle, styles.titleText]}>
        {title}
      </Text>
      <Text style={[theme.cardContentStyle, styles.subText]}>
        {artist} - {album}
      </Text>
    </View>
  </View>

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    elevation: 2,
    marginVertical: 40,
    width: dimensions.DEVICE_WIDTH * 0.7
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
