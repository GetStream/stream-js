var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var RewirePlugin = require("rewire-webpack");
var signing = require('./src/lib/signing');

delete webpackConfig['entry'];
delete webpackConfig['output'];

function defineFeed(feedGroup, userId, readOnly) {
    return {
        feedGroup: feedGroup,
        userId: userId,
        signature: signing.sign(process.env.STREAM_API_SECRET, feedGroup + userId),
        token: signing.JWTScopeToken(process.env.STREAM_API_SECRET, '*', readOnly ? 'read' : '*', {
            feedId: feedGroup + userId,
            expireTokens: true,
        }),
    };
}

webpackConfig['devtool'] = 'inline-source-map';
webpackConfig['plugins'] = [
    new webpack.DefinePlugin({
        'IS_BROWSER_ENV': true,
        'process.env.STREAM_API_KEY': JSON.stringify(process.env.STREAM_API_KEY),
        'process.env.STREAM_API_SECRET': JSON.stringify(process.env.STREAM_API_SECRET),
        'process.env.STREAM_APP_ID': JSON.stringify(process.env.STREAM_APP_ID),

        // Pre generated feed identifiers + tokens
        'USER_1': JSON.stringify(defineFeed('user', '11-' + Date.now())),
        'USER_2': JSON.stringify(defineFeed('user', '22-' + Date.now())),
        'USER_3': JSON.stringify(defineFeed('user', '33-' + Date.now())),
        'USER_4': JSON.stringify(defineFeed('user', '44-' + Date.now())),
        'AGG_2': JSON.stringify(defineFeed('aggregated', '22-' + Date.now())),
        'AGG_3': JSON.stringify(defineFeed('aggregated', '33-' + Date.now())),
        'FLAT_3': JSON.stringify(defineFeed('flat', '33-' + Date.now())),
        'SECRET_3': JSON.stringify(defineFeed('secret', '33-' + Date.now())),
        'NOTI_3': JSON.stringify(defineFeed('notification', '33-' + Date.now())),
        'USER_READ_ONLY_1': JSON.stringify(defineFeed('user', '11-' + Date.now(), true)),
    }),
    new webpack.NormalModuleReplacementPlugin(/(jsonwebtoken|http-signature|batch_operations|qs)/, path.join(__dirname, "src", "/missing.js")),
    new RewirePlugin(),
];

module.exports = function(config) {


    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
          'test/integration/browser/**/*_test.js',
          'test/integration/common/**/*_test.js',
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
            'test/integration/browser/**/*_test.js': [ 'webpack', 'sourcemap' ],
            'test/integration/common/**/*_test.js': [ 'webpack', 'sourcemap' ],
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
