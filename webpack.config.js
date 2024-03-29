const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = (env = {}) => ({
  entry: './src/index.ts',

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
      {
        exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx|cjs)$/, /\.html$/, /\.json$/],
        type: 'asset/resource',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.ts'],
  },

  optimization: {
    minimize: !!env.minify,
  },

  output: {
    path: env.minify ? path.join(__dirname, 'dist', 'js_min') : path.join(__dirname, 'dist', 'js'),
    publicPath: 'dist/',
    filename: 'getstream.js',
    chunkFilename: '[chunkhash].js',
    library: 'stream',
    libraryTarget: 'umd',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PACKAGE_VERSION: JSON.stringify(pkg.version),
      },
    }),
  ],
});
