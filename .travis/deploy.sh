#!/bin/bash
set -ev
export TZ='Asia/Shanghai'

# 先 clone 再 commit，避免直接 force commit
# 不然整个 branch 就总是只有一个 commit，不好看
git clone -b master git@github.com:buxuku/buxuku.github.io.git .deploy_git

cd .deploy_git

# gh-pages更新部署文件
git fetch origin
git checkout -b gh-pages origin/gh-pages
cp -R .git/ ../public/
cd ../public
cp ../README.md ./

git add .

git commit -m "site updated: `date +"%Y-%m-%d %H:%M:%S"`"
git push origin gh-pages:gh-pages --force --quiet

rsync -rav --exclude '.git' -e ssh ./ aliyun:/data/blog

cd ../.deploy_git
# master分支更新readme文件
git checkout master
cp ../README.md ./
git add README.md
git commit -m "[ci skip] README updated: `date +"%Y-%m-%d %H:%M:%S"`"
git push origin master:master --force
