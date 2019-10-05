var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  target: 'node',
  entry: ['./repl.js'],
  externals: getNodeModules(),
  output: {
    filename: 'repl',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { "legacy": true }],
              '@babel/plugin-proposal-function-sent',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-numeric-separator',
              '@babel/plugin-proposal-throw-expressions',
              '@babel/plugin-proposal-class-properties',
            ],
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(
      {
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      }
    ),
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
  ],
  node: {
    __dirname: true
  },
};

function getNodeModules() {
  var nodeModules = {};

  fs.readdirSync('node_modules').filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  }).forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

  return nodeModules;
}
