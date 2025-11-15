---
order: 4
title: krproject开发进展（四）
article: false
date: 2012-10-20 15:43:32
---

很久没有写博客了，国庆结束后将代码简单整理了一下，放到[github](https://github.com/abstiger/krproject "krproject")上了，其实犹豫了很久，一方面我还是知道自己coding水平的，写的鸟代码可能会被人鄙视；另一方面，对于一个追求完美的人来说，这个版本确实还是太粗糙了。whatever……，我还是觉得有必要厚着脸皮将这第一步迈出去~

目前为止这个项目还是纯代码，并没有多少的文字介绍，花了一些时间整理了一个项目介绍的ppt：[krproject-introduction](./assets/krproject-introduction.pptx)

从上一篇 [krproject-develop-trace-3](./krproject-develop-trace-3) 到现在已经有四个多月的时间了，其实这中间真正用来折腾krproject的时间并不是很多，不过还是做了些事情的:

## rapodbc

前段时间想要给krproject增加数据库支持，主要是指mysql和sqlite，并考虑用sqlite3作为krproject的默认数据库引擎，一方面想方便试玩，另一方面会觉得这两个的适用场景可能更广泛些~

可是之前的数据库操作层是对嵌入式SQL（[Embedded SQL](http://en.wikipedia.org/wiki/Embedded_SQL "Embedded SQL")）的一层包装：写数据库操作语句sql，gensql工具程序自动生成对应数据库操作的ESQL代码，再通过数据库提供的预编译工具将ESQL代码转化为c代码。一些主流的商业数据库管理系统像oracle、db2都有提供对应的预编译工具，而mysql和sqlite则不提供ESQL的支持。关于ESQL和ODBC的区别和对比，在上面的wiki链接里有更详细些的描述。

于是很自然的联想到更底层、更宽泛一点的标准：[odbc](http://en.wikipedia.org/wiki/Odbc "wiki:odbc")，以前在学校的时候倒是被老师教过如何在windows里配置odbc数据源，那unix下也有对应的driver manger：[unixODBC](http://www.unixodbc.org/ "unixODBC") 和 [iodbc](http://www.iodbc.org "iodbc")，有很多的linux发行版都带了unixODBC包，或者有提供对应安装rpm或deb包，所以我就很快选择unixODBC了，也没有详细对比这两个区别了，想要深度了解的同学可以顺着链接进去看下，这里就不展开了~另外不得不说，[msdn](http://msdn.microsoft.com/en-us/library/ms710252(v=vs.85).aspx "msdn:odbc")上的odbc文档还是相当不错的！

然后便花了点时间写了个小工具：[rapodbc](https://github.com/abstiger/rapodbc "rapodbc")（rap其实是取wrapper的谐音啦，你非要理解成rap也可以啦，哈哈~）

它的主要功能是对odbc操作做个封装，开发人员只要写sql，它就能将sql转化成对应的odbc操作C函数，然后依靠odbc的标准化和对应dbms的odbc driver便可以实现操作的数据库无关性~

比如，你有这样一张表：
```sql
create table KR_TBL_SET_CFG
(
   SET_ID               INTEGER                not null,
   ELEMENT_VALUE        VARCHAR(200)           not null,
   ELEMENT_DESC         VARCHAR(200)           not null,
   constraint P_PK_TBL_SET_ELEME primary key (SET_ID, ELEMENT_VALUE)
);
```

和一个类似这样的sql操作配置文件（t_dbs202_set_cfg_cur.cfg）：
```sql
select
A.ELEMENT_VALUE,
A.ELEMENT_DESC
from
kr_tbl_set_cfg A
where
A.SET_ID=:SET_ID#long#
```

运行 rapodbc （rapodbc t_dbs202_set_cfg_cur）后，便会得到这样两个文件：
```bash
-rwxrwxrwx 1 root root  811 11月  2 12:51 set_cfg_cur.h*
-rwxrwxrwx 1 root root 2411 11月  2 12:51 t_dbs202_set_cfg_cur.c*
```

头文件和c文件中便包含了SQL想要完成的相关操作：
```bash
#ifndef __SetCfgCur_H__
#define __SetCfgCur_H__
typedef struct 
{
    long        lInSetId;
    char        caOutElementValue[200+1];
    char        caOutElementDesc[200+1];
}T_SetCfgCur;

int dbsSetCfgCur(T_DbsEnv *dbsenv, int iFuncCode, T_SetCfgCur *ptSetCfgCur);
void dbsSetCfgCurInit(T_SetCfgCur *ptSetCfgCur);
#endif
```

> TIPS:SQL配置文件名的后四位决定生成的sql操作类型（_cur:cursor; _sel:select; _upd:update; _ins:insert; _del:delete）

最新的unixODBC版本是2011年11月28号发布的2.3.1，而我的unixodbc版本则是在ubuntu里直接apt-get拿到的：
```bash
/home/tiger/Share/git/rapodbc>isql --version
unixODBC 2.2.14
```

对应的sqlite的odbc driver则是在[这里](http://www.ch-werner.de/sqliteodbc/ "sqlite odbc driver")下的安装包，自己编译安装的，版本为0.98
```bash
/usr/local/lib>l *sqlite*
-rwxr-xr-x 1 root root 434449 10月 26 09:19 libsqlite3odbc.so*
-rwxr-xr-x 1 root root 434449 10月 26 09:19 libsqlite3odbc-0.98.so*
-rwxr-xr-x 1 root root    897 10月 26 09:19 libsqlite3odbc.la*
-rw-r--r-- 1 root root 594430 10月 26 09:19 libsqlite3odbc.a
```

我的odbcinst.ini配置如下：
```bash
/etc>cat odbcinst.ini
[DB2]
Description		= DB2 ODBC Driver
Driver		    = /opt/ibm/db2/V9.7/lib64/libdb2.so
DontDLCLose		= 1
Threading		= 2
FileUsage		= 1

[SQLite3]
Description     = SQLite3 ODBC Driver
Driver          = /usr/local/lib/libsqlite3odbc.so
Setup           = /usr/local/lib/libsqlite3odbc.so
Threading       = 2
```

odbc.ini配置如下：

```bash
/home/tiger>cat .odbc.ini
[aicdb]
Description = DB2 datasource aicdb
Driver = DB2

[mysqlite3db]
Description = My SQLite test database
Driver = SQLite3
Database = /home/tiger/mysqlite3.db
# optional lock timeout in milliseconds
Timeout = 2000
```

因为这一块相对独立，而且个人觉得也还蛮有用的，便将代码已经放到[github](https://github.com/abstiger/rapodbc "rapodbc")上作为独立工具项目开源了

## 回顾一下

-  增加历史统计量LRU缓存功能，krproject的大部分统计运算是基于内存存储krdb的，而对于行为习惯等时间跨度较长的统计量、特征值则需要从数据库中获取，为了减少数据库的操作次数，会对这些数据做缓存，缓存的大小可配置；
-  为了提供接口，将引擎封装到krengine中，对外部仅暴露三个主要接口函数：kr_engine_startup()，kr_engine_run()，kr_engine_shutdown()；
-  编写了Python的接口，结合pika库实现了和rabbitmq通信的功能；
-  增加了动态库加载功能（kr_module,只是简单包装了posix的dl功能），将krdb的接口转换纳入模块加载中，用户可自己编写接口数据到krdb内存的转换模块了。

## 后续计划

- 压力测试，这个也许是当前最要紧的了，想尽快补充引擎的benchmark图，虽然对引擎的性能很有信心，但是没有实践没有发言权；
- tutorial及样例的编写，学着写文档；
- 增加数据库的支持，目前只支持db2和oracle，考虑增加mysql和sqlite的支持，并考虑将sqlite3做为默认数据库支持，方便试玩；
- 处理的应答回调函数处理模块设计编写；
- 规则及统计量的配置界面（考虑用Python实现，这块感觉自己一个人还是够呛，没有前台开发经验……）。
