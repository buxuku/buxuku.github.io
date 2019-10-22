title: centos下编译安装apache
date: 2014-11-17 15:11:49
tags: 
- centos
- apache
categories: 
- linux
---
## 一.安装环境

>centos6.5最小化安装/AWS centos

## 二.所需工具

>apr-1.5.1
>apr-util-1.5.4
>httpd-2.4.10
>pcre-8.36
<!-- more -->
## 三.安装步骤

### 1.环境准备

在centos最小化安装情况下，首先我们需要先安装以下几个包

```
yum install wget
yum install gcc
yum install gcc-c++
```

### 2.下载软件包,这里我们把软件下载在/usr/local/src里面

```
wget http://mirrors.cnnic.cn/apache/httpd/httpd-2.4.10.tar.gz
wget http://mirrors.cnnic.cn/apache//apr/apr-1.5.1.tar.gz
wget http://mirrors.cnnic.cn/apache//apr/apr-util-1.5.4.tar.gz
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.36.tar.gz
```

### 3.解压所有的软件包

```
tar -zxvf httpd-2.4.10.tar.gz
tar -zxvf apr-1.5.1.tar.gz
tar -zxvf apr-util-1.5.4.tar.gz
tar -zxvf pcre-8.36.tar.gz
```

### 4.apache安装

首先把pcre安装上

```
cd pcre-8.36
./configure
make && make install
```

然后把apr移动到httpd安装包里面

```
cd ../
mv apr-1.5.1 httpd-2.4.10/srclib/apr
mv apr-util-1.5.4 httpd-2.4.10/srclib/apr-util
cd httpd-2.4.10
```

配置httpd编译参数

```
./configure --with-included-apr --enable-nonportable-atomics=yes --with-z
```

出奇的简单，因为默认就有 --enable-mods-shared=most ，模块化安装，以后自行到 httpd.conf 中决定是否开启模块，所以什么 --enable-deflate --enable-rewrite --enable-blablabla 等就完全不必要了。

默认安装的是 event mpm，如果要用 worker ，就需要--with-mpm=worker，或者干脆 --enable-mpms-shared=all，这样event、worker、prefork就会以模块化的方式安装，要用哪个就在 httpd.conf 里配置就好了

编译安装httpd

```
make && make install
```

软件已经默认安装到/usr/local/apache2里面了，对应的配置文件是conf/httpd.conf

## 四.添加到系统服务和自启

```
cp /usr/local/apache2/bin/apachectl /etc/init.d/httpd
vi /etc/init.d/httpd
```

在首行 #!/bin/sh 下面加入两行：

```
# chkconfig: 35 85 15
# description: Activates/Deactivates Apache 2.4.10
```

加入开机自启

```
chkconfig --add httpd
chkconfig httpd on
```

接下来我们便可以启动apache了

```
service httpd start
```

打开浏览器，我们应该能够看到大大的`It works!`几个字，表明我们已经正常安装了。

## 五.常见问题

### 1.apache已经正常安装了，但外网无法访问

这是因为在默认情况，ceontos的防火墙关闭了80端口，开启方法如下

```
/sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT #允许80端口
/etc/rc.d/init.d/iptables save #保存
/etc/init.d/iptables restart #重启防火墙
```