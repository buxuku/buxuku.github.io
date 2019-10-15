title: centos编译安装php
date: 2014-11-17 15:33:29
tags: 
- centos
- php
categories: 
- Linux
---
## 一.安装环境

>centos6.5最小化安装/AWS centos

## 二.所需工具

>php-5.5.5
<!-- more -->
## 三.安装步骤

### 1.编译安装php环境需要的devel包

```
yum install libxml2-devel gd-devel libmcrypt-devel libcurl-devel openssl-devel
```
### 2.下载，解压php

```
cd /usr/local/src
wget http://us3.php.net/get/php-5.5.5.tar.gz/from/cn2.php.net/mirror
tar -xvf php-5.5.5.tar.gz
cd php-5.5.5
```

### 3.设置编译参数,安装

```
./configure --with-apxs2=/usr/local/apache2/bin/apxs --disable-cli --enable-shared --with-libxml-dir --with-gd --with-openssl --enable-mbstring --with-mcrypt --with-mysqli --with-mysql --enable-opcache --enable-mysqlnd --enable-zip --with-zlib-dir --with-pdo-mysql --with-jpeg-dir --with-freetype-dir --with-curl --without-pdo-sqlite --without-sqlite3
make && make install
```
我已经尽量的在参数上做了精简，用以上参数编译安装好的 php 运行 wordpress, joomla, ip board 等常见的博客、论坛程序都是没有问题的，因为有了 --disable-cli，所以就没法 make test 了，安装好以后也没法 php -v 了。安装吧：

### 4.整合php apache

```
cp php.ini-production /usr/local/lib/php.ini
vi /usr/local/apache2/conf/httpd.conf
```

在httpd.conf里面添加如下内容

```
AddType application/x-httpd-php .php
AddType application/x-httpd-php-source .phps
#应该将以上两句添加在其他AddType之后。
```

```
LoadModule php5_module modules/libphp5.so
#上面那行可能在编译安装 php 的过程中已经由系统自动添加了
<FilesMatch \.php$>
	SetHandler application/x-httpd-php
</FilesMatch>
```

接下来可以重启php查看是否安装成功了。

我们可以在apache默认目录下面新建一个php文件测试一下

```
vi /usr/local/apache2/htdocs/php.php
```

``` php
<?php
echo "php is OK";
?>
```