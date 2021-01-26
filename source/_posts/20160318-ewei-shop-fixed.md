---
title: 微擎模块人人商城11.7版修记录
date: 2016-03-18 18:30:10
updated: 2016-03-18 18:30:10
tags: 
- 微擎
categories: 
- 二次开发
---

## 文章营销插件，被分享者非商城会员，分享者无奖励
<!-- more -->
现象：使用文章营销插件之后，分享者把链接分享出去之后，被分享者点击链接之后，能够正常记录阅读数，但记录不到分享记录，同时也导致给分享者设置的奖励无效。

原因分析：在文章营销首页php文件`addons/ewei_shop/plugin/article/core/mobile/index.php`中第52行开始代码如下

```php
$myid = m('member')->getMid();
$shareid = intval($_GPC['shareid']);
echo $doShare = $this->model->doShare($article, $shareid, $myid);
```

在调用`doShare`方法之前，获取到的`$myid`是为空的，继续分析`member`文件中的`getMid()`方法可以发现，这里获取到的`myid`是读取数据库`ewei_shop_member`里面的信息，而如果用户之前没有进入过公众号人人商城，那么也就不会存在这个记录值的，所以返回结果是为空的。

解析办法：在这段代码之前添加方法`m('member')->checkMember();`,代码如下：

```php
m('member')->checkMember();
$myid = m('member')->getMid();
$shareid = intval($_GPC['shareid']);
echo $doShare = $this->model->doShare($article, $shareid, $myid);
```

## 文章营销模块，后台分享列表页面无法显示点击者昵称

现象：文章分享出去，别人点击之后，在后台查看分享记录里面的点击者，只能显示`未更新用户信息`

原因分析：在文件`/addons/ewei_shop/core/model/member.php`中第219左右行如下：

```php
public function checkMember($openid = '')
{
    global $_W, $_GPC;
    if (strexists($_SERVER['REQUEST_URI'], '/web/')) {
        return;
    }
    if (empty($openid)) {
        $openid = m('user')->getOpenid();
    }
    if (empty($openid)) {
        return;
    }
    $member   = m('member')->getMember($openid);
    $userinfo = m('user')->getInfo($openid);
    $followed = m('user')->followed($openid);

```

其中的`$userinfo = m('user')->getInfo($openid);`写法有误，分析`getInfo()`方法可以发现，这个方法只会返回`openid`这一条信息的，不会返回其它如昵称之类的。

解决办法：使用`$userinfo = m('member')->getInfo($openid);`方法，代码如下：

```php
public function checkMember($openid = '')
{
    global $_W, $_GPC;
    if (strexists($_SERVER['REQUEST_URI'], '/web/')) {
        return;
    }
    if (empty($openid)) {
        $openid = m('user')->getOpenid();
    }
    if (empty($openid)) {
        return;
    }
    $member   = m('member')->getMember($openid);
    $userinfo = m('member')->getInfo($openid);
    $followed = m('user')->followed($openid);
```

## 文章营销模块 实现未关注公众号的用户也获取到用户昵称

现象：这个也不能说算是bug，只是程序写法中，区别上面一条的是，上面就算用户关注了公众号的，也是没办法获取到点击者信息的，而如果用户未关注公众号，在修复了上面那个问题之后，依然是获致不到用户信息的。

原因分析：在`ewei_shop/core/model/member.php`中的`getInfo()`方法，这个方法只会读取`ewei_shop_member`表和系统用户表里面的用户信息，而如果用户没有关注的话，是没有这些信息的。

解析方法：在这个方法的原来判断代码中，如下

```php
    public function getInfo($openid = '')
    {
        global $_W;
        $uid = intval($openid);
        if ($uid == 0) {
            $info = pdo_fetch('select * from ' . tablename('ewei_shop_member') . ' where openid=:openid and uniacid=:uniacid limit 1', array(
                ':uniacid' => $_W['uniacid'],
                ':openid' => $openid
            ));
        } else {
            $info = pdo_fetch('select * from ' . tablename('ewei_shop_member') . ' where id=:id  and uniacid=:uniacid limit 1', array(
                ':uniacid' => $_W['uniacid'],
                ':id' => $uid
            ));
        }
        if (!empty($info['uid'])) {
            echo "fda";
            load()->model('mc');
```
这里面的`if (!empty($info['uid']))`后面添加`else`代码块

```php
else{
            $info = m('user')-> oauth_info();
            $info['avatar'] ＝ $info['headimgurl'];
        }
```
通过完整的OAuth方式获取用户信息。