---
order: 13
title: krproject开发进展（十三）
article: false
date: 2014-01-22 21:22:28
---

这个月最主要的工作就是将krproject的客户端krclient和命令行接口（command line interface）krshell大致写完了，并新建了一个[github](https://github.com/abstiger/krclient "krclient")项目，将他们放上去发布了。

其实之前的krclient并不是真正的客户端，充其量算一个krserver测试程序罢了，在我想写一个命令行管理终端时，我意识到这一点，然后看了些redis和mysql的源码，原来他们都是基于client的，在此基础上，封装对命令行的解析处理，然后便是客户端接口调用。

意识到这点后，便开始了客户端krclient的开发，然而我发现之前krengine提供的接口太少了，而且格式并不友好，所以想到将接口api统一为方便易读的json格式，便有了对krengine以及内部各个模块的接口函数编写。当然，krengine暴露的接口依然还是kr_engine_run，只不过在内部构建了一个msgtype -- handle_func的映射表，目前提供的接口大概也有近20个吧，后面也会继续完善的。

在krclient基本开发完毕后，我便着手krshell的开发了，用了[readline](http://cnswww.cns.cwru.edu/php/chet/readline/rltop.html "readline")库处理用户的交互输入，不得不说这个readline还是挺不错的库，好像bash/mysql/sqlite等等好多都有使用它，确实很方便。当然redis用的是作者自己写的linenoise。而krshell的输入提示prompt也被我设计为尖下巴的笑脸模式：
```bash
krshell:->
```
当然这其中还有些上篇文章提到的一些问题修复等，就不再罗嗦了。

聊聊接下来的考虑和打算吧：

1.  krclient的完善：目前krclient还比较简陋，只有同步接口，不提供异步接口也没有连接池等。在bindings目录下我也是通过swig生成了python和java的客户端，还没有测试过。关于krclient的其他语言版本，还是希望能够独立开发，因为本身krclient的通讯协议并不复杂，相信他的客户端写起来并不会很复杂。
2.  krweb的完善：完善现有规则配置界面，另外通过php的krclient，将对krserver的一些管理信息加入krweb中。
3.  R的嵌入接口编写：这在我的开发日志 [krproject开发进展（十一）](./krproject-develop-trace-11) 中已经提到过了，这段时间也在学习R，我想这块应该是今年krproject TODO list里的重头了，spark都将R集成了，krproject也不可以落后啊……，哈哈～
好了，流水帐就记录到这了～
