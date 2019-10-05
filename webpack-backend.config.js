var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {
  mode: 'development',
  devtool: '#eval-source-map',
  target: 'node',
  entry: './bin/www.js',
  externals: getNodeModules(),
  resolve: {
    extensions: ['.js'],
    alias: {
      src: path.resolve(__dirname),
    },
  },
  output: {
    filename: 'server',
    path: path.resolve(__dirname, 'dist')
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
