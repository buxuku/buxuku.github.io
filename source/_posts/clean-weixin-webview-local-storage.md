---
title: 清空微信浏览器缓存
date: 2016-03-29 13:40:25
updated: 2016-03-29 13:40:25
tags: 
- 微信
- 移动开发
categories: 
- 前端
---

微信的流行，让我们经常会在微信中打开一些网页，但因为微信的webview是内置的浏览器，没有给我们直接进行浏览器设置的地方，比如清理缓存之类的。
<!--more-->
经常在做微信网页开发的时候，在调试阶段，这种缓存是非常令人头痛的。

还有就是浏览过一些网页之后，希望能够清理掉cookie，比如登录信息之类的。

这些尝试过在应用设置里面清理微信的缓存，用安全工具清理掉缓存，都办法清理掉。

一个解决办法就是我们自己做开发的，可以给静态资源添加一个时间戳，可以解决一部分问题。

一个就是因为andorid版本的微信是内置的QQ浏览器x5的内核，我们可以通过在微信中打开QQ浏览器的调试页面：`http://debugx5.qq.com`,在里面找到清理的选项，如下图，然后勾选我们要清理的内容，点清理就可以了。

![](http://7te946.com1.z0.glb.clouddn.com/16-3-29/36573124.jpg)