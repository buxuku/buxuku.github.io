---
title: 用几行原生js代码写的九九乘法表
date: 2016-10-26 17:14:14
updated: 2016-10-26 17:14:14
tags: demo
category: 前端
---

无聊想到写的一个小demo,整个js代码只有几行，关键思路就是乘数置前的处理手段。
<!--more-->
我们正常的思维逻辑按照我们背的方式，一列一列的来生成：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>

</body>
<script>
  for(i=1;i<10;i++){
    for(j=i;j<10;j++){
        console.log(i+"*"+j+"="+i*j);
    }
  }
</script>
</html>
```

如果要在页面上展示出来，我们一行一行地进行处理，刚不是向上面那个一列一列地处理，可能更容易展示，于是我们就想到在循环中把乘数放在外层是更容易处理的。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <table id="table"></table>
</body>
<script>
  for(var i=1,htmlStr='';i<10;i++){
    htmlStr += "<tr>"
    for(var j=1;j<=i;j++){
        htmlStr += "<td>"+j+"*"+i+"="+i*j+"</td>"
    }
    htmlStr += "</tr>"
  }
  document.getElementById("table").innerHTML=htmlStr;
</script>
</html>
```
