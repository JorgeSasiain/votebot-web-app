"use strict";

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'src', 'static', 'js'),
    publicPath: "/js/",
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test:/\.css$/,
        loader: 'css-loader'
      },
      {
        test: /\.js$/,
        loader: ['babel-loader'],
        query: {
          cacheDirectory: 'babel_cache',
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    })
  )
}
