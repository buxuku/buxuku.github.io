---
title: js中闭包变量的问题 
date: 2016-10-14 23:37:55
updated: 2016-10-14 23:37:55
tags: javascript
category: 前端
---

我们都知道，在js中闭包会一直保持对着包含函数中的变量的引用，哪怕是在其它地方返回了闭包函数，其外部函数中的变量也不会销毁的。根据这个特性，我们引用一个面试题来深入观察一下：
<!--more-->
如何定义一个count函数，每次调用的时候，都返回这个函数被调用的次数，除了count外，不能再有其它全局变量。

这道题主要也就是考察闭包中变量引用及作用域链的问题，根据闭包的特性，于是我们可以得到这样的一个函数：

```javascript

var count=(function(){
	var i=0;
	return function(){
    console.log("这是你第"+ ++i + "次调用我");
  }
})();
count();
count();
```
我们通过定义匿名函数来减少一次函数命名，闭包中存在对i的调用，所以函数虽然是返回了闭包函数，但其对i的引用一直存在，所以外包函数中的变量一直存在。

当时， 如果不考虑函数命名的问题，我们也可以这样写：

```javascript
function count_fun(){
	var i=0;
	return function(){
    console.log("这是你第"+ ++i + "次调用我");
  }
};
var count = count_fun();
count();
count();
```

扩展一下，我们都知道函数也有是属性的，我们在做动画和定时器的时候，可能会经常用到这种函数属性来方法来避免定时器干扰的问题。针对这个问题，我们也同样可以通过只使用一个变量，然后通过增加属性的方法来实现。

```javascript
function count(){
  console.log("这是你第"+ ++count.i +"次调用");
}
count.i=0;
count();
count();
```

或者直接通过对象的属性来实现也可以
```javascript
var count = {
  i:0,
  add:function(){
    console.log("这是您第"+ ++this.i +"次调用");
  }
}
count.add();
count.add();
count.add();
```
