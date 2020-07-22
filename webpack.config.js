const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv = []) => ({
  entry: ['./src/getstream.ts'],

  mode: 'production',

  module: {
    rules: [
      {
        test: /(jsonwebtoken|batch_operations|redirect_url)/,
        use: 'null-loader',
      },
      {
        test: /\.(js|ts)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.ts'],
  },

  node: {
    console: false,
    Buffer: false,
    crypto: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    url: 'empty',
  },

  optimization: {
    minimizer:
      argv.minify !== undefined
        ? [
            new UglifyJsPlugin({
              uglifyOptions: { warnings: false },
            }),
          ]
        : [],
  },

  output: {
    path: argv.minify !== undefined ? path.join(__dirname, 'dist', 'js_min') : path.join(__dirname, 'dist', 'js'),
    publicPath: 'dist/',
    filename: 'getstream.js',
    chunkFilename: '[chunkhash].js',
    library: 'stream',
    libraryTarget: 'umd',
  },
});
