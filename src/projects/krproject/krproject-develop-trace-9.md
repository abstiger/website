---
order: 9
title: krproject开发进展（九）
article: false
date: 2013-06-01 11:46:43
---

![playweibo](./assets/playweibo-logo.jpg)

这是我设计的playweibo的logo，是不是很萌？O(∩_∩)O哈哈~

到今天上午，基本将playweibo的前台规则设置和krproject的后台处理打通了，虽然还是有很多bug和问题没有搞定，但还是想写篇博，回顾记录下这段时间krproject的缓慢进展……

上篇文章 [krproject开发进展（八）](./krproject-develop-trace-8) 说到基于jquery实现可将json格式的krrule进行web编辑的组件，这当然是krproject对应web实现的最核心部分，在这部分完成以后，我便将它整合到playweibo的具体应用中了，这段时间便主要在基于flask框架的playweibo开发上。

## 目前playweibo的功能大致有：

1. 用户的管理（注册登录）；

2. 授权绑定（sina weibo的授权绑定）；

3. 规则编辑（json格式的规则编辑，这个界面还是挺难看的，还有不少问题）。

4. 后台job（定时获取用户绑定媒体的信息，调用krengine处理，这一块还是蛮有意思的：采用了krengine的python binding，而为了在规则处理动作中包含媒体操作功能：发微博. 转发. 评论，我将python对象：媒体客户端client传至c端krengine，再在c中调用python对象client的操作函数）

## 与此同时，后台krproject也做了些调整和修改：

1. examples里的playweibo初始数据：sina weibo的timeline数据源配置，接口模块及规则处理模块外部函数编写

2. 将message移至krserver中了，报文格式属于krserver处理的范畴，核心的krengine不应该包含这个

具体改动信息参考github上的这次[commit](https://github.com/abstiger/krproject/commit/09b03d875f3b060f8eff53ee842fffa6872718af)。

## 还待完善的工作有：

1. 前台playweibo的统计量编辑，规则处理动作定制，及规则触发后的后续处理模块：展示当笔微博. 微博触发规则信息及微博处理动作等，前台的开发比我想象要麻烦一些的，而且没有美工，我画出的界面我自己都看不下去……

2. 后台krproject的规则处理模块及client调用，这块目前是可以工作，但有bug，还需要在分析解决。

3. 部署应用到我的小树莓派pi上，前段时间不小心拔了几次线，结果我的小pi上的sd卡出了问题，后来又重新格式化了下，提醒我做好备份，后面也打算写篇博客记录上在小pi上部署playweibo的全过程。

playweibo的应用还挺不成熟的，便先不提交github了，虽然之前创建了个krweb的项目，等playweibo正式上线并稳定运行后，在一并提交。