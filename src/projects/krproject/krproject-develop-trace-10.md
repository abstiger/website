---
order: 10
title: krproject开发进展（十）
article: false
date: 2013-06-29 21:10:10
---

这段时间暂停了下playweibo的开发，花了些时间在krproject的自身完善上，修改的几个大点如下：

1. 共享内存改为动态内存。遗留原因，之前将数据库等相关配置信息放在共享内存中，这样可以方便的查看. 更新，但目前以引擎的方式打包，这样的共享内存方式俨然给引擎调用者带来了一些额外的麻烦。于是便考虑将共享内存中的内容放至动态内存中，提供接口供引擎修改和查看，这样一方面让引擎更加纯粹，另一方面参数的配置也会更加灵活一些。

2. swig生成绑定接口。[swig](http://www.swig.org/ "swig")确实是个还蛮不错的工具，几个月前还不知道有这工具的时候，自己写了krengine的python绑定，虽然不难，但改起来还是挺麻烦的。在看到他的社区参与度挺活跃的时候，决定尝试一下，发现确实挺好用的。目前生成了python和java的两个接口，并都做了验证，让krengine作为小的library灵活的嵌入到不同语言中，相信会赋予它更强的生命力。

3. 增加运算器的表达格式。krproject的一个很重要构成即是他的计算引擎，最早时我尝试了flex+bison写了它的规则语法，参考：[krproject开发进展（二）](./)krproject-develop-trace-2)，后来为了方便web的编辑使用，我将计算引擎的表达式换成了json格式，参考：[krproject开发进展（七）](./krproject-develop-trace-7)，最近因为一些需要，我在考虑使用[smartgwt的filter](http://www.smartclient.com/smartgwt/showcase/#featured_filter_builder_grid "smartgwt filter")作为规则编辑界面，将它的json表达式作为计算引擎的表达式。于是我想到干脆将这三种表达方式都支持起来，各有各的特点：第一种原生的flex+bison表达式：简洁直观；第二种json格式表达式：web编辑操作方便；第三种gwt格式表达式：特殊需要。

还有些细枝末叶的调整修改，就不再赘述了，接下来考虑做的事情有：

1. 将事件驱动加入引擎中。这会是一个挺大的改动，这段时间也在构思，没有真正动手。之前krproject的事件库是用的redis里ae.c，且仅用在krserver的scoket通讯处理上。作为一个真正灵活的事件处理引擎，在引擎内部维护一个高效率的事件循环loop是很有必要的，redis的事件驱动在timer上并没有做很多的优化，这样ae.c可能就不是特别适合我的需求了，调研了一下，考虑引入[libuv](https://github.com/joyent/libuv "libuv")了。具体的做法还需要在分析考虑下。

2. 引擎接口的开放。目前引擎只暴露了四个接口：`kr_engine_startup()`, `kr_engine_run()`, `kr_engine_shutdown()`, `kr_engine_info()`，再增加些类似日志设置，参数加载等函数接口是有必要的。

