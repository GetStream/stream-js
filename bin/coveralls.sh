istanbul cover ./bin/run-node-unit-tests.js --report lcovonly -- -R spec
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls.js
rm -rf ./coverage