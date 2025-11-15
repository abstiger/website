---
order: 7
title: krproject开发进展（七）
article: false
date: 2013-02-26 19:01:16
---

趁着这段还不是很忙的时间，考虑将krproject的web页面搞定，这样大家便会对krproject有个更直观的感受了，当然还希望能有一定的乐趣和可玩性，便有了结合weibo和krproject的想法，于是我的krproject的examples里除了antifraud，又多了个playweibo。

## PlayWeibo

这个playweibo小应用例子的大致设计想法是：  

用户登录krweb后，通过[OAuth2](http://oauth.net/2/ "oauth2")授权绑定后，后台定时获取各个社交媒体（目前只做了新浪微博，以后看情况考虑接入腾讯微博，twitter，google plus……，有krproject对多数据源的支持，添加一个应用来源还是很轻松的！）的timeline信息后，发送到krserver。krserver则根据用户在krweb上设定的规则，可以对接收的微博流水进行智能化操作，比如自动转发（接入其他社交媒体信息后，便可以设定类似这样的规则：将腾讯微博自动转发到新浪微博了）、自动评论、信息统计、消息提醒与备份等等。

## 修改内容

但是实际在用flask框架写krweb的时候，还是发现了要想支持这样的应用，krproject还需要做一些完善，于是便有了github上的这一次[commit](https://github.com/abstiger/krproject/commit/3e04f2ede77ba9bbdcf1178c6b5a155876b4af1e "github commit")，主要修改内容有:

1.  线程池的lockfree改造，这是上次压力测试发现的问题了，本来想采用无锁队列，仔细分析了下后，觉得没必要搞的这么复杂。我的改造很简单也很粗暴，并没有用什么底层CAS原语或者高一点的spinlock，而就是在主线程里while……
2.  群组的引入，群组是一系列规则的集合，有了它便可以实现规则的差异化管理了。
3.  json的全面引入，无论是消息报文的输入、计算器的构造、规则处理的结果输出全面支持json格式了，借着json的易用性和高可扩展性，krengine的应变能力应该会有较大幅度的提升。

其中最主要的莫过于我舍弃了之前写的基于flex&bison的[计算器表达式](./krproject-develop-trace-2)，改为了更适合web编辑的json格式：

之前的字符串格式计算器表达式:
```
(F_6 @@ {'00','01','02',} );
```

现在的json格式计算器表达式:
```json
{
    "op":	15,
    "child0":	{
        "kind":	7,
        "value":	6
    },
    "child1":	{
        "kind":	14,
        "value":	"00,01,02,"
    }
}
```

虽然没有之前的简单清晰，但是前台js处理起来应该会舒服很多。：）


## 后续计划

虽然这段时间还是coding了不少代码，krweb的框架也大致搭好，但是距离krweb的正式上线还是有一些距离的，后面主要的任务就是将krweb完成，并争取早日将playweibo弄上线!

ps:是放到我的小树莓派pi上哦~：）