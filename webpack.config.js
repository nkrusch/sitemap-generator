
const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;
// const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
let plugins = (env !== 'build') ? [] : [];
  // new UglifyJsPlugin({ minimize: true })
// ];

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.js']
  },
  plugins: plugins
};