---
order: 6
title: krproject开发进展（六）
article: false
date: 2013-02-06 21:16:01
---

    这两天抽空找了台机器，把拖了蛮久的krproject压力测试做了下。虽然一直都不是很感冒这些并没有太多实际意义的benchmark数字、指标，但是这样结果数字还是可以从一定程度上反映了一个系统的优劣与瓶颈，而整个测试的过程也帮助我发现一些之前自己功能测试时没有发现的问题，废话不多扯，直奔主题：

## 测试方案

测试流程为：单机、单server情况下利用krclient产生100万条约200字节的随机流水报文，tcpip loopback（也用unix domain测试了下，差别不是很大）发送至协调器krcoordi后，由协调器转发至krserver处理（包括写入内存数据库、计算统计量、规则运算）。

考察因素有：内存流水保留大小（20w/50w）、规则及统计量数目(1rule/10rule)、线程池大小(1thread/4threads)对系统性能的影响。

辅助工具为：[nmon](http://nmon.sourceforge.net/pmwiki.php?n=Main.HomePage "nmon")性能监视和分析工具。

## 测试环境

测试机器配置为4核8cpu、16G内存、centos操作系统，具体环境信息如下：
```bash
/home/chengmq/krproject/log>lsb_release -a
LSB Version:    :core-4.0-amd64:core-4.0-noarch:graphics-4.0-amd64:graphics-4.0-noarch:printing-4.0-amd64:printing-4.0-noarch
Distributor ID: CentOS
Description:    CentOS release 6.3 (Final)
Release:        6.3
Codename:       Final

/home/chengmq/krproject/log>uname -a
Linux aicit 2.6.32-279.5.2.el6.x86_64 #1 SMP Fri Aug 24 01:07:11 UTC 2012 x86_64 x86_64 x86_64 GNU/Linux

/home/chengmq/krproject/log> cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c 
      8  Intel(R) Xeon(R) CPU           E5620  @ 2.40GHz
```

## 测试结果

下面是测试结果的汇总报告，详细的nmon报告在这儿：[benchmark.xlsx](./assets/krproject-benchmark.xlsx)
```
测试因子               开始时间             结束时间              运行时间（秒）   CPU%(avg) CPU%(max)
--------------------  ------------------- -------------------  -------------- --------- ---------
20w--1rule--1thread   2013-02-06-13:40:37 2013-02-06-13:40:58  21             4.6       28.6
20w--1rule--4threads  2013-02-06-14:05:47 2013-02-06-14:06:11  24             7.1       31.2
20w-10rules-1thread   2013-02-06-13:44:59 2013-02-06-13:45:45  46             11.6      26.2  
20w-10rules-4threads  2013-02-06-14:15:53 2013-02-06-14:16:16  23             13.6      71.8
50w--1rule--1thread   2013-02-06-13:47:38 2013-02-06-13:48:00  22             4.5       21.4
50w--1rule--4threads  2013-02-06-14:00:34 2013-02-06-14:01:00  26             8.1       31.1
50w-10rules-1thread   2013-02-06-13:50:54 2013-02-06-13:52:13  79             19.7      26.3
50w-10rules-4threads  2013-02-06-13:58:06 2013-02-06-13:58:28  22             13.3      70.9
```

## 结果分析

从测试报告可以分析看到：

1. 100万的交易流水基本可以在20-25秒内完成，也就是说平均TPS（transactions per second）约为4万-5万，这应该是个还不错的数字~

2. 内存流水保留大小（20w/50w），在内存足够的情况下，对性能的影响并不是很大。这主要和key的散列分布情况有关，在随机的情况下，   可以知道key的分布大致均匀，不会导致key下的list过长影响到规则与统计量的计算性能。

3. 规则及统计量数目(1rule/10rule)，直接影响到系统的运算性能，但基本属于线性关系。krproject的核心工作便是对规则及统计量的运算，规则及统计量数量的多少直接影响到系统的运算量与性能。

4. 线程池大小(1thread/4threads)，合理的线程池大小配置可大大提高系统的处理能力，这其实取决于krdb内存数据库的插入时间与krrules规则引擎的计算时间。对比50w10rules的单线程与4线程的运行时间和CPU峰值消耗可以明显看到，在规则较多、运算较复杂后采用线程池可大幅提升系统的处理能力。

## 测试总结

测试的过程中也发现了一些问题：

1. 之前在线程池实现时对于线程池队列设置了一个high-water-mark高水位，原先是当队列里内容超过此水位后，记录错误日志、放弃此笔交易，现在改为报警后仍不停尝试插入队列。这里牵扯到多线程的锁问题，我并没有做太多优化，改用无锁队列应该会有更好的效果。

2. 日志与调试信息的不规范，原先日志的记录不能很好的反应系统的处理状况，做了些调整。

当然，这次压力测试的样例和考虑因素还不够丰富和全面，后面会再补充（包括集群，复杂规则与统计量等），压力测试代码及案例，我会尽快补充道github上，欢迎大家和我一起来玩~