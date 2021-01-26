title: centos编译安装mysql
date: 2014-11-18 09:21:29
updated: 2014-11-18 09:21:29
tags: 
- centos
- mysql
categories: 
- linux
---
## 一.安装环境

>centos6.5最小化安装/AWS centos

## 二.所需工具

>cmake-3.1.0-rc2
>mysql-5.7.4-m14.tar.gz
<!-- more -->
## 三.安装步骤

### 1.下载所需工具,解压

```
wget http://downloads.mysql.com/archives/get/file/mysql-5.7.4-m14.tar.gz
wget http://www.cmake.org/files/v3.1/cmake-3.1.0-rc2.tar.gz
tar -zxvf mysql-5.7.4-m14.tar.gz
tar -zxvf cmake-3.1.0-rc2.tar.gz
```

### 2.安装cmake

因为从mysql 5.5形如，需要使用cmake方便进行安装了，所以我们首先安装cmake

```
cd cmake-3.1.0-rc2
./bootstrap 
gmake
gmake install
```

### 3.安装mysql

#### 创建用户，组和目录

```
groupadd mysql #添加组
useradd mysql -g mysql -s /sbin/nologin #添加新用户，禁止登录shell
mkdir /usr/local/mysql #创建安装目录
mkdir /var/mysql
mkdir /var/mysql/data #创建数据目录
chown -R mysql:mysql /usr/local/mysql/ 
chown -R mysql:mysql /var/mysql/data #予数据存放目录权限
```

#### 编译安装mysql

```
cd mysql-5.7.4
cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql/ -DMYSQL_UNIX_ADDR=/tmp/mysqld.sock -DMYSQL_USER=mysql -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_ARCHIVE_STORAGE_ENGINE=1 -DWITH_BLACKHOLE_STORAGE_ENGINE=1 -DWITH_PERFSCHEMA_STORAGE_ENGINE=1 -DWITH_READLINE=1 -DWITH_DATADIR=/var/mysql/data/  -DWITH-TCP_PORT=3306 -DENABLE_DOWNLOADS=1
make && make install
```

#### 初始化安装

```
chmod +x scripts/mysql_install_db
scripts/mysql_install_db --basedir=/usr/local/mysql --datadir=/var/mysql/data --user=mysql 
```

#### 配置mysql

```
cp support-files/my-medium.cnf /usr/local/mysql/my.cnf 
```

修改my.cnf参数，没有则加入如下： 

```
basedir = /usr/local/mysql #（不配置的话默认为$PREFIX_DIR）
datadir = /var/mysql/data #（不配置的话默认为$PREFIX_DIR/data）
log-error = /usr/local/mysql/mysql_error.log #（不配置的话默认为$PREFIX_DIR/data/$hostname.err）
pid-file = /usr/local/mysql/mysql.pid #（不配置的话默认为$PREFIX_DIR/data/$hostname.pid）
user = mysql
tmpdir = /tmp #（不配置的话默认为/tmp）

```