---
title: 'javascript中的undefined null'
date: 2016-05-01 21:09:13
updated: 2016-05-01 21:09:13
tags: javascript
category: 前端
---

在javascript的五种基本数据类型中,有两和数据类型可能会经常给我们带来一些困惑,他们就是`undefined`和`null`了.
<!--more-->
## 对于undefined来说
我们先来看一种情况:
```javascript
var a;
console.log(a);//"undefined"
console.log(b);//报错
```
然后有
```javascript
var a;
console.log(typeof a);//"undefined"
console.log(typeof b);//"undefined"
```
这里我们可以得出结论就是:未定义的变量,未初始化的变量,使用typeof的时候,他们的结果都是'undefined';而对于未定义的变量,他也只能使用typeof操作符,执行其它操作都将报错.(调用delete也不会报错,但没有任何意义);

从上面也可以看出,未初始化变量的默认值就是`undefined`,所以`console.log(a == undefined)`将会打印出`true`.

因此,良好的编程习惯应该这样:没必要显式地声明`a = undefined`;而对于任何变量,我们都应该显式的初始化一个除`undefined`外我们想要的值,这样当我们在应用typeof的时候,我们将可以很容易地知道`undefined`结果代表的是变量未声明.

## 对于null
我们也是先看一种情况
```javascript
var a=null;
console.log(typeof a); //object;
```
这里我们可以看出,`null`是以一种空对象的形式保存的.所以对于任何我们即将要以对象的形式保存的变量,我们都可以使用`null`来进行初始化;

有一点不好理解的就是,当`conslole.log(null == undefined)`的时候,结果竟然返回的是`true`,其中的原因就是`undefined`是派生至`null`的.那么`console.log(null === undefined)`的结果肯定是`false`,因为他们是两种数据类型.

因为我们也就能够理解下面这段代码了:

```javascript
console.log(Boolean(null));//false
console.log(Boolean(undefined));//false
```

对于`undefined`和`null`它们将存在于以下区别

1.在使用Boolean进行转换的时候,`undefined`和`null`都为`false`,而`null`所赋于的变量,拥有任何对象后都将会是`true`值.

2.在使用Number进行转换的时候,`Number(null)`的值为0,而`Number(undefined)`为`NaN`.

3.在合作String进行转换的时候,`String(null)`的结果是`"null"`,而`String(undefined)`的结果是`"undefined"`.

我们还需要注意的一点就是,`typeof`操作符返回的结果是字符串.所以`console.log(typeof undefined == undefined);`的结果是`false`,所以`typeof undefined`返回的`"undefined"`非此`undefined`.