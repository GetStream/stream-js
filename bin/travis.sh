#!/bin/bash
set -e
./node_modules/.bin/webpack
if [ "${CLOUD_TESTS:='no'}" == "yes" ]; then
    npm run test-cloud
else
    npm test
fi
./bin/coveralls.sh
if [ "${RUN_LINTERS:='no'}" == "yes" ]; then
    npm run lint
fi
npm install -g bower
bower install getstream
