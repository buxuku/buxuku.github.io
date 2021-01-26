title: mysql相关错误整理
date: 2015-04-02 10:01:29
updated: 2015-04-02 10:01:29
tags:
- mysql
categories:
- mysql
---

# 一.Can't find file: './mysql/plugin.frm' (errno: 13)

公司的服务器mysql一直是以root用户启动起来的，运行一直正常，今天给linux重新建了一个root组的用户，以这个用户的身份登录后，重启mysql一直失败，然后就把所有mysql运程结束了，以该用户身份启动mysql时，在错误日志中一直提示如下：
<!-- more -->
```
150402 09:49:34 mysqld_safe mysqld from pid file /usr/local/mysql/data/iZ9423zm65xZ.pid ended
150402 09:50:44 mysqld_safe mysqld from pid file /usr/local/mysql/data/iZ9423zm65xZ.pid ended
150402 09:51:16 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/data
150402  9:51:16 [Warning] Can't create test file /usr/local/mysql/data/iZ9423zm65xZ.lower-test
150402  9:51:16 [Warning] Can't create test file /usr/local/mysql/data/iZ9423zm65xZ.lower-test
/usr/local/mysql/bin/mysqld: Can't find file: './mysql/plugin.frm' (errno: 13)
150402  9:51:16 [ERROR] Can't open the mysql.plugin table. Please run mysql_upgrade to create it.
150402  9:51:16 InnoDB: The InnoDB memory heap is disabled
150402  9:51:16 InnoDB: Mutexes and rw_locks use GCC atomic builtins
150402  9:51:16 InnoDB: Compressed tables use zlib 1.2.3
150402  9:51:16 InnoDB: Initializing buffer pool, size = 128.0M
150402  9:51:16 InnoDB: Completed initialization of buffer pool
150402  9:51:16  InnoDB: Operating system error number 13 in a file operation.
InnoDB: The error means mysqld does not have the access rights to
InnoDB: the directory.
InnoDB: File name ./ibdata1
InnoDB: File operation call: 'open'.
InnoDB: Cannot continue operation.
150402 09:51:16 mysqld_safe mysqld from pid file /usr/local/mysql/data/iZ9423zm65xZ.pid ended
```
解诀办法：其实mysql配置没有问题，只是在启动时需要加是sudo来运行，`sudo service mysqld start`,启动正常后，再运行`sudo service mysqld restart`也是正常的。
