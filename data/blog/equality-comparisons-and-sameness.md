---
title: 面试必挂，你所不知道的 Set 及 js 内部比较算法
date: 2024-05-13 14:22
tags:
  - javascript
  - 面试
summary: 你知道 `new Set` 会去重哪些数据吗？当遇到 `NaN, -0, 0, +0` 时，它表现会怎样，你知道吗？
---

在我每次面试别人时，基本上都会让对方先说一下对象上面有哪些方法，这道题比较简单，一般都能出来几个，但它也能非常容易考察出面试者平时的基本水平，因为业务能力比较强，或者说 js 基础能力比较强的，他往往能够说出来更多，甚至是十多个都是没问题的。

在面试者究举完了之后，我会继续让他回答如果实现数组里面的元素去重

这个问题也非常考验面试者的功力，因为一般人的基本上都能答出通过循环遍历的方式来做。

稍微厉害一点的，会说出来好几种实现的方案，甚至是具体的实现细节。

在这之上的，他可能还是先向我了解，数组里面的元素类型，是否都是基本类型的，是否含有对象，正则，方法等。

但不管能力怎么样，基本上八九十的人都会回答出最简单的 `new Set` 这种方法。

在回答出 `new Set` 这种方法时，我就会继续追问，比如下面这道里面的输出结果会是啥

```js
console.log(...new Set([null, null, undefined, undefined, NaN, NaN, -0, 0, +0]));
```

基本上所有的面试者会开始在此卡壳了，而且曾经无数的面试者，都没有遇到一位能够精确回答出来这道题的。聪明的你，能否先尝试自己在心中写下答案，再来验证一下？



当然，本文今天要讨论的不是数组去重这个操作，并且数组去重能够在网上找到大量的文章以及无数中方法。本文今天要讨论的，正是这最后一步卡壳的 `new Set`  这里面涉及到的， js 里面的 **相等性判断**。

对于相待性判断， 大家常用的，比较熟悉的有 `==` 和 `===`, 还有一个不太常用的 `Object.is`, 这三个相等比较符，涉及到 js 里面的四个相等算法

- [IsLooselyEqual](https://tc39.es/ecma262/#sec-islooselyequal)：宽松相等比较，对应 `==`
- [IsStrictlyEqual](https://tc39.es/ecma262/#sec-isstrictlyequal)：严格相等比较， 对应 `===`
- [SameValue](https://tc39.es/ecma262/#sec-samevalue)： 同值相等比较， 对应 `Object.js`
- [SameValueZero](https://tc39.es/ecma262/#sec-samevaluezero)： 零值相等比较， 对应 `includes` , `Set`, `Map` 等内置运算符



对于宽松相等，我们可以查看 tc39 规范[IsLooselyEqual](https://tc39.es/ecma262/#sec-islooselyequal)得得知道：

> 先判断类型是否相同，如果相同，执行严格相等比较的逻辑
>
> 如果类型不相同，执行类型转换之后，再进行比较



而对于别外三个算法，同样通过查询 tc39 规范 [IsStrictlyEqual](https://tc39.es/ecma262/#sec-isstrictlyequal)，[SameValue](https://tc39.es/ecma262/#sec-samevalue)，[SameValueZero](https://tc39.es/ecma262/#sec-samevaluezero)  可以看出：第一步都是先判断类型是否相同， 最后一步都是调用 `SameValueNonNumber` 方法进行比较。唯一的区别在于第二步， 当两个元素是数字时：

- 严格相等比较(`===`)：通过 Number::equal 来比较， 因此 `-0 === 0 === +0`,  `NaN !=== NaN` 详见：[Number::equal](https://tc39.es/ecma262/#sec-numeric-types-number-equal)

- 同值相等比较(`Object.is`)：通过 Number::sameValue 来比较，因此两个 `NaN` 认为是相等的（**注意：它这个表现确实有点违反常识**），而 `+0`  和 `-0` 认为不是等的，详见： [Number::sameValue](https://tc39.es/ecma262/#sec-numeric-types-number-sameValue)

- 零值相等比较(`Set`)：通过 Number::sameValueZero 来比较，它与  Number::sameValue 的唯一区别就是对于 `0` 处理， 认为 `-0`, `0`, `+0` 都是等价的。详见： [Number::sameValueZero](https://tc39.es/ecma262/#sec-numeric-types-number-sameValueZero)

  

可以看到， 我们使用的 `Set`  这一数据结构，他内部使用的就是 **零值相等比较** 这一算法来实现的。

而它与 **同值相等比较** 唯一的区别就是对于 `+0` 和 `-0` 的处理，`Object.is` 除了认为 `+0` 和 `0`  是相等的外，不会对 `-0` 进行任何转换操作，因此

```js
console.log(Object.is(-0, 0));
// Expected output: false
console.log(Object.is(-0, +0));
// Expected output: false
```

而 **零值相等比较** 则认为 `0`, `+0` , `-0` 都是等价的。

回到上面那道题，在 `new Set`  里面，对于 `null` `undefined` 而言，它执行的逻辑和 `===` 是一样的，所以我们认为它是可以去除的。

而对于`NaN`, 采用零值相等比较，我们可以认为它在是同值相等的比较基础上，特殊处理了对于 `0` 的比较，因此对于 `NaN`, 它比较特殊，它执行的同值相等比较的逻辑，认为是 **相等** 的。因此，它也是可以去除的。

而对于最后的 `-0`， `0`， `+0` ， 很显然，我们已经可以得出结论了：它是可以被去除的。最后剩下的是 `0`。

因此，最终的输出就是 

```js
console.log(...new Set([null, null, undefined, undefined, NaN, NaN, -0, 0, +0]));
// null undefined NaN 0
```


因此，如果我们要考虑在这个 `Set` 里面继续追加 `{}`, `[]`, `//`，`()=>{}` 等等其它各种数据时，我们都知道，这些都是采用的是 **严格相等** 里面的 `SameValueNonNumber` 方法了，并没有什么特殊之处。


**额外的：**

前面提到了，零值相等比较， 对应 `includes` , `Set`, `Map` 等内置运算符都是采用的零值相等比较。所以

```js
[-0,, null, NaN, undefined].includes(+0); // or -0, null, undefined ....
// true
```

我们就不奇怪它的结果了。

但是，对于 `indexOf` 它是使用的 `===` 来进行比较的

```js
console.log([NaN].indexOf(NaN)); 
//-1
```

而对于 `Map` 这一数据结构，它也是采用的 `SameValueZero` 的对比算法

```js
const contacts = new Map();
contacts.set(NaN, 123);
contacts.get(NaN);
//123
contacts.set(-0, '-0');
contacts.get(0);
//'-0'
```

但是，对于 `Object`, 它采用的是 `===` 的严格比较算法，虽然对于这样一个对象

```js
const b = {[-0]: 123, [+0]: 234, NaN: 1, NaN: 2};
console.log(b);
// {'0': 234, 'NaN': 2}
```

表现的结果貌似是用的 `SameValueZero` 的对比方法，但实际上是因为： **对象总是会把 key 转成字符串来存储**， 所以实际上这些 key 都是字符串的形式，以出现了被覆盖的现象



###### 参考资料

- [MDN-Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [JavaScript 中的相等性判断](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness#%E9%9B%B6%E5%80%BC%E7%9B%B8%E7%AD%89)
- [js 比较表](https://dorey.github.io/JavaScript-Equality-Table/)
