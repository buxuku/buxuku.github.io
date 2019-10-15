---
title: 如何优雅地在mardown中插入表格
date: 2016-05-02 00:08:01
tags: markdown
category: 软件
---
非常喜欢用markdown来写文章,但相信大多数在使用markdown的时候会有和我一样的困扰,那就是插入表格是非常不方便的.markdown本来就是让我们专注于写作的,而表格的书写方式确实是反人类的.今天要写一篇文章,不得不插入一些表格,于是寻找了一些解决方法,能够方便地在markdown里面插入表格.
<!--more-->
## 第一种 最笨的 图片法

这是这笨的方法,也是最无奈的方法,就是把表格转换成图片,当然,这也是最不想用 方法了,体积大,语义不强等.

## 第二种 编辑器法

就是借用markdown编辑器自带的插入表格功能.有一部分markdown已经带有表格插入功能了,比如MarkDownPad,但它需要pro版才带有这个功能的,还有比如小书匠,免费的,带有插入表格的功能.

markdownpro专业版拥有这个功能
![markdownpro][1]

小书匠也带有这样的功能
![小书匠也带有这样的功能][2]

因为我习惯于直接使用平时写代码的sublime text来写,所以对于markdown编辑器没有多试用,所以其它编辑器大家可以自行查看是否支持表格的插入.

## 第三种 在线转换法

如果你像我一样在使用其它编辑器来写markdown,而编辑器又不支持插入表格,同时也不想再安装一个编辑器来单独写markdown,那么可以尝试在线转换的方式.这里推荐几个网站:

 1. [https://www.tablesgenerator.com/][3]这个网站我一直没有打开过
 2. [https://donatstudios.com/CsvToMarkdownTable][4] 用excel写好表格内容,复制进去,就能够在下面显示出markdown的语法了.
 ![enter description here][5]
 3. [http://truben.no/table/#][6] 这个网站可以直接在线设计表格,而且可以生成很多种语法,包括markdown,sql等.
 ![enter description here][7]
 4. [小书匠web版][8] 和它的本地编辑器很类似的,直接在线设计,并生成markdown语法.

PS:我用markdown表格写的一篇博文:[《javascript中数据类型转换那点事 》][9]


  [1]: http://7te946.com1.z0.glb.clouddn.com/markdownpro.png
  [2]: http://7te946.com1.z0.glb.clouddn.com/xiaoshujiang.png
  [3]: https://www.tablesgenerator.com/
  [4]: https://donatstudios.com/CsvToMarkdownTable
  [5]: http://7te946.com1.z0.glb.clouddn.com/csv.png
  [6]: http://truben.no/table/#
  [7]: http://7te946.com1.z0.glb.clouddn.com/truben.png
  [8]: http://markdown.xiaoshujiang.com/
  [9]: http://blog.linxiaodong.com/2016/05/01/js-type-conversion/