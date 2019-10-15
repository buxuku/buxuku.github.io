---
title: react从v15升级到v16
date: 2017-09-29 17:36:34
tags:
- react
category: 前端
---

react已经发布了v16的正式版，同时也把license从`BSD`修改为`MIT`了，在折腾了router4之后，也来继续折腾react v16了，react的升级不像router那样变化之大，网上说的只要react v15在控制台里面没有什么wraning之类的，就可以直接升级到v16了，但在实际升级过程中，可能因为实际项目的差异，可能还需要做一些调整的地方。

<!--more-->

# 一.需要同时升级`react`和`react-dom`

如果你只是升级了react的话，肯定去运行出一大堆错误出来的，必须同时把`react-dom`也升级到v16版本。
比如下面这个错误：

```
 Cannot find module "react/lib/ReactComponentTreeHook"
```

# 二.需要移除`contextTypes`

因为在我之前的代码的，路由的跳转用的是下面这种方式

```
static contextTypes = {
    router: React.PropTypes.object
}
```
升级之后，将不再支持`React.PropTypes.object`了，而我的项目也使用了router v4了，所以全部移除这部分代码，改为history的方式

# 三.升级第三方包

一些奇怪的错误，可能是第三方包没有兼容react v16而引起的，我们尽可能把第三方包升级到最新版。以及删除之前所有的模块再来重新包装一些包，因为单独升级一个包，不一定能同时升级与它相关的依赖包。

```
rm -rf node_modules
npm cache clean
npm i
```

# 四.`Stateless function components cannot be given refs. Attempts to access this ref will fail.null`

目前看来应该是UI库antd的一个兼容问题 [https://github.com/ant-design/ant-design/issues/7784](https://github.com/ant-design/ant-design/issues/7784)
