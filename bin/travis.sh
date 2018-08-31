#!/bin/bash
set -e
./node_modules/.bin/webpack
if [ "${CLOUD_TESTS:='no'}" == "yes" ]; then
    npm test-cloud
else
    npm test
fi
./bin/coveralls.sh
if [ "${RUN_LINTERS:='no'}" == "yes" ]; then
    ./node_modules/.bin/eslint src/**/*.js;
    # ./node_modules/.bin/dtslint types/getstream
fi
npm install -g bower
bower install getstream
