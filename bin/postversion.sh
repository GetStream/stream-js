#!/bin/bash
set -e
gulp docs
git add docs/getstream/
git commit -m 'update docs'
node ./bin/bower-up.js
git add bower.json
git commit -m 'publish new version on Bower' 
git push origin master
git push origin --tags
