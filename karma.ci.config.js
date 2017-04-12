var baseConfig = require('./karma.config.js');

module.exports = function(config) {

    baseConfig(config);

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
        // 'SL_IE_13': {
        //     base: 'SauceLabs',
        //     browserName: 'microsoftedge',
        //     version: '13',
        //     platform: 'Windows 10',
        // },
        'SL_IE_14': {
            base: 'SauceLabs',
            browserName: 'microsoftedge',
            version: '14',
            platform: 'Windows 10',
        },
    };

    config.set({
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        sauceLabs: {
            testName: 'Stream-JS Browser Tests',
            public: "public",
            connectOptions: {
                // verbose: true,
                // verboseDebugging: true,
            }
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),

        reporters: ['dots', 'saucelabs'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        captureTimeout: 60000,
        // Somehow karma doesn't capture intermediate behavior and only 
        // captures once an entire suite is complete. This timeout will
        // guarantee that the browser will have enough time to do this:

        // Integration tests can take very long we will give the browser
        // 300 seconds to complete these.
        browserNoActivityTimeout: 300 * 1000,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: 3
    });
};
