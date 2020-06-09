#!/bin/bash
set -e
npm run build
if [ "${CLOUD_TESTS:='no'}" == "yes" ]; then
    npm run test-cloud
else
    npm test
fi
npm run coverage
if [ "${RUN_LINTERS:='no'}" == "yes" ]; then
    npm run lint
    npm run dtslint
fi
