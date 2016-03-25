/**
 * @providesModule TrackCard
 */
import React, { Image, Text, View } from 'react-native'
import { getTheme } from 'react-native-material-kit'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'

const theme = getTheme()

export default ({ title, artist, album, albumArt }) =>
  <View style={[theme.cardStyle, { flex: 1, elevation: 2, margin: 40,
  overflow: 'visible' }]}>
    <Image
      source={{ uri: albumArt === '' ? 'http://media.tumblr.com/tumblr_mf3r1eERKE1qgcb9y.jpg' : albumArt }}
      resizeMode='contain'
      style={{ flex: 1 }}
    />
    <View style={{ padding: 15 }}>
      <Text style={[theme.cardContentStyle, { padding: 0, color: colors.BLACK, fontSize: 16 }]}>
        {title}
      </Text>
      <Text style={[theme.cardContentStyle, { padding: 0 }]}>
        {artist} - {album}
      </Text>
    </View>
  </View>
