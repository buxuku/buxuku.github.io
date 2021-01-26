---
title: react-route从v3迁移到v4(折腾+踩坑)
date: 2017-09-28 18:19:14
updated: 2017-09-28 18:19:14
tags:
- react
- react-route
category: 前端
---

从react-router v3到react-router v4确实不能算是升级，而是称得到是迁移了。API的变化发生了翻天覆地的变化了。

<!--more-->

# 一. 包的改变

所有引入的`react-route`都要换成`react-route-dom`了

# 二. 没有了browserHistory

需要引入`BrowserRouter`来实现

# 三. location中没有了query

官方对此讨论也很激烈，[https://github.com/ReactTraining/react-router/issues/4410](https://github.com/ReactTraining/react-router/issues/4410)

官方给出的解决方案就是使用第三方库`query-string`来解决

# 四. path不再支持通配符

`path="goods/(:id)"`需要写成`path="goods/:id?"`

# 五. 不能直接从props.params中取值了

`this.props.params.id`需要改成`this.props.match.params.id`

# 六. 不再有onEnter等api

[https://reacttraining.com/react-router/web/example/auth-workflow](https://reacttraining.com/react-router/web/example/auth-workflow)

[https://github.com/lincenying/mmf-blog-react-v2](https://github.com/lincenying/mmf-blog-react-v2/blob/master/src/pages/app.jsx#L37-L38)


扩展阅读

【React Router 从v3升级到v4踩坑之旅】(http://www.jianshu.com/p/e2277aaa53f1)
【react-router v4 使用 history 控制路由跳转】(https://segmentfault.com/a/1190000011137828)
