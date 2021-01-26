---
title: 在react-router v4中实现多个布局模板
date: 2017-09-30 16:01:36
updated: 2017-09-30 16:01:36
tags:
- react 
- react-router
category: 前端
---

在前端发过迁移React-router v4的踩坑记录：[《react-route从v3迁移到v4(折腾+踩坑)》](http://blog.linxiaodong.com/2017/09/28/Migrating-react-route-v3-to-v4/),整个升级需要有很多坑，但我觉得都还比较好，可以一步一步地去填这些坑，不外乎就是一个工作量的问题。

但在最后解决我之前项目中处理404页面的时候，遇到了一个头痛的问题：

<!--more-->

在我的项目中，所有页面共用了一套Layout,除了404页面是完全独立的一套Layout,这个实现在v3中是很方便的，比如用下面这套route配置就可以完成了

```javascript
<Route path="/" component={Layouts} >
        <IndexRoute component={Home}/>
        <Route path="/goods/add" component={GoodsAdd}/>
</Route>
<Route path="*" component={NotFoundPage} />
```

但到了react-router v4就行不通了，因为在v4中，要实现这样的Layout，path="/"的匹配规则就不能添加`exec`了，而对于404的那个链接，刚会首先进入path="/"这个里面去，从而导致Layouts的渲染。不管是否使用`Switch`均无法解决这个问题。

一直在想办法解决404页面的问题，刚网上搜索出来的解决方法均一样：

```javascript
<Switch>
  <Route exact path="/" component={Home}/>
  <Route path="/about" component={About}/>
  <Route component={NoMatch}/>
</Switch>
```

这个确实是一个实现方式，但却不能实现我需要的Layout功能了，Home和About是完全独立的两个页面当然是没问题的。

后来转念一想，我的需求不再于404页面的问题，而在于如何实现多套Layout的问题，如何通过简单的方式来实现多套Layout,那么404页面做为完全独立的一个页面，也就能够简单的实现的。

因为我大多数页面都会是同一个Layout,而极个别的可能会是另外的一套，所以我还是想通过v3的方式那样，通过根路由来渲染这个主要的Layout,这样我不用再去处理那大部分的，而只需要去处理那及个别的即可。

后来通过阅读react-router v4的文档，发现有一个render的api,通过render的方式，我们就有了更多的自定义渲染控制权了，包括怎么渲染，额外传递一些参数等等。

有了这个api,问题就好解决了，我们可以自己再封装一个实现router v4中onEnter功能的高组组件类似的一个组件，通过这个组件来决定利用哪个Layout来渲染这个页面，这样就可以实现任意多套的Layout了。

最终我封装了一个`ARoute`的组件，这个组件实现onEnter的功能，同时加载Layout.

```javascript
import React from 'react'
import Route from 'react-router-dom/Route'
import Redirect from 'react-router-dom/Redirect'
import {Layout} from 'antd'
import Layouts from './Layout'
import SideBar from './SideBar'
import './style/layout.less';
const {Content} = Layout;
const SideBarLayout = ({component: Component, ...rest}) => {
  const {layout} = rest;
  return (
    <Route {...rest} render={matchProps => (
      !layout || layout=="main"
      ?<Layouts>
          <Layout className={!layout?" ant-layout-has-sider":""}>
          {!layout?<SideBar />:null}
          <Content 
                style={{
                minHeight: 680,
                overflow:"visible",
                width:!layout?"1028px":"1200px"
                }}
            >
               <Component {...matchProps} />
            </Content></Layout>
      </Layouts>
      :<Component {...matchProps} />
    )} />
  )
};

export default ({ component: Component, ...rest }) => {
    const {path}=rest;
    const status=sessionStorage.getItem("suppliers");
    const out=(!status || JSON.parse(status).status<6);
    const inEnter=path && path.indexOf("enter")>-1;
    const entered=status && JSON.parse(status).status==7;
    return (!out && !inEnter) || (out && inEnter)? <SideBarLayout {...rest} component={Component} /> :entered && inEnter?<Redirect to={{ pathname: '/' }} />: <Redirect to={{ pathname: '/enter/write/fullPage' }} />
}
```
我的路由就可以写成这样的

```javascript
<BrowserRouter>
    <Switch>
        <ARoute exact  path="/" component={Home} />
        <ARoute exact  path="/goods/add" component={GoodsAdd} />
        <ARoute layout="404" component={NotFoundPage} />
    </Switch>
</BrowserRouter>
```
我原本是想把这里面的所有ARoute封装在一起，但发现这样路由会去匹配里面的所有ARoute.
