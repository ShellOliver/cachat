var path = require('path');
var nodeExternals = require('webpack-node-externals');
//file routes is a big problem for compile
module.exports = {
    entry: './app.js',
    output: {
      filename: '[name].js'
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
      }
  }