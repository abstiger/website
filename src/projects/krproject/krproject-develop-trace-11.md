---
order: 11
title: krproject开发进展（十一）
article: false
date: 2013-12-08 19:12:27
---

![krproject模块结构](./assets/krproject-archetype.jpg)

上面是最新的krproject的模块架构图，有好长一段时间没有继续krproject的开发日志了，这中间暂停了一段时间，也有充分的时间思考了下krproject的设计，然后再上上个周末做了一次较大规模的代码重构，参考github上的那次[commit](https://github.com/abstiger/krproject/commit/0eda478498b58c162d34ee1abb939a34647a6ede "reconstruction")。

这周末也是做了些调整，基本上是精简了代码，让骨架更清晰了些，完整的测试还没有做，暂时就不将代码push上去了。

## 谈谈这次的设计改动吧

首先是krproject的设计定位，在上次{% post_link krproject-develop-trace-10 krproject开发进展（十）%}中，提到我做的主要工作就是实用swig工具生成krengine的binding，当时觉得将krengine潜入到其他语言中，会让krengine更灵活，使用面更广。但思考了一下数据库的实现，就发现我走的方向有问题，作为一个分析引擎，应该是以server的方式提供服务，其他语言的客户端client通过socket方式，按照既定协议进行通信。所以对krproject来说，krengine的bingding并不十分必要。

谈到server，很早以前就考虑引入网络通信及事件驱动库[libuv](https://github.com/joyent/libuv "liuv")，实际上我也做了尝试，完全异步回调的通信程序写起来好恶心，而且要实现一个确保固定长度接受和发送的函数还是挺麻烦的，只在它的tests里找到个dns-server.c参考，但这都不是问题，我想使用libuv的原因不只是想用它的通信框架，更想用的是他的事件驱动event loop和线程池queue work，但是它的线程池实现没有地方去配置线程的上下文，还有我并不需要处理完后再通知主线程的动作，总之它的线程池模型并不是我想要的。最后我还是放弃了libuv，还是用回之前从redis里扒过来的eventloop，线程池还是用我之前自己的实现，如果以后有timer方面的要求，我想简单的将redis里的timer链表结构换成skiplist即可。

还有很多细枝末节的改动，包括对类型的包装，endian的加入，引擎接口kr_engine_run的修改等等，就不再赘述了。

## 接下来要做的事情有

首先是web端krweb的实现了，在之前玩playweibo的时候，用python的flask框架搭了些架子，可是后来由于自己对前台开发的不熟悉，进行的很缓慢。然后这段时间参考了一些开源实现，觉得用php搭一个简单的管理界面是比较常见的，于是果断抛弃了flask，改用了php的yii框架，不得不说，还是挺快的，对我这样的php新手来说，花了两天时间，基本的框架都出来了，初步效果还算凑合吧，放在了我的小pi上

然后是机器学习了，其实很早前我考虑的是python的机器学习scikit-learn库，但后来我想以内嵌的方式调用，这样要包装他的C接口难度太大了，于是前段时间偷空学习了下R语言，而且R目前在很多的生产环境都有实际应用，我想还是靠谱的。R本来就是用C和fortran写的，但是它的C接口操作还是有点复杂的，好像现在用的比较多的是他的C++包装[Rcpp](http://cran.r-project.org/web/packages/Rcpp/index.html "Rcpp")，但我的需求场景没有那么复杂，所以我还是考虑将R嵌入embed到C中，然后在R中通过接口获取统计量等信息。
