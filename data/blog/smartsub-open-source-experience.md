---
title: 从 0 到 2K Star：我的开源之旅与成长
date: 2024-05-23 14:22
tags:
  - 软件
  - nodejs
  - 开源
  - whisper
  - ffmpeg
summary: 我通过 github 开源的一款音频视频生成字幕及字幕翻译工具，从 0 到 2K start的成长经历
---

## 需求之痛：项目的诞生

作为一名技术爱好者，我面临着一个常见却棘手的问题：手中有大量外文教程，却没有合适的字幕。市面上虽有讯飞听见、网易见外等在线服务，但上传大量视频既耗时又低效。我尝试了几款本地工具，却各有不足：

- Buzz 非 Store 版本在 Apple Silicon 上性能欠佳，且不支持翻译
- MacWhisper 免费版仅支持单个处理，不支持批量和翻译
- WhisperScript 支持批量生成，但字幕需手动一个个保存，不支持翻译
- memo.ac 虽然支持 GPU 加速和翻译功能，但批量模式存在大量 bug

经过思考，我意识到可以构建一个简单而高效的工作流：

1. 通过 ffmpeg 从视频文件中提取音频
2. 利用 Whisper 模型将音频转换为原语言字幕
3. 调用翻译 API 将字幕翻译成目标语言

这个思路看似简单，却能完美解决我的需求。我相信，有同样需求的人一定不在少数。

## 技术选型：扬长避短

作为前端开发者，我自然选择了最熟悉的 Node.js 作为开发语言。考虑到我使用的是 Apple Silicon 芯片，底层语音识别引擎选择了 `whisper.cpp`，这个项目对 Apple Silicon 做了大量优化，能提供极快的处理速度。

最终，我通过 Node.js 命令行脚本实现了完整流程：批量处理视频目录，自动提取音频，生成原语言字幕，再调用翻译 API 完成双语字幕的生成。整个流程不仅简单高效，还真正解决了我的实际需求——我成功为电脑里的大量英文视频生成了双语字幕。

既然这个工具解决了我的问题，想必也能帮助到其他人。于是，我决定将它开源到 GitHub 上。

## 初次推广：意外的收获

开源后，我并没有对 Star 数量抱有太高期望，只希望能帮助到有同样需求的人。

作为技术博客的忠实读者，我订阅了阮一峰老师的《科技爱好者周刊》。2024年3月1日，我抱着试一试的心态，在周刊的 Issue 中提交了自荐（https://github.com/ruanyf/weekly/issues/4393）。

提交后，项目开始零星收到几个 Star。真正的转折点是3月10日，阮一峰老师给我的 Issue 打上了 weekly 标签，意味着他会在周五的周刊中推荐我的工具。这一天，项目突然收获了几十个 Star，让我感受到了一峰老师的流量效应。

接下来的一周多时间里，Star 数持续增长，每天都有几十个新增。短短一周多，项目就积累了300多个 Star，这对我来说是一个巨大的成就和鼓励。

之后增长速度逐渐平稳，每天大约有1-2个新增 Star，进入了一个自然增长的阶段。

