var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./src/index.js",
  output: {
    path: __dirname + "/build",
    filename: "main.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.UglifyJsPlugin({ mangle: true, sourcemap: false }),
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              'babel-preset-env',
              'babel-preset-es2015',
              'babel-preset-stage-0'
            ],
            plugins: [
              require('babel-plugin-transform-runtime'),
            ]
          }
        }
      }
    ]
  }
};
