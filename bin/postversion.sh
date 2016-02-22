#!/bin/bash
set -e
gulp docs
git add docs/getstream/
git commit -m 'update docs'
gulp write_bower
git commit -m 'publish new version on Bower' 
git push
git push origin --tags