---
title: SQLAlchemy初见
tag:
  - Python 
  - SQLAlchemy 
  - ORM
category:
  - learning
date: 2012-12-28 19:28:51
---

[SQLAlchemy](http://www.sqlalchemy.org/ "SQLAlchemy") 读['ælkəmi]，提供了一整套Python操作数据库databases的工具集，它的构成与框架如下：

![sqla_arch_small](./learning-sqlalchemy/sqla-arch-small.png)

<!-- more -->

## 组件关系

下面就从下而上描述下各个组件及他们之间的关系：

[DBAPI](http://www.python.org/dev/peps/pep-0249/ "Python Database API Specification")定义了Python访问数据库的接口规范，不同的数据库都会根据此规范提供对应Python驱动接口，例如：Python-MYSQLdb

[Dialect](http://docs.sqlalchemy.org/en/rel_0_8/dialects/index.html "dialect")提供了SQLAlchemy与不同数据库驱动接口通信的“方言”（官方数据库包括：'drizzle','firebird','informix','mssql','mysql','postgresql','sqlite','oracle','sybase'，当然还有些非主流的数据库，比如MaxDB与access等，依然可以通过external project的方式提供支持），封装了不同数据库独有的特性，例如：mysql会自动关闭不活跃连接（默认为8个小时），通过pool_recycle选项（设置小于8小时，比如2小时：7200）便可控制重连数据库的频率，著名的mysql gone away问题便可以fix了~

[Connection pooling](http://docs.sqlalchemy.org/en/rel_0_8/core/pooling.html "connection pooling")提供了连接池功能，内存中缓存了一些连接句柄，能缓解客户端频繁与数据库建立连接的压力。

而dialect与connection pooling 功能都被整合进[Engine](http://docs.sqlalchemy.org/en/rel_0_8/core/engines.html "engine")模块了，在创建数据库连接引擎时可指定对应的数据库及数据库特性（dialect）和是否需要连接池及连接池大小等（pool）。engine与dialect、pool及DBAPI的关系参考下图：

![sqla_engine_arch](./learning-sqlalchemy/sqla-engine-arch.png)

[Schema](http://docs.sqlalchemy.org/en/rel_0_8/core/schema.html "schema")则为class定义到数据库的ddl语句提供了媒介，通过schema包里的Table、Column、ForeignKey及Sequence组件，便可轻松描述一个database。

[Types](http://docs.sqlalchemy.org/en/rel_0_8/core/types.html "Types")为不同数据库的数据类型提供更普遍一些的抽象，基本只应用在提供对表Table的列Column定义上，常见的类型有：Integer，String，Sate，DateTime。

剩下两个最主要的大块了：[SQL Expression Language](http://docs.sqlalchemy.org/en/rel_0_8/core/tutorial.html "core tutorial")与[Object Relational Mapper](http://docs.sqlalchemy.org/en/rel_0_8/orm/index.html "orm ")（ORM）了，而这两块也是SQLAlchemy对外暴露的两种访问操作方式，当然他们之间亦存在上下级关系，ORM是对SQL Expression Language更高一层的封装。

文中如此描述二者的区别与不同：

> In contrast to the ORM’s domain-centric mode of usage, the expression language provides a schema-centric usage paradigm.

[SQL Expression Language](http://docs.sqlalchemy.org/en/rel_0_8/core/tutorial.html "core tutorial")是对数据库操作尽可能简单、直观（as closely as possible）的Python封装，最大限度的统一了不同数据库的共同点，实现了数据库操作的无关性。

[Object Relational Mapper](http://docs.sqlalchemy.org/en/rel_0_8/orm/index.html "orm ")则是暴露在整个SQLAlchemy最上端的接口了，

而[ORM](http://en.wikipedia.org/wiki/Object-relational_mapping "orm")显然不是SQLAlchemy的专利，而是一种设计抽象模式，引用下中文维基里对ORM的描述：

> 对象关系映射（Object Relational Mapping，简称ORM，或O/RM，或O/R mapping），是一种程序设计技术，用于实现面向对象编程语言里不同类型系统的数据之间的转换。从效果上说，它其实是创建了一个可在编程语言里使用的“虚拟对象数据库”。面向对象是从软件工程基本原则（如耦合、聚合、封装）的基础上发展起来的，而关系数据库则是从数学理论发展而来的，两套理论存在显著的区别。为了解决这个不匹配的现象，对象关系映射技术应运而生。

很多语言都有各自有名的ORM产品，比如.NET里的ADO、java里的hibernate，SQLAlchemy则是Python里目前看来比较有名的ORM产品了！

而C语言的世界里也有一朵奇葩：[rapodbc](https://github.com/abstiger/rapodbc "rapodbc")（object得换成struct），O(∩_∩)O哈哈~，开玩笑啦~

## 个人理解

从开发角度上考虑，可以发现[SQL Expression Language](http://docs.sqlalchemy.org/en/rel_0_8/core/tutorial.html "core tutorial")更偏向于传统的开发模式，
* 优点在：类SQL方式可以想到哪儿便写到那儿、想怎么写怎么写（可以写很复杂的数据库操作语句）
* 缺点在：代码比较混乱、难维护，表结构变更带来的程序影响难以评估与修改

而[Object Relational Mapper](http://docs.sqlalchemy.org/en/rel_0_8/orm/index.html "orm ")则需要在程序开发前对数据库模型及操作关系在脑中有一个轮廓，
* 优点在：数据库模型和关系清晰，具有比较好的抽象和使用
* 缺点在：有些特殊恶心的操作可能还很难转换为模型，对数据库建模有较高要求

刚接触SQLAlchemy，这篇文章基本是阅读SQLAlchemy的[documents](http://docs.sqlalchemy.org/en/rel_0_8/ "sqlalchemy docs")后的笔记和粗线条概括，很多的概念和术语还理解的不够深刻或者有问题，错误之处，还请大家指正！
