---
title: empty value
date: 2016-03-29 09:26:50
updated: 2016-03-29 09:26:50
tags: 
- php
- ecshop
- 二次开发
categories: 
- LAMP
---

在对echsop进行二开的时候，我很简单地写了一句；

```
	$shop_style = empty(intval($_POST['shop_style'])) ? 1:intval($_POST['shop_style']);
```

结果一打开页面就报错：
<!--more-->
```
Fatal error: Can't use function return value in write context in ...index.php on line 503
```

怎么看这代码都没有问题呀，上网搜索才发现，对于`empty()`函数，有如下描述

>Note: empty() only checks variables as anything else will result in a parse error. In other words, the following will not work: empty(trim($name)).

empty() 只检测变量，检测任何非变量的东西都将导致解析错误!

所以说上面那句正确的写法应该是

```
	$shop_style = empty($_POST['shop_style']) ? 1:intval($_POST['shop_style']);
```