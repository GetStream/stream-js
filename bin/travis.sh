#!/bin/bash
set -e
./node_modules/.bin/webpack
npm test
./bin/coveralls.sh
if [ ${RUN_LINTERS:="no"} == "yes" ]; then
    ./node_modules/.bin/prettier --no-config --list-different "./{src,test}/**";
    ./node_modules/.bin/eslint --max-warnings 0 "./{src,test}/**";
    # ./node_modules/.bin/dtslint types/getstream
fi
npm install -g bower
bower install getstream
