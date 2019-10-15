---
title: 使用git bisect进行二分法定位错误的提交
date: 2017-10-03 19:38:49
tags:
- git
category: 软件
---

使用场景来源于曾经的一次代码合并，代码合并之后，控制台报错，而且不是显性的错误，很难从代码层面查找到问题，测试了几次都没办法定位到问题的所在位置。无奈，只好进行回退对比了，这一次合并一共有十来次提交，决定回退看看是哪一次提交产生了对比，然后做修改对比。

当然，很自然的就是采用二分法的回退，先回退到中间的那一个版本，看问题是否存在，这样每回退一次，都可以减少一半的提交记录，十来次的提交，很快就可以定位到错误的那一次提交了。

而对于强大的git，在这一次的经历中，确实是没有想到git还有`git bisect`这么方便的一个命令，虽然它和`git flow`工具一样，并不是什么强大的命令，但在这关键的时候，确实能减少我们的工作量，十多次的提交还好，手动回退也很方便，但如果次数很多，再自己去记录，计算中间那一次的提交，就显得不是那么方便了。

于是，顺便安利一下这个命令，当工作中再次遇到类似需要定位错误的提交时，就可以更加得心应手了。

<!--more-->
这里我创建了一个项目 `git@github.com:buxuku/git-bisect.git`，并进行了10次的提交，运行`git log`可以看到10次的提交记录：

```
commit 9551544db6aec178b064eeaba33389ea878d5979
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:43:21 2017 +0800

    v10

commit 4c8d52d249c16908c1ce7aaef00592385cb5e0a2
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:42:44 2017 +0800

    v9

commit fe97e12f750bfd427b815fb062fddb8895e66232
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:42:28 2017 +0800

    v8

commit 734216f2df46550948e1f5ff1161d5d6b6860b10
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:42:09 2017 +0800

    v7

commit 9b715e9f8f3775242c0abd0cb5fd6f65b6d6626c
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:41:52 2017 +0800

    v6

commit ed63a6a71bb28939e498f75cbdf27fb22c01ae72
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:40:06 2017 +0800

    v5

commit c025e1de4c12cca9b245ed33844ebaa040fe6e27
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:39:45 2017 +0800

    v4

commit 1d6abe13c044653ac4e59fce77159f70c1c5b06e
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:39:27 2017 +0800

    v3

commit c3041bd4987b39feaf98d5efaa0690ed35c31c23
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:39:02 2017 +0800

    v2

commit e7bb6dd85abe705972ac4e5ed1626c9893a97627
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:38:15 2017 +0800

    v1
```

假设在`v1`版本我们确认是没问题的版本，在`v10`版本是有问题的版本，

```
git bisect start #开始执行查找
git bisect good e7bb6dd85abe705972ac4e5ed1626c9893a97627 #我们可以确认没问题的最新的一次提交
git bisect bad 9551544db6aec178b064eeaba33389ea878d5979  #我们可以确认的有问题的一次提交
```

执行后可以看到

```
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[ed63a6a71bb28939e498f75cbdf27fb22c01ae72] v5
```

现在head指向了v5这个版本，我们进行测试，发现这个版本是正常的，我们给这个版本打上bisect结果

```
git bisect good ed63a6a71bb28939e498f75cbdf27fb22c01ae72
```

这个时候版本指向了`v7`这一次的提交，

```
Bisecting: 2 revisions left to test after this (roughly 1 step)
[734216f2df46550948e1f5ff1161d5d6b6860b10] v7
```

我们进行测试，发现这一次提交是有问题的，

```
git bisect bad 734216f2df46550948e1f5ff1161d5d6b6860b10
```

这个时候版本指向了`v6`,继续测试，发现`v6`也是有问题的一次提交

```
git bisect bad 9b715e9f8f3775242c0abd0cb5fd6f65b6d6626c
```

执行到这一步， 我们已经定位到的错误的那一次提交了，同时git也给出了我们结果：

