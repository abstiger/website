---
order: 3
title: krproject开发进展（三）
article: false
date: 2012-06-16 19:24:35
---

# 进度介绍

下午拉起了协调器krcoordi，简单测试了下其与krserver、krclient之间的协调通信后，krproject的初步框架开发算是完成了！比计划中的日期延后了差不多两个礼拜，除了一些乱七八遭的原因外，还是自己的开发效率并不够高，过程中也碰到了蛮多之前未考虑进来的细节~

还是总结下这段时间的工作及后续的一些安排吧~

## krdb
给krdb增加了通过mmap持久化的功能，krdb是有多个krtable构成，每个table代表了一种格式的输入数据源（定义不同渠道、不同类型的数据），而用户可以根据需要给这些输入数据定义基于单表的索引（表级索引）和贯穿多表的索引（库级索引）。这样便为后续多数据源、多统计维度的数据分析做好了数据准备~

这是我设计的mmap持久化文件的格式概览：
```c++
/* mmap file overview:
 * |T_KRTable|T_KRFieldDef*iFieldCnt|T_Record*lSizeKeepValue|
 */
 ```
文件头是这张表的基本信息，接下来是这张表的域描述信息 ，最后是实际的记录存储。对应索引信息并没有存储在这里，而是需要程序在加载mmap文件时，自己建立~

<!--more-->

## krrule

为了支持半同步半异步的线程池模式分离krdb的插入与krrule的运算，需要为每个规则分析线程创建一个上下文环境context（包括数据库连接的上下文、历史统计量缓存cache、当笔统计量运算与规则分析的动态内存块dynamic memory等），而为了能做到统计量及规则修改的实时生效，这里通过比较动态内存的加载时间戳timestamp与共享内存中的配置信息刷新timestamp，来决定动态内存是否需要重新根据共享内存内容加载。

完成静态数据项和动态统计量的统计运算，目前支持的统计算法包括：sum,count,min,max,count distinct。

## krmsg
```c++
/* The message format for krproject communication:
 * |msgtype(4bytes)|serverid(26bytes)|clientid(26bytes)|datasrcid(4bytes)|
 * objectkey(64bytes)|msglen(4bytes)|message(msglen bytes)|
 */
 ```
这便是Krproject中的消息传递统一格式：由128字节的消息头与可选择的消息内容构成。消息头依次为消息类型、server标识、client标识、数据源标识、key对象（在krcoordi中，按此key对象进行server端的consistent hashing定位）、消息长度；消息内容可选择。

目前实现的消息类型有：
```c++
typedef enum {
    KR_MSGTYPE_SVRON    = 0,
    KR_MSGTYPE_SVROFF,
    KR_MSGTYPE_CLION,
    KR_MSGTYPE_CLIOFF,
    KR_MSGTYPE_APPLY,
    KR_MSGTYPE_REPLY
}E_KRMsgType;
```
这样包装的好处是后续可根据需要对消息内容进行加密、校验和、序列化等操作，不影响其他模块的消息处理。

## krserver

各模块的集成，主要是配置参数的解析和事件驱动handler的编写，这里krserver可根据配置运行在单线程或线程池、单机或集群模式下，下面是server配置文件的一个样板：
```bash
[SYSTEM]
SERVERID=krserver1
DAEMONIZE=0
SHMKEY=74561
DETECTMODE=1
LOGPATH=/home/tiger/krproject/log
LOGLEVEL=5
THREADCNT=5
MAXEVENTS=1024

[NETWORK]
TCPPORT=7251
TCPBINDADDR=
UNIXDOMAIN=/tmp/krserver1.domain
UNIXDOMAINPERM=755
CLUSTERMODE=1
WEIGHTS=20
COORDDOMAIN=
COORDPORT=7250
COORDIP=127.0.0.1
```

## krcoordi

通过consistent hashing结构组织连接到此协调器上的server；  
通过list结构组织连接到此协调器上的client。  
无论是client还是server在实际业务消息发送前都需要先发送对应的注册ON信息。  
Client发送的APPLY信息里，如果指定了server并且该server确实存在，则直接转发至该server，否则根据objectkey一致性哈希确定server。  
Server回复的REPLY信息里，根据对应的clientid确定转达的目的地client。

## krclient

简单报文消息生成与发送测试程序。

# 后续工作

1. 程序测试（功能、异常、压力……），代码注释及日志记录完善，相关说明文档的编写；
2. 动态库加载的方式实现自定义统计算法（比如用户可自定义获取递减次数或连续递增次数等），看了下autotools的动态库方案，虽然能做到平台无关化，但是觉得有点复杂……；
3. 多线程的数据库连接（不同数据库的多线程编程接口并不一致，有点犹豫要不要把这块整进来……）；
4. 历史统计量缓存的设计开发（最早考虑触发式，但是觉得会影响程序的效率，还是考虑采用“用时取值更新”的策略，具体缓存方式采用LRU算法）。


PS：大段的文字总是让人头疼，后面会结合文档编写画一些图上来，相信会让大家有些直观的感觉~  
然后我会找个合适的时间将代码开源的，请大家小小的期待下吧，O(∩_∩)O哈哈~