![Star History 2025](https://static.linxiaodong.com/images/Star%20History%202025_20250404_eAeWCg.png)

## 产品进化：从命令行到图形界面

阮一峰老师的推荐带来的几百个 Star 给了我极大的成就感，但同时也让我意识到一个问题：虽然工具解决了实际需求，但使用门槛依然不低。

最初的版本要求用户预先安装 Whisper 和 FFmpeg，这已经是一个不小的技术门槛。于是我进行了第一次迭代，将 Whisper 和 FFmpeg 集成到工具中，免去了用户手动安装的麻烦。但它仍是一个命令行工具，需要在终端中使用，配置修改也需要编辑配置文件，对普通用户来说依然不够友好。

思考再三，我决定将其打造成一个真正易用的桌面应用。我学习了 Electron 的文档，集成了 FFmpeg，并使用 Next.js + Shadcn + Tailwind CSS 构建了前端界面，将命令行工具的全部功能移植到了图形界面中。这次升级彻底降低了使用门槛，让非技术用户也能轻松使用。

![客户端界面](https://static.linxiaodong.com/images/wpTTKH_20240523_AXpKEE_20250404_bCFnuO.png)

## 再次推广：持续的努力

完成客户端工具后，我再次向阮一峰老师自荐（https://github.com/ruanyf/weekly/issues/4503），但可能因为与之前的命令行版本功能重复，没有获得 weekly 标签。

2024年6月，我在 V2EX 上分享了这个工具（https://v2ex.com/t/1043476#reply42），也带来了一些流量，但效果不及阮一峰周刊的推荐。

此后，项目进入了稳定增长期，每天有2-3个 Star 的自然增长，主要来自搜索引擎的自然流量。

## 持续迭代：倾听用户声音

随着用户的增加，我收到了越来越多的 Issue 和功能请求。我持续迭代产品，增加了 Windows 版本支持、多语言支持、手动导入模型等功能。

2024年是 AI 大爆发的一年。9月，我为工具增加了 Ollama 和 OpenAI 的支持。当时 DeepSeek 注册用户赠送50万 token，我也将 DeepSeek 接入到了工具中。

我还将项目提交到了 DeepSeek 的第三方集成应用列表（https://github.com/deepseek-ai/awesome-deepseek-integration/pull/40/）。当时列表中的应用并不多，我的工具是前几个被收录的应用之一。

![Pasted image 20250328175347](https://static.linxiaodong.com/images/Pasted%20image%2020250328175347_20250404_UHAlvP.png)

## 意外的爆发：借势成长

我一直保持着稳定的迭代节奏，项目也以平均每天2个 Star 的速度稳步增长。直到2024年12月底，情况开始发生变化——每天的 Star 数开始逐渐增多：3个、4个、5-6个。

到了2025年1月，每天有10多个新增 Star。
2月，每天增长到20多个。
2月上旬，项目突破了1000 Star，达到了又一个里程碑。

这段时间恰好是 DeepSeek 最火热的时候，我注意到项目的流量来源大部分来自 DeepSeek：

![Pasted image 20250216222516](https://static.linxiaodong.com/images/Pasted%20image%2020250216222516_20250404_k7DG8N.png)

![Pasted image 20250216222523](https://static.linxiaodong.com/images/Pasted%20image%2020250216222523_20250404_D9mRoM.png)

每天10-20个 Star 的增长不仅让我兴奋，这种认可也激励我更频繁地迭代产品，不断完善功能。

## 口碑传播：自发的推荐

除了前面提到的阮一峰周刊、V2EX 和 DeepSeek 平台，我并没有在其他平台主动推广这个工具。毕竟它是一个纯开源项目，我也没想过靠它盈利，所以没有花太多心思去推广。

然而，一个真正解决用户痛点的产品，总能获得自发的传播。当我发现项目有流量来自知乎、吾爱破解、AI-Bot 等平台时，我搜索了一下项目名（当时叫 video-subtitle-master），发现许多平台都已经收录并推荐了我的工具：

![Pasted image 20250403180004](https://static.linxiaodong.com/images/Pasted%20image%2020250403180004_20250404_DKZqh7.png)
![Pasted image 20250403180046](https://static.linxiaodong.com/images/Pasted%20image%2020250403180046_20250404_Jrshis.png)

甚至有不少公众号也在介绍我的工具：

![Pasted image 20250403180231](https://static.linxiaodong.com/images/Pasted%20image%2020250403180231_20250404_dktzeV.png)

这些自发的收录和推荐让我感到意外和欣慰。这也证明了工具确实解决了一部分人的实际需求，特别是对自媒体创作者和学习外语教程的学生来说。

## 技术挑战：AI 助力突破边界

随着项目的发展，用户不断提出新的功能需求，我也开始遇到自己的技术瓶颈。

例如，我尝试在 Node.js 环境下编译 addon.node 文件，却一直失败。我发现上游仓库 `whisper.cpp` 的 CI 流程中也存在编译失败的问题。我对 `addon.cpp` 文件并不熟悉，于是借助 `Cursor` AI 工具帮我分析代码，寻找编译失败的原因。

通过 Cursor 提供的线索和我的分析，我发现问题出在官方的一次 [commit](https://github.com/ggerganov/whisper.cpp/commit/c64f3e8adabb52232332d805e4b681cd58e29739) 中，它重构了文件结构，导致 `addon.cpp` 缺少了必要的引入。我立即向官方提交了一个 [PR](https://github.com/ggerganov/whisper.cpp/pull/2858)，解决了这个问题：

![Pasted image 20250403211210](https://static.linxiaodong.com/images/Pasted%20image%2020250403211210_20250404_3ZayCM.png)

另一个挑战是用户希望在提取字幕时能看到进度显示，因为长视频处理时间较长，用户无法得知进度。但官方编译的 Node.js 包没有暴露这个 API。我再次借助 Cursor 分析官方项目和编译文件，发现官方项目本身是有进度显示功能的，只是没有在 Node.js 包中暴露。

在 Cursor 的帮助下，我成功实现了这个功能，并再次向官方提交了 [PR](https://github.com/ggerganov/whisper.cpp/pull/2941)，也被采纳：

![Pasted image 20250403211734](https://static.linxiaodong.com/images/Pasted%20image%2020250403211734_20250404_V0PWnV.png)

这些经历让我深刻体会到 AI 工具如何帮助开发者突破技术边界，解决以前难以攻克的问题。

## 开源之路：收获与成长

开源这款工具的经历，让我在技术和产品思维上都有了显著成长。在这个过程中，我同时扮演着产品经理、开发者和测试者的角色，这促使我从多个角度思考问题，更全面地规划产品。

用户提出的建议和反馈极大地拓展了我的视野，让我看到了更多可能性。在实现这些功能需求的过程中，我也遇到了不少技术挑战，这些挑战成为了我突破自我、提升能力的宝贵机会。

开源不易，每一位开源作者都付出了大量心血。希望我们能更多地尊重开源作者的贡献，也希望更多人能加入开源社区，为技术发展贡献自己的力量，哪怕只是一点点。

如果你也有类似的需求，欢迎尝试我的这个开源项目：[SmartSub](https://github.com/buxuku/SmartSub)，也欢迎你的 Star 支持！

---

*注：2025年3月，我为项目取了一个中文名"妙幕"，同时将项目名从 video-subtitle-master 更改为更简洁的 SmartSub。*
