var path = require('path');

module.exports = {
  entry: [
    './frontend/app.js',
    './frontend/scss/index.scss'
  ],
  output: {
    filename: 'javascripts/bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
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
  plugins: [
  ],
  node: {
    net: 'empty',
    dns: 'empty',
    fs: 'empty',
    tls: 'empty',
    __dirname: true,
  },
};
