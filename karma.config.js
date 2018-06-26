var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js')();

// Webpack config tweaks for test-time
delete webpackConfig['entry'];
delete webpackConfig['output'];
webpackConfig['devtool'] = 'inline-source-map';
webpackConfig['plugins'] = [
    new webpack.EnvironmentPlugin([
        'STREAM_API_KEY',
        'STREAM_API_SECRET',
        'STREAM_APP_ID',
    ])
];
webpackConfig['node']['Buffer'] = true;
webpackConfig['module']['rules'].push({ test: /\.json$/, exclude:/node_modules/, loader: 'json-loader' });

// Karma config
module.exports = function(config) {

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
          'test/unit/common/**/*_test.js',
          'test/unit/browser/**/*_test.js',
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/unit/common/**/*_test.js': [ 'webpack', 'sourcemap' ],
            'test/unit/browser/**/*_test.js': [ 'webpack', 'sourcemap' ],
        },

        // Webpack configuration for webpack preprocessor
        webpack: webpackConfig,
        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
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
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

    });
};
