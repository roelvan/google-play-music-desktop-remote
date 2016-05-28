/* eslint-disable */
var fs = require('fs')
var path = require('path')
var babel = require('babel-core')
var origJs = require.extensions['.js']
require('babel-polyfill')
require('react-native-mock/mock')

require.extensions['.js'] = function (module, fileName) {
  var output

  if (fileName.indexOf('node_modules/') >= 0) {
    return (origJs || require.extensions['.js'])(module, fileName)
  }

  var src = fs.readFileSync(fileName, 'utf8')
  output = babel.transform(src, {
    filename: fileName,
    'presets': ['react-native'],
    'plugins': ['transform-decorators-legacy']
  }).code

  return module._compile(output, fileName)
}
