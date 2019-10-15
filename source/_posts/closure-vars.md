---
title: js中闭包变量问题的解决方法
date: 2016-10-10 22:25:17
tags: javascript
category: 前端
---

在js中，作用域的问题算还是比较容易理解的，之前也写过一篇博文[《javascript中的词法作用域》](http://blog.linxiaodong.com/2016/05/18/scop/)。但js的作用域规则在遇到闭包的时候可能就会出现一些问题了。最经典的就是for变量声明的问题了。
<!--more-->

首先我们有html和js的代码片段

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>
<div id="showClick">
  <p>产品一</p>
  <p>产品二</p>
  <p>产品三</p>
  <p>产品四</p>
</div>
</body>
</html>
```

```javascript
var showClick = document.getElementsByTagName('p');
for(var i=0;i<showClick.length;i++){
  showClick[i].onclick=function(){
    console.log(i);
  }
}
```
[view code](http://jsbin.com/mezutodowe/edit?html,js,console,output);
这个就是很经典的一个问题，当我们点击的时候，控制台输出的全部是4。出现这个问题的最根本的原因就是：

### 闭包只能取得包含函数中任何变量的最后一个值。

我们从词法作用域来分析这一句话，这个闭包中的i,他通过他的执行环境来获取，也就是for那一层，即全局变量，全局变量中的i是一个静态变量，在for执行完毕之后，他的值为4,也就是接下来我们执行onclick操作时的最后一个值。

之所以利用词法作用域来理解我认为有助于让我们更容易来理解解决这个问题的几种方案。

## 接下来扒扒网上常用的一些解决方法

### 创建一个匿名来立即执行

```javascript
var showClick = document.getElementsByTagName('p');
for(var i=0;i<showClick.length;i++){
  (function (m){
    showClick[m].onclick=function(){
    console.log(m);}
  })(i);
}
```

从词法作用域来看，闭包中的m来源于匿名函数的实参，而我们知道，函数的参数是按值传递而非按照引用传递的，所以这里得到的m就是每次循环的i的实际值。

同理

```javascript
var showClick = document.getElementsByTagName('p');
for(var i=0;i<showClick.length;i++){
  showClick[i].onclick=(function (m){
    return function(){
      console.log(m);
    }
  })(i);
}
```

或者可以不传参数

```javascript
var showClick = document.getElementsByTagName('p');
for(var i=0;i<showClick.length;i++){
  (function (){
    var tem = i;
    showClick[i].onclick=function(){
    console.log(tem);}
  })();
}
```

```javascript
var showClick = document.getElementsByTagName('p');
for(var i=0;i<showClick.length;i++){
  showClick[i].onclick=(function (){
    var tem = i;
    return function(){
      console.log(tem);
    }
  })();
}
```
原理都是一样的，强制让闭包在匿名函数中去找值。

## 通过给对象增加属性

```javascript
var showClick = document.getElementsByTagName('p');
for(var i=0;i<showClick.length;i++){
    showClick[i].i = i;
    showClick[i].onclick=function(){
      console.log(this.i);
    }
}
```
这里的showClick是对象，所以我们是可以给为增加一个属性的，而对象是引用类型的，所以在增加的属性的时候，他的值已经被固定了。

## 通过外部函数来执行

```javascript 
var showClick = document.getElementsByTagName('p');
function returnShow(i){
  return function(){
    console.log(i);
  }
}
for(var i=0;i<showClick.length;i++){
    showClick[i].i = i;
    showClick[i].onclick=returnShow(i);
}
```
就这相当于避开了闭包，思路同1一样的，函数的参数是按值传递的。

## ES6的let方法

```javascript
var showClick = document.getElementsByTagName('p');
for(let i=0;i<showClick.length;i++){
  showClick[i].onclick=function(){
    console.log(i);
  }
}
```

于是我们思考一下，既然函数参数是按值传递，加上作用域链，我们可不可以这样直接通过参数来缓存变量呢?

```javascript
var showClick = document.getElementsByTagName('p');
for(var i=0;i<showClick.length;i++){
  showClick[i].onclick=function(i){
    console.log(i);
  }
}
```
答案是否定的，因为onclick事件传递的参数是event事件，所以打印的实际上是event事件，而不是i的值。

那么对于setTimeOut我们则可以通过这种方式来进行解决

```javascript
for (var i = 0; i < 5; i++) {
    setTimeout(function(){
        console.log(i)
    },10)
}
```
不出所料，以上代码会全部打印出5出来。
我们可以采用上面的匿名函数的方法来解决：
```javascript
for (var i = 0; i < 5; i++) {
    (function(i){
      setTimeout(function(){
        console.log(i)
    },10)
    })(i)
}
```

```javascript
for (var i = 0; i < 5; i++) {
    (function(){
      var tem = i;
      setTimeout(function(){
        console.log(tem)
    },10)
    })()
}
```

以及我们可以直接通过函数传参的方式来实现：
```javascript
function a(a){
  return function(){
    console.log(a);
  }
}
for (var i = 0; i < 5; i++) {
    setTimeout(a(i),10)
}
```