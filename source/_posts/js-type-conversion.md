---
title: javascript中数据类型转换那点事
date: 2016-05-01 22:52:13
updated: 2016-05-01 22:52:13
tags: javascript
category: 前端
---

javascript的神奇之一就是其变量是松散类型的,具有动态性,所以只需要五种基本类型的和一种复杂类型,就可以轻松地保存所有的数据类型了.在使用的过程中,javascript可能会自动地转换我们的数据类型,有时我们也可能会强制地进行数据的转换.那么在转换过程中,是有一些规则需要遵循的.
<!--more-->
## 一.对于Boolean

对于Boolean类型,我们在使用if进行判断或者使用Boolean进行转换的时候,其结果会有`true`和`false`两种.
其规则是:

| 数据类型      | 转换为true的值     | 转换为false的值 | 
|-----------|---------------|------------| 
| Boolean   | true          | flase      | 
| Strin     | 任何非空字符串       | ""(空字符串)   | 
| Number    | 任何非零数字(包括无穷大) | 0和NaN      | 
| Object    | 任何对象          | null       | 
| Undefined | 不适用           | undefined  | 

## 二.对于Number

对于Number我们可能会用到`Number`,`parseInt`,`parseFlost`三种,我们对接用实例来展示

#### Number()方法

| 代码                    | 结果   | 备注         | 
|-----------------------|------|------------| 
| Number("Hello world") | Nan  | flase      | 
| Number("")            | 0    |            | 
| Number("0000123")     | 123  |            | 
| Number(true)          | 1    |            | 
| Number(undefined)     | NaN  |            | 
| Number(null)          | 0    |            | 
| Number(1.23)          | 1.23 |            | 
| Number("1.34")        | 1.34 | 只包含浮点数字    | 
| Number("1.34abc")     | NaN  | 包含了数字以外的字符 | 

#### parseInt()方法

| 代码                       | 结果  | 备注                   | 
|--------------------------|-----|----------------------| 
| parseInt("Hello world") | NaN | 没有找到数字               | 
| parseInt("")            | NaN |                      | 
| parseInt("123abc")       | 123 |                      | 
| parseInt(true)           | NaN |                      | 
| parseInt(undefined)      | NaN |                      | 
| parseInt(null)           | 0   |                      | 
| parseInt(1.23)           | 1   |                      | 
| parseInt("1.34abc")      | 1   | 只包含浮点数字              | 
| parseInt("10",10)        | 10  | 尽量指定第二个参数,以10进制的方式转换 | 
| parseInt("def123abc")    | NaN | 不是以数字或者(空字符加数字)开头    | 
| parseInt("0xf")          | 15  | 16进制			    | 

#### parseFloat()方法

| 代码                       | 结果  | 备注                   | 
|--------------------------|-----|----------------------| 
| parseFloat("Hello world") | NaN | 没有找到数字               | 
| parseFloat("")            | NaN |                      | 
| parseFloat("123abc")       | 123 |                      | 
| parseFloat(true)           | NaN |                      | 
| parseFloat(undefined)      | NaN |                      | 
| parseFloat(null)           | NaN   |                      | 
| parseFloat(1.23)           | 1.23   |                      | 
| parseFloat("1.34abc")      | 1.34   | 只包含浮点数字              | 
| parseFloat("def123abc")    | NaN | 不是以数字或者(空字符加数字)开头    | 
| parseFloat("3.125e7")    | 31250000 |                      | 
| parseFloat("0908.7.2")    | 908.7 |                      | 
| parseFloat("0xA")    | 0 |  16进制的字符串始终转换为0      | 

## 三.对于String

| 代码                | 结果          | 备注                            | 
|-------------------|-------------|-------------------------------| 
| String(10)        | "10"        |                               | 
| String(1.23)      | "1.23"      |                               | 
| String(00011)     | 11          |                               | 
| String(0001.23)   | 报错          | missing ) after argument list | 
| String(null)      | "null"      |                               | 
| String(undefined) | "undefined" |                               | 

