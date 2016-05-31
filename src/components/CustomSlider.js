/* eslint-disable */
// Monkey-Patching RNMK Slider for triggering this.props.onPress

import React, { PropTypes } from 'react'
import Slider from '../../node_modules/react-native-material-kit/lib/mdl/Slider'

export default class CustomSlider extends Slider {
  constructor (props) {
    super(props)
  }

  _onTouchEvent(evt) {
    switch (evt.type) {
      case 'TOUCH_DOWN':
        this.props.onPress(); // !!!
        this._updateValueByTouch(evt);
        break;
      case 'TOUCH_MOVE':
        this._updateValueByTouch(evt);
        break;
      case 'TOUCH_UP':
        this._confirmUpdateValueByTouch(evt);
        break;
      case 'TOUCH_CANCEL':
        this._confirmUpdateValueByTouch();
        break;
      default:
        break;
    }
  }

}
