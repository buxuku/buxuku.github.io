---
title: nodejs之npm包管理不完全手记
date: 2016-10-23 08:29:32
updated: 2016-10-23 08:29:32
tags:
- nodejs
- npm
category:
- 软件
---

## 单独更新npm

```
varsu@DESKTOP-V7HEGUG MINGW64 /d/temp/npm
$ npm -v
2.15.1

varsu@DESKTOP-V7HEGUG MINGW64 /d/temp/npm
$ npm install npm --global
C:\Users\varsu\AppData\Roaming\npm\npm -> C:\Users\varsu\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js
npm@3.10.9 C:\Users\varsu\AppData\Roaming\npm\node_modules\npm

varsu@DESKTOP-V7HEGUG MINGW64 /d/temp/npm
$ npm -v
3.10.9
```
<!--more-->
## 全局安装和卸载npm包

```
varsu@DESKTOP-V7HEGUG MINGW64 /d/temp/npm
$ npm install forever -g
varsu@DESKTOP-V7HEGUG MINGW64 /d/temp/npm
$ npm uninstall forever -g
```

## 在当前项目中安装卸载包

```
D:\temp\npm>npm install underscore
D:\temp\npm
`-- underscore@1.8.3

npm WARN enoent ENOENT: no such file or directory, open 'D:\temp\npm\package.json'
npm WARN npm No description
npm WARN npm No repository field.
npm WARN npm No README data
npm WARN npm No license field.

D:\temp\npm>tree
文件夹 PATH 列表
卷序列号为 000000B9 8841:2A63
D:.
└─node_modules
    └─underscore

D:\temp\npm>npm uninstall underscore
- underscore@1.8.3 node_modules\underscore
npm WARN enoent ENOENT: no such file or directory, open 'D:\temp\npm\package.json'
npm WARN npm No description
npm WARN npm No repository field.
npm WARN npm No README data
npm WARN npm No license field.
```
## 查看已经安装的包

```
D:\temp\npm>npm ls
D:\temp\npm
`-- underscore@1.8.3
```

或者加上参数`-g`查看全局范围安装的包

## 安装指定版本的包

```
D:\temp\npm>npm info underscore

{ name: 'underscore',
  description: 'JavaScript\'s functional programming helper library.',
  'dist-tags': { latest: '1.8.3', stable: '1.8.3' },
  versions:
   [ '1.0.3',
     '1.0.4',
     '1.1.0',
     '1.1.1',
     '1.1.2',
     '1.1.3',
     '1.1.4',
     '1.1.5',
     '1.1.6',
     '1.1.7',
     '1.2.0',
     '1.2.1',
     '1.2.2',
     '1.2.3',
     '1.2.4',
     '1.3.0',
     '1.3.1',
     '1.3.2',
     '1.3.3',
     '1.4.0',
     '1.4.1',
     '1.4.2',
     '1.4.3',
     '1.4.4',
     '1.5.0',
     '1.5.1',
     '1.5.2',
     '1.6.0',
     .............

D:\temp\npm>npm install underscore@1.6.0
D:\temp\npm
`-- underscore@1.6.0

```

## 使用package.json进行包管理

初始化一个项目，生成package.json 项目名不能有空格
```
D:\temp\npm>npm init
{
  "name": "my_npm",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "buxuku",
  "license": "ISC"
}
```
在package.json中安装npm包
```
D:\temp\npm>npm install underscore --save
my_npm@1.0.0 D:\temp\npm
`-- underscore@1.8.3


D:\temp\npm>npm install babel-cli --save-dev
my_npm@1.0.0 D:\temp\npm
`-- babel-cli@6.16.0
```
卸载package.json中的包

```
D:\temp\npm>npm uninstall underscore --save
- underscore@1.8.3 node_modules\underscore
```
## 更新package.json中包的版本

```
D:\temp\npm>npm install gulp@2.0.0 --save-dev
```
检查更新

```
D:\temp\npm>npm outdated
Package  Current  Wanted  Latest  Location
gulp       2.0.0   2.7.0   3.9.1  my_npm
```
Wanted表示可以更新到的版本号，但它最新的却是3.9.1，打开package.json,我们可以看到
```
"devDependencies": {
  "babel-cli": "^6.16.0",
  "gulp": "^2.0.0"
},
```
包后面的`^`表示只更新第二位数据的版本号，如果改成`~`则表示只更新最后一位的版本号，如果版本号全部改成`*`,刚表示更新全部的版本号.

改成`~`

```
D:\temp\npm>npm outdated
Package  Current  Wanted  Latest  Location
gulp       2.0.0   2.0.1   3.9.1  my_npm
```

改成`*`
```
D:\temp\npm>npm outdated
Package  Current  Wanted  Latest  Location
gulp       2.0.0   3.9.1   3.9.1  my_npm
```
注意，一般在开发项目中最好不要改成`*`,因为大的版本号的更新可能会导致原来的功能不能正常使用。

## 使用cnpm或者nrm修改npm源

cnpm的使用参见淘宝的cnpm,这里主要使用nrm来管理切换npm使用的源

安装

```
D:\temp\npm>npm install nrm -g
```

查看可以使用的源

```
D:\temp\npm>nrm ls

* npm ---- https://registry.npmjs.org/
  cnpm --- http://r.cnpmjs.org/
  taobao - https://registry.npm.taobao.org/
  nj ----- https://registry.nodejitsu.com/
  rednpm - http://registry.mirror.cqupt.edu.cn/
  npmMirror  https://skimdb.npmjs.com/registry/
  edunpm - http://registry.enpmjs.org/
```
测试各个源的连接速度

```
D:\temp\npm>nrm test

* npm ---- 1520ms
  cnpm --- 300ms
  taobao - 445ms
  nj ----- Fetch Error
  rednpm - Fetch Error
  npmMirror  12046ms
  edunpm - Fetch Error
```

切换npm的源

```
D:\temp\npm>nrm use cnpm


   Registry has been set to: http://r.cnpmjs.org/

 D:\temp\npm>nrm ls

   npm ---- https://registry.npmjs.org/
 * cnpm --- http://r.cnpmjs.org/
   taobao - https://registry.npm.taobao.org/
   nj ----- https://registry.nodejitsu.com/
   rednpm - http://registry.mirror.cqupt.edu.cn/
   npmMirror  https://skimdb.npmjs.com/registry/
   edunpm - http://registry.enpmjs.org/
```
