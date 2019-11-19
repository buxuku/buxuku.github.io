---
title: jsbin神一般地在线书写，测试，分享代码
date: 2016-05-04 17:00:51
tags: 
- html
- css
- javascript
- 工具
category: 前端
---
有些时候，我们往往有这样的需求：
<!--more-->
1. 临时测试一个代码片段，不想打开编辑器来新建一个文件，测试完毕又删除
2. 想给别人分享一个代码，html文件,css文件，js文件，打个包？
3. 向别人展个某个效果，发个文件过去？把代码部署到自己服务器上面？

针对这些需求，我们使用在线的代码片段测试工具，也许来得更加简单和方便了。
针对前端的在线代码片段工具很多，比较常见的有[jsbin](http://jsbin.com/)和[jsfiddle](https://jsfiddle.net/)以及[codepen](http://codepen.io/).

而我最喜欢的就是jsbin了，它有着更多的特性给我带来了极大的方便：

1. 任意控制要展示的窗口
![](http://7te946.com1.z0.glb.clouddn.com/16-5-4/19860620.jpg)
点击这些标签，就可以控制对应的窗口的显示与隐藏，让我们获得更大的编辑区域，减少不需要的窗口的干扰。

2. 支持console面板，因为我调试代码习惯于用console面板来调试，所以它的这个面板一下子就吸引了我。

3. 代码检测功能，哪怕是js中一个分号错误，也会实时提醒出来
![](http://7te946.com1.z0.glb.clouddn.com/16-5-4/56235513.jpg)

### 神一样的功能，最大的特性，把sublime text搬到线上

直接支持在线用书写sublime text的快捷键来书写代码，而且是支持emmet的哦。不需要在自己的编辑器里面写好，再复制过去了，直接在线流畅地进行书写，

开启方法：Account->Editor settings->Addons 里面，Key bindings勾选Sublime就可以了。

![](http://7te946.com1.z0.glb.clouddn.com/16-5-4/96521463.jpg)

### 一些小tips

1. 分享链接设置最新版，快照
![](http://7te946.com1.z0.glb.clouddn.com/16-5-4/4691611.jpg)
不仅仅可以设置分享最新版的代码，还是当前代码的快照。还可以设置分享后展示的窗口信息，甚至可以只展示运行的结果。

2. 保存的代码设置描述，方便查找代码

我们在书写了代码之后，可以通过File->Save snapshot来保存当前的代码片段，但默认保存的很难让我们区分出这段代码是干什么用的。就像下面这样：
![](http://7te946.com1.z0.glb.clouddn.com/16-5-4/14204181.jpg)

这里面的信息我们是不能编辑的，我们可以在编辑窗口，点击File->Add description来添加描述。
![](http://7te946.com1.z0.glb.clouddn.com/16-5-4/81115496.jpg)
这下子就非常清晰了。