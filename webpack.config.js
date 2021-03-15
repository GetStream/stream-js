const path = require('path');

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
});
