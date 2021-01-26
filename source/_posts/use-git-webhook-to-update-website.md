---
title: 利用git webhook 来同步更新代码
date: 2017-09-22 16:37:11
updated: 2017-09-22 16:37:11
tags:
- git
category: 软件
---

# 一.安装git
```
yum install git
```
<!--more-->
# 二.给zjjidelu用户添加用户目录

因为我们需要通过ssh的方式来连接git,这里我是用zijidelu来安装的控制面板，通过在php中执行`echo shell_exec('whoami')`能够看到php脚本是以zijidelu用户来执行的，所以网站的文件权限和用户组我设置的是`zijidelu:zijideluGroup`,我需要用`zijidelu`这个用户来执行git以避免文件权限的变化。运行git的时候。会从当前用户目录中去查找ssh key;

```
cd /home/
mkdir zijidelu_home
cd zijidelu_home
mkdir .ssh
cd ../
cd ../
chown -R zijidelu:zijideluGroup zijidelu_home
```

# 三.生成ssh key

```
sudo -u zijidelu ssh-keygen -t rsa
```
ssh保存的路径就是我们上一步创建的目录

接下来把这个目录设置成`zijidelu`这个用户的主目录。`vi /etc/passwd`修改`zijidelu`用户为：

```
zijidelu:x:1520:1520::/home/zijidelu_home:/sbin/nologin
```


# 四.撰写webhook执行的php脚本

这个是用于`gitee`的脚本，其它如coding也类似，只是取得的参数可能有变化。
``` php
<?php
$access_token = '******';
$access_ip = array('*.*.*.*');
/* get user token and ip address */
$client_ip = $_SERVER['REMOTE_ADDR'];
/* create open log */
$fs = fopen('./webhook.log', 'a');
fwrite($fs, 'Request on ['.date("Y-m-d H:i:s").'] from ['.$client_ip.']'.PHP_EOL);
/* test token */

/* test ip */
// if ( ! in_array($client_ip, $access_ip))
//      {
//     echo "error 503";
//     fwrite($fs, "Invalid ip [{$client_ip}]".PHP_EOL);
//     exit(0);
//      }
/* get json data */
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$client_token = $data['password'];
if ($client_token !== $access_token)
{
    echo "error 403";
    fwrite($fs, "Invalid token [{$client_token}]".PHP_EOL);
    exit(0);
}
/* get branch */
$branch = $data["ref"];
fwrite($fs, '======================================================================='.PHP_EOL);
/* if you need get full json input */
//fwrite($fs, 'DATA: '.print_r($data, true).PHP_EOL);
/* branch filter */
if ($branch === 'refs/heads/master')
        {
        /* if master branch*/
        fwrite($fs, 'BRANCH: '.print_r($branch, true).PHP_EOL);
        fwrite($fs, '======================================================================='.PHP_EOL);
        $fs and fclose($fs);
        /* then pull master */
        exec("/home/deploy/deploy.sh");
        } 
// else 
//      {
//      /* if devel branch */
//      fwrite($fs, 'BRANCH: '.print_r($branch, true).PHP_EOL);
//      fwrite($fs, '======================================================================='.PHP_EOL);
//      $fs and fclose($fs);
//      /* pull devel branch */
//      exec("/home/deploy/devel_deploy.sh");
//      }
?>
```

# 五.撰写sh脚本

这一步通过`#echo $USER >> /home/deploy/deploy.log`通过查到sh脚本是以`zijidelu`这个用户来执行的

```
#!/bin/bash 
cd /home/wwwroot/518zst
#echo $USER >> /home/deploy/deploy.log
#sudo -u zijidelu echo "OKOK4" >> /home/deploy/deploy.log 
git reset --hard HEAD >> /home/deploy/deploy.log
git pull origin master >> /home/deploy/deploy.log
#chmod 777 data/order_print_seller.html
#chmod 777 data/order_print_vendor.html
```
这个脚本这最近一次的部署中是正常运行的，因为他是以`zijidelu`这个用户来执行的。
但在我以前的编写中是加了一条`sudo -u zijidelu`,像：`sudo -u zijidelu git reset --hard HEAD`，同时`vi /etc/soduers`在root用户下面添加了这一句：
```
daemon  ALL=(ALL)       NOPASSWD:ALL
```
表示deamon用户可以在非终端模式下执行命令，这样在以前的部署中正常执行的。
反而在这一次这样设置后没能正常执行，`sudo -u`这条命令没有任何的结果

经测试，这是因为php执行的模式的问题，当php以`FastCGI`执行的时候，我们可以按照上面的脚本来写即可。但如果以非`FastCGI`模式来运行的时候，`echo $USER >`只是一行空白，这个时候执行的命令前面就需要加上`sudo -u`，并且在sudoers中添加`deamon`这个用户的脚本执行。

# 六.测试

第一次最好在服务器端通过`sudo -u zijidelu git pull origin master`来运行一次，因为首次通过ssh方式来连接git的话，在know_host里面没有记录，会弹出确认信息，如下

```
The authenticity of host 'git.coding.net (123.59.83.79)' can't be established.
RSA key fingerprint is 98:ab:2b:30:60:00:82:86:bb:85:db:87:22:c4:4f:b1.
Are you sure you want to continue connecting (yes/no)? 
```
我们输入yes之后，以后就不用再确认了，这个时候通过exec来执行git也能成功执行了。
否则如果我们直接通过exec来执行的话，git pull这一步是不会执行的，也不会抛出任何信息的。

测试可以分步测试，在php文件中通过写入文件来查看php是否正常执行，然后通过sh脚本的输出看sh脚本是否正常执行。
同时也可以在终端下测试sh执行是否正确。
