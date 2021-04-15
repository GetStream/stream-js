# Testing & stream-js

[![Build Status](https://travis-ci.org/GetStream/stream-js.svg?branch=main)](https://travis-ci.org/GetStream/stream-js)
[![Coverage Status](https://img.shields.io/coveralls/GetStream/stream-js.svg)](https://coveralls.io/r/GetStream/stream-js?branch=main)

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

# Continuous Integration

Its configuration is stored in [.github/workflows/build/ci.yml](../.github/workflows/ci.yml).

There is also size action compares your final bundles with the previous version and notifies you with the amount of changes.

Overall, it lints the code and runs unit tests inside the Node environment and reports code coverage and related size changes in final bundles.

# Add an integration test

Please read first the [integration test description](#integration-tests).
