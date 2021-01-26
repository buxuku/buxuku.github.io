title: linux常用命令
date: 2015-04-02 10:10:46
updated: 2015-04-02 10:10:46
tags:
- linux
categories:
- linux
---

# 一.查看进程详细情况

比如我要看下mysql启动的参数
```
ps aux |grep mysql
```
输出结果

```
root     21992  0.0  0.0  11340  1396 pts/2    S    09:58   0:00 /bin/sh /usr/local/mysql/bin/mysqld_safe --datadir=/usr/local/mysql/data --pid-file=/usr/local/mysql/data/iZ9423zm65xZ.pid
mysql    22070  0.0  1.1 1070516 46072 pts/2   Sl   09:58   0:00 /usr/local/mysql/bin/mysqld --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data --plugin-dir=/usr/local/mysql/lib/plugin --user=mysql --log-error=/usr/local/mysql/data/iZ9423zm65xZ.err --pid-file=/usr/local/mysql/data/iZ9423zm65xZ.pid
car91    26054  0.0  0.0 103248   824 pts/2    R+   10:12   0:00 grep mysql

```
<!-- more -->
# 二.用户的切换

>1.切换到root用户:`su`
>2.切换回原来的用户:`exit`
>3.切换到指定用户:`su xxx` (xxx为指定的用户名)

# 三.添加root组用户并赋于sudo权限

```
useradd car91 -g root #添加root组用户car91
passwd car91 为car91添加密码

```
这样创建用户是,是不能直接使用sudo命名的,还需要如下操作

```
chmod u+w /etc/sudoers #添加sudo文件的写权限
vi /etc/sudoers #找到这行 root ALL=(ALL) ALL,在他下面添加xxx ALL=(ALL) ALL (这里的xxx是你的用户名)
chmod u-w /etc/sudoers #删除写权限
```

第二步添加的内容可以为

>youuser            ALL=(ALL)                ALL  #允许用户youuser执行sudo命令(需要输入密码).
>%youuser           ALL=(ALL)                ALL  #允许用户组youuser里面的用户执行sudo命令(需要输入密码).
>youuser            ALL=(ALL)                NOPASSWD: ALL  #允许用户youuser执行sudo命令,并且在执行的时候不输入密码.
>%youuser           ALL=(ALL)                NOPASSWD: ALL  #允许用户组youuser里面的用户执行sudo命令,并且在执行的时候不输入密码.

