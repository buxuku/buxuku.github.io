#!/bin/bash
set -ev
export TZ='Asia/Shanghai'

# 先 clone 再 commit，避免直接 force commit
# 不然整个 branch 就总是只有一个 commit，不好看
git clone -b master git@github.com:buxuku/buxuku.github.io.git .deploy_git

cd .deploy_git
git checkout master
mv .git/ ../public/
cd ../public

git add .
git commit -m "Site updated: `date +"%Y-%m-%d %H:%M:%S"`"

git push origin master:master --force --quiet

rsync -rav -e ssh ./ gcp:/data/blog
rsync -rav -e ssh ./ aliyun:/data/blog
