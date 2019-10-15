---
title: hexo 更新主题的方法
date: 2016-03-19 17:50:16
tags: hexo
categories: 
- 软件
---

我们在使用hexo安装了主题之后，后续主题作者可能会更新了主题，比如修复了bug，增加了功能等。那么这个时候我们就要想办法更新主题，最粗暴的方法就是直接删除主题，重新安装最新的，但这种方式不是用hexo写博客的精神。如果主题是托管在git上面的，那么就非常好办了。我们通过简单的git命令就可以完成更新操作了。
<!-- more -->
这里我们以目前非常流行的`NexT`主题为例，我们安装的时候都是通过git的方式安装的，那么我们通过git在hexo目录下面，定位到`next`目录，

在git中直接运行`git fetch origin master`先把远程分支摘取下来，如下图
![](http://7te946.com1.z0.glb.clouddn.com/16-3-19/59283102.jpg)

我们来对比看一下远程和本地的差异，运行`git diff master origin/master`,如下图
![](http://7te946.com1.z0.glb.clouddn.com/16-3-19/1513263.jpg)

接下来我们就可以进行合并操作了，运行`git merge origin/master`,如下图
![](http://7te946.com1.z0.glb.clouddn.com/16-3-19/75538785.jpg)

简单的三条命令我们就完成了主题的更新操作。

需要注意的是：

我们一般都要对主题的配置文件进行修改的，所以在合并的时候一定要注意远程的修改时间和本地的修改时间，如果远程的修改时间比本地的新，比如配置文件中可能增加了新的功能，那么一定要记得备份本地的修改文件，要不然合并下来可能会被覆盖掉的。
当然，我们也可以通过更加方便的方式使用`git stash`或者`git rebase`方式来更新合并。

### 2016.03.25更新

当然，更好的办法还是应该是把原作者的github进行fork过来，然后在自己的本地修改git的远程分支为自己fork过来的地址，并添加upstream分支为原作者的分支。

这样，我们保留master分支上的代码一直是和upstream以及origin上的代码是同步并一致的，而自己对主题的修改刚新建的一个分支，比如叫`building`分支,这样，当主分支有了更新之后，我们也能够安全地进行合并，如果我们自己想对主题进行比较好的修改，那么我们可以在主分支上面，再新建的一个`dev`分支，添加功能之后，还可以向原作者进行pull request,这样也可以贡献我们自己的代码了。

比如我的实际操作，在github上fork完毕原作者的主题之后：

因为我之前对主题文件的配置进行了修改，所以我先把配置文件保存出来，因为我不需要合并，我需要把master分支保证和源分支一致。

首先，丢弃我对主题的修改
```
git reset --hard HEAD
```

修改远程地支的地址为自己fork之后的，
```
git remote origin set-url git@github.com:buxuku/hexo-theme-next.git
```

当然，这一步我们也可以先删除远程分支再添加的方式
```
git remote rm origin 
git remote add origin git@github.com:buxuku/hexo-theme-next.git 
```
或者直接修改config配置文件

然后添加原作者的远程分支

```
git remote add upstream git@github.com:iissnan/hexo-theme-next.git
```

同步原作者的分支

```
git fetch upstream
```

合并到master分支

```
git merge upstream/master
```

push到自己的github上面

```
git push origin master
```

添加自己写博客需要的一个分支
```
git checkout -b building
```
然后尽情地修改自己的配置文件，主题什么的，尽情享受写作的乐趣吧

修改完毕之后，git commit之后，我们再git push origin building推送到自己的远程目录。

当我们换电脑之后，全新安装hexo,进入theme目录，克隆我们的远程仓库

```
git clone git@github.com:buxuku/hexo-theme-next.git next
```
和上面一样，添加upstream分友

下载我们的building分支
```
git checkout -b building origin/building
git checkout master
```
检查更新，合并更新，合并更新到building分支

```
git fetch upstream
git merge upstream/master
git push origin master
git checkout building
git merge master
git push origin building
```
------

### 扩展阅读

> Syncing a fork ：[https://help.github.com/articles/syncing-a-fork/](https://help.github.com/articles/syncing-a-fork/)
> Configuring a remote for a fork ：[https://help.github.com/articles/configuring-a-remote-for-a-fork/](https://help.github.com/articles/configuring-a-remote-for-a-fork/)