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
    new webpack.BannerPlugin({
      // run after minification so terser doesn't extract the banner into LICENSE.txt
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
      banner: [
        `getstream v${pkg.version}`,
        'DEPRECATED: loading this UMD bundle via <script> (CDN or direct download) is deprecated.',
        'Install from npm (`npm install getstream`) and use a bundler instead.',
        'See https://github.com/GetStream/stream-js#installation',
      ].join('\n'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        PACKAGE_VERSION: JSON.stringify(pkg.version),
      },
    }),
  ],
});
