const pathfs = require('path')
const {difference} = require('lodash')

const publicPath = pathfs.resolve(__dirname, '..', 'public')
const drawsPath = pathfs.resolve(publicPath, 'images')
const config = {
  publicPath,
  drawsPath,
  getPublicPath: (absolutePath) => absolutePath.replace(publicPath, ''),
  getAbsolutePath: (urlPath) => publicPath + urlPath
}

module.exports = config