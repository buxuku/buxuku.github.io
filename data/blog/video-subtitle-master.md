---
title: 找不到好用的视频生成字幕及翻译字幕软件，于是我开源了一款
date: 2024-05-23 14:22
tags:
  - 软件
  - nodejs
  - 开源
  - whisper
  - ffmpeg
summary: 批量为本地视频生成字幕文件，并把字幕文件翻译成其它语言，一直找不到好用的工具，于是我就自己开源了一款出来
---

> [!TIP]
> 
> 客户端版本地址： https://github.com/buxuku/video-subtitle-master ，欢迎大家使用体验


自己之前下载了一些外文视频（我说是学习视频，而非岛国视频，你信吗？哈哈！），没有字幕，希望能够添加字幕文件，同时也能够将字幕文件翻译成中文， 还希望能够通过批量处理的方式来减轻工作量。  

类似需求，有一批厂商已经提供到了支持，比如 讯飞听见， 网易见外 等，但这些在线服务都涉及到视频的上传动作，效率相对比较低下。  

希望能够找一个客户端工具，在本地来生成，试用了一些工具（Mac 平台），依然不理想  

- Buzz 非 Store 版本没有对 apple silicon 做优化，字幕生成速度比较慢，也不支持翻译  
- MacWhisper 免费版本只支持单个生成，不支持批量，不支持翻译  
- WhisperScript 可以批量生成，但字幕文件需要手动一个个地保存，不支持翻译  
- memo.ac 做了 mac 下的性能优化，可以使用 GPU ，也支持翻译功能，非常棒的一款软件，但目前批量模式有一些 bug ，无法正常使用

找不到好用的，干脆就自己来写个工具吧，因为自己是做前端的，想到的就是用 Nodejs 写脚本来批量处理实现。核心流程就是通过 `ffmpeg` 提取音频，通过 `whisper` 生成字幕文件，通过翻译 api 把字幕文件翻译成中文字幕文件，然后就可以在播放器里面挂载字幕了。

我把这个工具开源了，地址： https://github.com/buxuku/VideoSubtitleGenerator ， 后面非常荣幸得到了一峰大佬的推荐，一峰大佬的影响力果然非同凡响，推荐之后，这个项目的 star 数直线蹭蹭上涨，一下子就得到了 300 多 star, 给我了很大的鼓舞。

[![Star History Chart](https://api.star-history.com/svg?repos=buxuku/VideoSubtitleGenerator&type=Date)](https://star-history.com/#buxuku/VideoSubtitleGenerator&Date)

同时，我也发现，小工具，自己用用很简单，但要把它开源，做成好用的产品，还是有一定难度的，比如我这个小工具，要使用它，需要在电脑上提前安装好 whisper 和 ffmpeg, 这本身就有一点门槛了。

于是我进行了迭代了，把 `whisper` 和 `ffmpeg` 集成到了工具里，不需要用户下载了，减少了很多步骤，但它依然还是一个命令行的工具，需要在终端里面使用，同时修改配置也需要在配置文件里面进行修改，使用上还是有一些难度的。

进一步想想，那我干脆把它做一个客户端工具好了，所有的配置操作都可视化， 这样使用上就没有什么门槛了，大家使用起来也非常方便了。

啃了一下 `electron` 的文档，集成 `ffmpeg`, 通过 `nextjs + shadcn + tailwindcss` 写前端页面，把整个命令行工具的能力集成到了这个客户端工具里面。整体效果如下图：

![wpTTKH_20240523_AXpKEE](https://static.linxiaodong.com/images/wpTTKH_20240523_AXpKEE.png)

当然，它还只是一个初始版本，也非常欢迎大家尝试使用，提出宝贵的意见和建议，我将持续更新迭代，让它能够更好地帮助到有需要的朋友们。

这是项目的地址： https://github.com/buxuku/video-subtitle-master
