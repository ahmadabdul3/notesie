var path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  // devtool: 'inline-source-map',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : '#eval-source-map',
  resolve: {
    alias: {
      src: path.resolve(__dirname),
    },
  },
};
