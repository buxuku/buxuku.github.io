title: sublime text tips
date: 2015-04-28 16:25:56
tags: 
- sublime text
categories: 
- 前端
---

# 一、制作代码片段

tools-->new snippet会自动打开一个新建片段的文档

```
<snippet>
	<content><![CDATA[
Hello, ${1:this} is a ${2:snippet}.
]]></content>
	<!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
	<!-- <tabTrigger>hello</tabTrigger> -->
	<!-- Optional: Set a scope to limit where the snippet will trigger -->
	<!-- <scope>source.python</scope> -->
</snippet>

```
>content代码片段内容
>tabTrigger代码的快捷键，在文档中输入该代码后，按Tab就可以输出content中的代码内容了。
>scope中定义该代码在哪种类型文档中可以生效。
<!-- more -->
例如我常常要写一个jquery开源cdn库的缩写。

```
<snippet>
	<content><![CDATA[
<script type="text/javascript" src="http://libs.useso.com/js/jquery/1.9.1/jquery.min.js"></script>
]]></content>
	<!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
	<tabTrigger>jq</tabTrigger>
	<!-- Optional: Set a scope to limit where the snippet will trigger -->
	<!-- <scope>source.python</scope> -->
</snippet>

```
编辑完之后保存为 C:\Users\[用户]\AppData\Roaming\Sublime Text 2\Packages\User\jq.sublime-snippet  (Win7下) 默认的保存路径就行。后缀必须是.sublime-snippet。

重启后打开，在代码中输入jq,然后按tab就可以直接插入jquery源了。

当然，我们还可以在代码中使用${1},1代码序号，使用了之后，在输出代码的时候会自动定位的${1}位置，按tab后会跳到第二个位置，如果数字相同，则是同时选中的效果。
如果下面一个代码片段：

```
<snippet>
    <content><![CDATA[
<!doctype html> 
<html> 
<head> 
    <meta charset="utf-8"> 
    <title>${1}</title> 
</head>
<body>
    <h1>${1}</h1>
    Hello, ${2:this} is a ${3:snippet}.
</body>
</html>
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <tabTrigger>html5</tabTrigger>
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <!-- <scope>source.python</scope> -->
</snippet>
```

保存完重启Sublime text 2，新建文件：输入html5,tab会出现如下效果：

![](http://www.blogjava.net/images/blogjava_net/hafeyang/sublime_text2_snippet-1.jpg)

${1}出现了两次，所以光标同时编辑图中两处。
${2:this}，所以在2处出现this默认值。${1}处编辑完按tab就到${2}处。