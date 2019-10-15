title: centos下编译安装php出错整理
date: 2014-11-17 17:19:19
tags:
- php
- linux
- centos
categories: 
- Linux
---
### 1.Sorry, I cannot run apxs

```
./configure --with-apxs2=/usr/local/apache2/bin/apxs --disable-cli --enable-shared --with-libxml-dir --with-gd --with-openssl --enable-mbstring --with-mcrypt --with-mysqli --with-mysql --enable-opcache --enable-mysqlnd --enable-zip --with-zlib-dir --with-pdo-mysql --with-jpeg-dir --with-freetype-dir --with-curl --without-pdo-sqlite --without-sqlite3
```
<!-- more -->
在编译时报错

```
Sorry, I cannot run apxs. ***

Sorry, I cannot run apxs. Possible reasons follow:

1. Perl is not installed
2. apxs was not found. Try to pass the path using --with-apxs2=/path/to/apxs
3. Apache was not built using --enable-so (the apxs usage page is displayed)

configure: error: Sorry, I cannot run apxs. Either you need to install Perl or you need to pass the absolute path of apxs by using --with-apxs=/absolute/path/to/apxs
```
没有指明正确的perl执行程序的位置

解决办法

```
vi /usr/local/apache/bin/apxs
```

把第一行`#!/replace/with/path/to/perl/interpreter -w`修改为

```
#!/usr/bin/perl -w
```

### 2.mcrypt.h not found. Please reinstall libmcrypt

接上一步，重新编译时，又出现如下错误

```
mcrypt.h not found. Please reinstall libmcrypt
```

这是因为centos源不能安装libmcrypt-devel，由于版权的原因没有自带mcrypt的包

解决办法

```
cd /usr/local/src
wget http://softlayer.dl.sourceforge.net/sourceforge/mcrypt/libmcrypt-2.5.8.tar.gz
tar -zxvf libmcrypt-2.5.8.tar.gz
cd /usr/local/src/libmcrypt-2.5.8
./configure --prefix=/usr/local
make
make install
```
