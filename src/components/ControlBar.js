/**
 * @providesModule ControlBar
 */
import React, { Text, View } from 'react-native'
import TouchableView from 'TouchableView'

export default ({ onPlayPress, onPrevPress, onNextPress }) =>
  <View style={{ flexDirection: 'row' }}>
    <TouchableView onPress={onPrevPress}>
      <Text>Prev</Text>
    </TouchableView>
    <TouchableView onPress={onPlayPress}>
      <Text>Play</Text>
    </TouchableView>
    <TouchableView onPress={onNextPress}>
      <Text>Next</Text>
    </TouchableView>
  </View>
