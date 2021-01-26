---
title: javascript中的词法作用域
date: 2016-05-18 11:24:42
updated: 2016-05-18 11:24:42
tags: javascript
category: 前端
---

有一个例子可以很好地展示javascript中的语法作用域的特性:
<!--more-->
```javascript
function foo(){
  console.log(a);
}
function bar(){
  var a = 3;
  foo();
}
var a = 2;
bar();//2
```
同大多数语言一样,javascript也是采用的词法作用域.

作用域分为两种,一种就是词法作用域(Lexical Scope),一种是动态作用域(Dynamic Scope).

词法作用域是属静态作用域模型,也就是变量,函数的声明,引用都是在编译阶段就完成了,它们不会受到执行上下文,调用方式的影响.比如上面定义的函数foo,它里面对a的RHS查询，是基于它本身内部变量定义，函数参数以及全局变量中进行查询的，所以就算在bar中进行执行,它的静态模型也是不会被改变的.因此是正常地输出2.

相反的,如果是动态作用域,则RHS查询是在当前的执行环境中进行查询，所以它是动态改变的，它会受到执行上下文，调用方式的改变，如上面这个例子，如果采用动态作用域的方式来执行的话，在bar内部执行foo,foo对a进行RHS查询时，自己内部作用域中进行查询，没有查询到，继续向当前执行环境中进行查询，于是查询到了bar中定义的a,所以最终输出了结果3.

总结下来就是:

{% cq %} 遇到既不是形参也不是函数内部定义的局部变量的变量时，词法作用域的函数去函数定义时的环境中查询,动态域的函数到函数调用时的环境中查询。 {% endcq %}


### 词法作用域的欺骗

#### eval欺骗法

```javascript
function foo(str){
  eval(str);
  console.log(a);
}
function bar(){
  foo("var a = 3");
}
var a = 2;
bar();//3
```

我们知道,javascript中分词阶段,只会对变量进行声明.在对foo进行分词时,首先会忽略eval内部的执行代码,这个时候对a的静态引用还是基于函数内部定义,参数和全局变量的,但这个时候没有进行"a = 2"这个赋值操作,因为它应该是在执行环节进行的.

接下来在执行环节就会出现问题了,因为eval是立即执行内部代码的,我们在"a = 2"赋值操作之前,执行了"var a = 3"这句操作,它覆盖了原来的"var a = 2"操作,所以完成了一次词法作用域的欺骗,最终输出结果3.

#### with欺骗法
```javascript
var a = 10;
function go(obj) {
    with(obj) {
        a = 2;
    }
}
var foo = {
    a: 1
},
    bar = {
    b: 1
};

go(foo);
console.log(foo.a); // 2
console.log(a);     //10

go(bar);
console.log(bar.a); // undefined
console.log(a);        // 2(对头，a变成了一枚金闪闪的全局变量)
```
我们常常不喜欢with的原因就是这样的:当bar对象中没有a这个属性的时候,with不是给它新增一个a的属性,而是在全局变量中新增了一个属性,也正因为这样的特性,导致它改变了原来定义的"var a = 10"这个值.

和之前的一篇文章[《不使用var就不是声明变量》](http://blog.linxiaodong.com/2016/05/17/js-out-of-use-var/)一样,这里不是声明一个变量,而是给window新增加了一个属性.通过代码可以测试出.

```javascript
function go(obj) {
    with(obj) {
        a = 2;
    }
}
var bar = {
    b: 1
};

go(bar);
console.log(bar.a); // undefined
console.log(a);        //2
console.log(delete a); //true
```