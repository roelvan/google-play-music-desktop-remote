/**
 * @providesModule Toolbar
 */
import React, { ToolbarAndroid, StyleSheet } from 'react-native'
import colors from 'GooglePlayMusicDesktopRemote/src/config/colors'

export default ({ title }) =>
  <ToolbarAndroid
    actions={[]}
    style={styles.toolbar}
    titleColor={colors.WHITE}
    title={title}
  />

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: colors.ORANGE,
    height: 56,
    elevation: 2
  }
})
