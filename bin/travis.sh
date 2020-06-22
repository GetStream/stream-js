#!/bin/bash
set -e
yarn run build
if [ "${CLOUD_TESTS:='no'}" == "yes" ]; then
    yarn run test-cloud
else
    yarn test
fi
yarn run coverage
if [ "${RUN_LINTERS:='no'}" == "yes" ]; then
    yarn run lint
    yarn run dtslint
fi
