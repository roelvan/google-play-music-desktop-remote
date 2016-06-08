import { observable } from 'mobx'

export default class ThemeStore {
  @observable themeEnabled = false
  @observable themeType = 'FULL'
  @observable themeColor = '#EF6C00'

  setThemeEnabled = (enabled) => {
    this.themeEnabled = enabled
  }

  setThemeType = (type) => {
    this.themeType = type
  }

  setThemeColor = (color) => {
    this.themeColor = color
  }

  backgroundColor = () => {
    if (this.themeEnabled && this.themeType === 'FULL') {
      return '#222326'
    } else {
      return '#F5F5F5'
    }
  }

  barColor = () => {
    if (this.themeEnabled && this.themeType !== 'FULL') {
      return this.themeColor
    } else if (this.themeEnabled && this.themeType === 'FULL') {
      return '#121314'
    } else {
      return '#EF6C00'
    }
  }

  highlightColor = () => {
    if (this.themeEnabled) {
      return this.themeColor
    } else {
      return '#EF6C00'
    }
  }

  foreColor = () => {
    if (this.themeEnabled && this.themeType === 'FULL') {
      return '#FFFFFF'
    } else {
      return '#212121'
    }
  }
}
