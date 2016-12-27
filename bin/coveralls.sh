#!/bin/bash
set -e
istanbul cover ./bin/run-node-unit-tests.js --report lcov > /dev/null
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
rm -rf ./coverage