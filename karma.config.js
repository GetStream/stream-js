var webpackConfig = require('./webpack.config.js');
// Karma configuration
// Generated on Thu Oct 06 2016 16:59:45 GMT+0200 (CEST)

delete webpackConfig['entry'];
delete webpackConfig['output'];

webpackConfig['devtool'] = 'inline-source-map';

module.exports = function(config) {

    var customLaunchers = {
        'SL_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome',
        },
        'SL_FireFox': {
            base: 'SauceLabs',
            browserName: 'firefox',
        },
        'SL_Safari': {
            base: 'SauceLabs',
            browserName: 'safari',
        },
        'SL_IE_9': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9',
        },
        'SL_IE_10': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8',
            version: '10',
        },
        'SL_IE_11': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11',
        },
        'SL_IE_13': {
            base: 'SauceLabs',
            browserName: 'microsoftedge',
            platform: 'Windows 10',
        },
    };

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
          // 'test/integration/browser/**/*_test.js',
          // 'test/integration/common/**/*_test.js',
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
        reporters: ['dots', 'saucelabs'],

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
        // browsers: ['Chrome'],
        sauceLabs: {
            testName: 'Stream-JS Browser Tests',
            public: "public",
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
