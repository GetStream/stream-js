require('dotenv').config(); // eslint-disable-line import/no-extraneous-dependencies
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const webpackConfig = require('./webpack.config.js')(); // eslint-disable-line import/extensions

// Webpack config tweaks for test-time
delete webpackConfig.entry;
delete webpackConfig.output;
webpackConfig.devtool = 'inline-source-map';
webpackConfig.plugins = [new webpack.EnvironmentPlugin(process.env)];

// Karma config
module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'webpack'],

    // list of files / patterns to load in the browser
    files: [
      'test/browser-test-helper.js',
      'test/unit/common/**/*_test.js',
      'test/unit/browser/**/*_test.js',
      'test/integration/common/**/*_test.js',
      'test/integration/browser/**/*_test.js',
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/browser-test-helper.js': ['webpack'],
      'test/unit/common/**/*_test.js': ['webpack', 'sourcemap'],
      'test/unit/browser/**/*_test.js': ['webpack', 'sourcemap'],
      'test/integration/common/**/*_test.js': ['webpack', 'sourcemap'],
      'test/integration/browser/**/*_test.js': ['webpack', 'sourcemap'],
    },

    // Webpack configuration for webpack preprocessor
    webpack: webpackConfig,
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only',
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    browserNoActivityTimeout: 60000,
  });
};
