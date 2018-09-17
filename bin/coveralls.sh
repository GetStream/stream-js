#!/bin/bash
set -e
nyc  --reporter=lcov mocha --require @babel/register bin/run-node-unit-tests.js
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
rm -rf ./coverage
