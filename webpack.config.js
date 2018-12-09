const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'reducer-composer.js',
    library: 'reducer-composer',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ]
};
