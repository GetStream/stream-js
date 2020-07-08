# Testing & stream-js

[![Build Status](https://travis-ci.org/GetStream/stream-js.svg?branch=master)](https://travis-ci.org/GetStream/stream-js)
[![Coverage Status](https://img.shields.io/coveralls/GetStream/stream-js.svg)](https://coveralls.io/r/GetStream/stream-js?branch=master)

# Lint

Your code should always be clean when doing `yarn run lint`. It runs `eslint`.

# Organization of the test directories

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
yarn test
```

# Unit tests

# Integration tests

They ensure that the client is correctly talking to the stream API which is necessary for most checks.

They are great because they mimic a real setup where someone would perform an API request to the Stream API. Using mocks or pre-saved responses often hides corner-cases and are the source of lots of issues.

# Coverage

We like to see that the metrics being generated are actually covered by tests. To generate the coverage report you can run `yarn run coverage`, this will invoke the nodejs istanbul coverage reporter.

Coverage is also tracked by [codecov](https://codecov.io/gh/GetStream/stream-js). Note, however, that continuous integration does not enforce coverage. It will not fail the test run if you don't have 100% coverage.

# Continuous Integration

Its configuration is stored in [.github/workflows/build/ci.yml](../.github/workflows/ci.yml).

There is also size action compares your final bundles with the previous version and notifies you with the amount of changes.

Overall, it lints the code and runs unit tests inside the Node environment and reports code coverage and related size changes in final bundles.

# Add an integration test

Please read first the [integration test description](#integration-tests).
