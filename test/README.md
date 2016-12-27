Testing & stream-js
==================

[![Build Status](https://travis-ci.org/GetStream/stream-js.svg?branch=master)](https://travis-ci.org/GetStream/stream-js)
[![Coverage Status](https://img.shields.io/coveralls/GetStream/stream-js.svg)](https://coveralls.io/r/GetStream/stream-js?branch=master)
[![Sauce Test Status](https://saucelabs.com/buildstatus/tthisk)](https://saucelabs.com/u/tthisk)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/tthisk.svg)](https://saucelabs.com/u/tthisk)

# Lint

Your code should always be clean when doing `npm run lint`. It runs `eslint`.


# Organisation of the tests directory

```bash
test
├── integration # Integration tests (only ran on release)
│   ├── browser # tests ran in browser environment
│   ├── common # tests ran in both node and browser environment 
│   ├── node # tests only ran in the node environment 
│   └── utils # files containing configuration and mocks
└── unit # Unit tests (run on Travis)
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


# Unit tests



# Integration tests

They ensure that the client is correctly talking to the stream API which is necessary for most checks.

They are great because they mimic a real setup where someone would perform an API request to the Stream API. Using mocks or pre-saved responses often hides corner-cases and are the source of lots of issues.


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

# Add an integration test

Please read first the [integration test description](#integration-tests).