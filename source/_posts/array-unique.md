---
title: js中数组去重的方法
date: 2016-10-12 00:14:26
updated: 2016-10-12 00:14:26
tags: javascript
category: 前端
---

在前端面试题中，一般会遇到一道关于array去重的面试题。简单点来说 ，就是找出不一样的，或者说排队一样的。那么我们就可以通过生活中的一些情景来思考这道题的解法。

## 排队法

假如我们要表演一场千手观音的节目，我们需要高矮不一样的人来表演，于是在参选人员中，我们让他们按照高矮次序排队，一样高的就排除掉后面的那一个。
于是我们就得到了解法，先对数组进行排序，然后循环比较当前值和其后面那个值的是否相等，如果不相等，刚后面那个值认为是有效的。

```javascript
var arr = [2,3,2,5,4,3];
var new_arr = [];
arr = arr.sort();
for (var i=0;i<arr.length;i++){
  if(arr[i]!=arr[i+1]){
    new_arr.push(arr[i])
  }
}
console.log(new_arr);
```
## 抓球法

假如有一大排五颜六色的球，我们要从中每个颜色选择一个球出来，于是我们就可以这样选：准备一个口袋，每看到一个球，看一下这个球的颜色在袋子里面是不是已经装得有了，如果有，就不装了，如果没有，就把它装进去。
于是在js中得到解法，使用js中的indexOf来判断数组中的每一个元素是否已经在输出结果的新数组中：

```javascript
var arr = [2,3,2,5,4,3];
var new_arr = [];
for(var i=0;i<arr.length;i++){
  if(new_arr.indexOf(arr[i])==-1){
    new_arr.push(arr[i]);
  }
}
console.log(new_arr);
```

## 打卡法

相当于我们上下班打卡一样，对于同一个人在某一个时间段内重复打卡，我们会只记录他的一次打卡记录。
于是在js，我们可以把相同的值认为是同一个值在多次出现，而我们可以把值转化为一个对象的属性，这样，某一个值一旦出现过，我们就为其完成“打卡”操作。

```javascript
var arr = [2,3,2,5,4,3];
var new_arr = [];
var has = {};
for(var i=0;i<arr.length;i++){
  if(has[arr[i]]!== 1){
    has[arr[i]]=1;
    new_arr.push(arr[i]);
  }
}
console.log(new_arr);
```

## 点名法

有一份名单，上面的名字可能因为在制作表的时候造成了很多名字的重复，老师为了避免重复点名，他只好每点一次名，就看下这个名字是不是在之前出现过，如果没有，就点名，否时就不点了。
于是js的解决思路还是要用到indexOf来判断当前值是否在之前的位置出现过。
```javascript
var arr = [2,3,2,5,4,3];
var new_arr = [];
for(var i=0;i<arr.length;i++){
  if(arr.indexOf(arr[i])==i){
    new_arr.push(arr[i]);
  }
}
console.log(new_arr);
```

## 飞走的小鸟

假如我把数据从左往右按照次序看，前面出现过的相同的数字认为是同一只小鸟，而那个数字只是小鸟之前停留过的位置而已，所以我们只需要找到每一只小鸟最后停留的位置即可了。
解决方法来源于国外的一个人写的，[参考链接](http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/).
这个函通过双重循环，顶级中的一次循环，都通过次级的循环判断后面是否还有相同的值，如果有，次级继续循环，直到找到后面没有重复值的下一个顶级i的值，接下来顶级在新的i值基础上继续循环。

```javascript 
Array.prototype.unique = function() {
    var a = [], l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++)
            if (this[i] === this[j]) j = ++i;
      a.push(this[i]);
    }
    return a;
};
```