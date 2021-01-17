#!/bin/bash
set -ev
export TZ='Asia/Shanghai'

# 先 clone 再 commit，避免直接 force commit
# 不然整个 branch 就总是只有一个 commit，不好看
git clone -b master git@github.com:buxuku/buxuku.github.io.git .deploy_git

cd .deploy_git

# master分支更新readme文件
git checkout master
git add ./public/README.md
git commit -m "README updated: `date +"%Y-%m-%d %H:%M:%S"`"
git push origin master:master --force --quiet

# gh-pages更新部署文件
git checkout gh-pages
mv .git/ ../public/
cd ../public

git add .

git push origin gh-pages:gh-pages --force --quiet

rsync -rav -e ssh ./ gcp:/data/blog
rsync -rav -e ssh ./ aliyun:/data/blog
