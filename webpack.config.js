var path = require('path');

var frontendConfig = require('./webpack-frontend.config.js');
var backendConfig = require('./webpack-backend.config.js');

var sharedConfig = getSharedConfig();

module.exports = [
  combineObjects(sharedConfig, frontendConfig),
  combineObjects(sharedConfig, backendConfig),
];

function combineObjects(objectOne, objectTwo) {
  return Object.assign({}, objectOne, objectTwo);
}

function getSharedConfig() {
  return {
    mode: 'development',
    // devtool: 'inline-source-map',
    devtool: '#eval-source-map',
    resolve: {
      alias: {
        src: path.resolve(__dirname),
      },
    }
  };
}
