const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env=[], argv=[]) => ({
  entry: './src/getstream.js',

  mode: "production",

  module: {
    rules: [
      {
        test: /(jsonwebtoken|http-signature|batch_operations|qs)/,
        use: 'null-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  },

  node: {
      console: false,
      Buffer: false,
      crypto: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      url: 'empty'
  },

  optimization: {
      minimizer: argv.minify !== undefined ?
        [new UglifyJsPlugin({uglifyOptions: {compress: {warnings: false}}})] :
        []
  },

  output: {
      path: argv.minify !== undefined ?
          path.join(__dirname, 'dist', 'js_min') :
          path.join(__dirname, "dist", "js"),
      publicPath: "dist/",
      filename: "getstream.js",
      chunkFilename: "[chunkhash].js",
      library: "stream",
      libraryTarget: "umd"
  },

  resolve: {
    alias: {
      'request': 'xmlhttp-request'
    }
  },
});
