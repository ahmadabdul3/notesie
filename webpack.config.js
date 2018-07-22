
var frontendConfig = require('./webpack-frontend.config.js');
var backendConfig = require('./webpack-backend.config.js');
var sharedConfig = require('./webpack-shared.config.js');

module.exports = [
  Object.assign({}, sharedConfig, frontendConfig),
  Object.assign({}, sharedConfig, backendConfig),
];
