Testing & stream-js
==================

[![Build Status](https://travis-ci.org/GetStream/stream-js.svg?branch=master)](https://travis-ci.org/GetStream/stream-js)
[![Coverage Status](https://img.shields.io/coveralls/GetStream/stream-js.svg)](https://coveralls.io/r/GetStream/stream-js?branch=master)
[![Sauce Test Status](https://saucelabs.com/buildstatus/tthisk)](https://saucelabs.com/u/tthisk)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/tthisk.svg)](https://saucelabs.com/u/tthisk)

# Organisation of the tests directory

```bash
test
└── unit # Unit tests
    ├── browser # files needed by tests
    ├── common # files needed by tests
    ├── node # files needed by tests
    └── utils # files needed by tests
```

We use [mocha](https://mochajs.org/).

To run individual tests:
```
# Whole file
mocha test/unit/common/client_test.js
# Whole dir
mocha test/unit/common/*_test.js
# All unit tests
npm test
```


# Coverage

We like to see that the metrics being generated are actually covered by tests. To generate the coverage report you can run ``npm run coverage``, this will invoke the nodejs istanbul coverage reporter and store its output in ``/coverage``.

Coverage is also tracked by [coveralls.io](https://coveralls.io/github/GetStream/stream-js). Note, however, that Travis does not enforce coverage. It will not fail the test run if you don't have 100% coverage.


# Travis

Its configuration is stored in [.travis.yml](../.travis.yml).

It's running unit tests inside the Node environment.


# SauceLabs

Its configuration is stored in [karma.ci.config.js](../karma.ci.config.js).

It's using the karma test runner to execute browser unit tests inside several different browsers on multiple platforms. We use a [karma plugin](https://github.com/karma-runner/karma-sauce-launcher) to enable saucelabs integration for karma.

To add a new browser to the test run edit the karma configuration file.
