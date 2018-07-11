#!/bin/bash
set -e
./node_modules/.bin/webpack
npm test
./bin/coveralls.sh
if [ ${RUN_LINTERS:="no"} == "yes" ]; then
    npm run lint
    # ./node_modules/.bin/dtslint types/getstream
fi
npm install -g bower
bower install getstream