```
9b715e9f8f3775242c0abd0cb5fd6f65b6d6626c is the first bad commit
commit 9b715e9f8f3775242c0abd0cb5fd6f65b6d6626c
Author: 林晓东 <buxuku@gmail.com>
Date:   Tue Oct 10 15:41:52 2017 +0800

    v6

:100644 100644 901b26927b75f2a338d8004b3953cc4abe1d6a82 39e1bf998f9a8945cbc08b293d4a759aec15b628 M      README.md
```

表明这是一次有问题的提交。

当然，我们不应该在这一版本中进行修改，我们应该找到问题所在，然后在最新的版本中进行该问题的修复。

```
git bisect reset #退出二分查找
```

在使用这个命令的时候，我们还可以通过`git bisect log > filename`来把我们整个查找的过程输出到一个日志文件中，方便我们查看整个过程，当然，它还有一个更好的用处，就是配合`git bisect replay`来修正我们多次查找当中的错误标记。

比如我们有几十次的提交中，在经过多次二分查找之后，突然不小心把一个错误的提交标记成了正确的提交，而又不希望从头再来，那么就可以把这个过程输出到日志文件中，然后编辑日志文件，再进行`replay`即可。

重复上面的二分过程，最后输出日志文件：
```
git bisect log > log.txt
```
打开这个日志文件，可以看到我们的记录：

```
git bisect start
# good: [e7bb6dd85abe705972ac4e5ed1626c9893a97627] v1
git bisect good e7bb6dd85abe705972ac4e5ed1626c9893a97627
# bad: [9551544db6aec178b064eeaba33389ea878d5979] v10
git bisect bad 9551544db6aec178b064eeaba33389ea878d5979
# good: [ed63a6a71bb28939e498f75cbdf27fb22c01ae72] v5
git bisect good ed63a6a71bb28939e498f75cbdf27fb22c01ae72
# bad: [734216f2df46550948e1f5ff1161d5d6b6860b10] v7
git bisect bad 734216f2df46550948e1f5ff1161d5d6b6860b10
# bad: [9b715e9f8f3775242c0abd0cb5fd6f65b6d6626c] v6
git bisect bad 9b715e9f8f3775242c0abd0cb5fd6f65b6d6626c
# first bad commit: [9b715e9f8f3775242c0abd0cb5fd6f65b6d6626c] v6
```

假如我们在`v6`那一次标记是出错了，应该是一次正确的提交，我们删除v6开始的代码，保存之后，

```
git bisect replay log.txt
Bisecting: 2 revisions left to test after this (roughly 1 step)
[734216f2df46550948e1f5ff1161d5d6b6860b10] v7
```
这个时候自动重播到了`v7`这一次的二分步骤。接下来就可以继续进行标记查找了。

来点恶作剧？既然我们可以自己编辑这个log文件，那么如果我这样编辑它：

```
git bisect start
# good: [e7bb6dd85abe705972ac4e5ed1626c9893a97627] v1
git bisect good e7bb6dd85abe705972ac4e5ed1626c9893a97627
# bad: [9551544db6aec178b064eeaba33389ea878d5979] v10
git bisect bad 9551544db6aec178b064eeaba33389ea878d5979
# bad: [ed63a6a71bb28939e498f75cbdf27fb22c01ae72] v5
git bisect bad ed63a6a71bb28939e498f75cbdf27fb22c01ae72
# good: [734216f2df46550948e1f5ff1161d5d6b6860b10] v7
git bisect good 734216f2df46550948e1f5ff1161d5d6b6860b10
```

我认为第一次提交是有问题的，第五次提交是有问题的，第七次提交是正常的，第十次提交又是有问题的，然后我们`replay`会怎样：

```
git bisect replay log.txt
Some good revs are not ancestor of the bad rev.
git bisect cannot work properly in this case.
Maybe you mistook good and bad revs?
```

显然，它认为这个是有问题的...

更多命名可以参考 [git-bisect](https://git-scm.com/docs/git-bisect)
