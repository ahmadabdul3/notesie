var path = require('path');
// const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const plugins = [];
if (process.env.NODE_ENV === 'production') plugins.push(new CompressionPlugin());

module.exports = {
  entry: [
    './frontend/app.js',
    './frontend/scss/index.scss'
  ],
  output: {
    // filename: '[name].[contenthash:8].js',

    filename: 'javascripts/bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: plugins,
  module: {
    rules: [
      {
        // - no need to test for /\.(js|jsx)$/
        //   all files are .js - even react components
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { "legacy": true }],
              '@babel/plugin-proposal-function-sent',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-numeric-separator',
              '@babel/plugin-proposal-throw-expressions',
              '@babel/plugin-proposal-class-properties',
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].css',
							outputPath: 'stylesheets/'
						}
					},
					{
						loader: 'extract-loader'
					},
					{
						loader: 'css-loader', options: { minimize: true }
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'
					}
				],
      },
    ],
  },
  node: {
    net: 'empty',
    dns: 'empty',
    fs: 'empty',
    tls: 'empty',
    __dirname: true,
  },
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'all',
  //     maxInitialRequests: Infinity,
  //     minSize: 0,
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name(module) {
  //           // get the name. E.g. node_modules/packageName/not/this/part.js
  //           // or node_modules/packageName
  //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
  //
  //           // npm package names are URL-safe, but some servers don't like @ symbols
  //           return `npm.${packageName.replace('@', '')}`;
  //         },
  //       },
  //     },
  //   },
  // },
};
