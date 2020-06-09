#!/bin/bash
set -e
npm run coverage
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
rm -rf ./coverage
