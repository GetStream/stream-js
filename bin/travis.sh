#!/bin/bash
set -e
./node_modules/.bin/webpack
npm test
./bin/coveralls.sh
if [ "$(node --version)" == "v9.11.1" ]; then
    ./node_modules/.bin/eslint src/**/*.js;
fi
npm install -g bower
bower install getstream
