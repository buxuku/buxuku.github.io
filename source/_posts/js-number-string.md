---
title: javascript中当数字遇上了字符
date: 2016-05-02 15:13:17
updated: 2016-05-02 15:13:17
tags: javascript
category: 前端
---
我们始终记住一句话:除了加性操作符之外,其它操作符中遇上字符的时候,javascript都会尝试在后台采用Number对字符串进行转换.于是我们可以看到如下的结果:
<!--more-->
```javascript
console.log("15"+5);//"155"
console.log("15"-5);//10
console.log("abc"+5);//"abc5"
console.log("abc"-5);//NaN
console.log("15"*5);//75
console.log("15"/5);3
console.log("5"==5);//ture
console.log("5abc"==5);//false
console.log("23"<"3");//true 没有数字,比较第一个字符"2"和"2"
console.log("23"<33);//true "23"转换为23
console.log("a"<33);//false "a"转换为NaN

```
