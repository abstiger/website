---
title: HyperDex浅析之hyperspacehashing
tag:
  - HyperDex
  - hyperspacehashing
  - NoSQL
category:
  - learning
date: 2012-03-01 18:35:42
---

前段时间在微博上看到有人介绍这个[HyperDex](http://hyperdex.org/ "hyperdex")，与现在普遍的key-value存储稍有些不同的是：它不仅支持按key的查找，还支持按value里的一个或多个属性值来查找。有人说这就是“DB搜索化，搜索DB化”，还没完全理解这句话的含义，不过这确实给人耳目一新的感觉。

<!-- more -->

## 项目简介

最吸引人眼球的的一条消息就是HyperDex与Redis的benchmark对比，各方面都领先，查询的速度更是Redis的14倍……，随后有人在redis的论坛里发了[HyperDex vs Redis](http://groups.google.com/group/redis-db/browse_thread/thread/378a32de50a782c5# "HyperDex vs Redis")的贴，antirez对那个性能测试的结果提了些想法，提出会在2.6 RC1后尝试引入多线程入redis，并且表示 “I see very well such a project.”，哈哈~

整个代码功能上大致分四块：
1.  核心算法hyperspacehashing；
2.  客户端模块hyperclient；
3.  负责zone分配（针对客户端操作请求）和管理（针对服务端节点变化）的协调器hypercoordinator（python实现）；
4.  服务端模块hyperdemon、hyperdex、hyperdisk（还没有细看，可能划分的有些问题，姑且先放在一起）。

## 源码阅读

稍微详细地看了下hyperspacehashing的介绍和源码，做下记录：

### 理论分析

目前大部分的key-value存储在遇到非key查找，按value中的某个属性attribute查找时，基本是采取遍历scan的方式，这是key-value存储系统极力避免的事情，但是随着业务需求的发展，这个似乎不可避免；

传统的关系型数据库如果需要在非索引字段上查找的话，第一反应就是给该字段加上索引（广告一下：krdb就是参考了这个方法，实际上就是再以查找字段为key建立一个新的动态hashtable），可如果我的查询是所有字段的排列组合呢？我们不可能为每一种排列组合建立一个索引。

hyperspacehashing提供了一种方案：对对象或记录中所有可能需要查找的属性attribute字段进行hash，每一个属性字段对应空间中的一个维度dimension，hash值即为该维度上的坐标值，再对计算好的各个维度上的hash值混合加工（interlace）成一个凝聚值（conglomerate hash），而这个值便是这个对象或记录在整个由属性值构成的N维空间中的坐标点（coordinate point）。这样所有的对象都以坐标点形式都被散列分布在这个N维空间中了。

那一个指定一个或多个属性字段的精确或范围查找（search），具体又是如何执行的呢？

HyperDex将这样的一个属性字段排列组合的查询同样映射到一个对应的查询平面（文中称为hyperplane，不知道这样翻译是否合理，实际上在一个三维空间里，如果指定一个维度查询，那是一个平面；而如果指定两个维度，便是一条直线了；而如果指定三个精确维度，那便唯一确定一点了），HyperDex再从这个平面划过的区域（region）里匹配满足条件的一个个点对象。具体这个匹配满足的过程是先看这个对象的坐标是否与查询平面相交，再逐个判断key和value是否相等。这个与链式冲突法的先hash定位，再在链中逐个精确比较异曲同工。

### 代码实现

具体代码实现时，用了两种对象坐标表示方法：

* 一种是prefix（Hash-calculating objects that work for the replication layer.）；
* 一种是mask（Hash-calculating objects that work for the disk layer.）。

此处请先不要问我为什么要这么做……

#### prefix.h,prefix.cc

下面是prefix类中坐标coordinate类里的数据成员：
```c++
    uint8_t prefix; /*维度数，对一个全属性字段对象而言实际上这个值都是N*/
    uint64_t point; /*这个便是上面提到的N维空间坐标值了*/
```

下面这个判断是否相交的函数揭示了上面两个类成员的具体含义：
```c++
bool
hyperspacehashing :: prefix :: coordinate :: intersects(const coordinate& other) const
{
    uint64_t mask = lookup_msb_mask[std::min(prefix, other.prefix)];
    return (mask & point) == (mask & other.point);
}
```

首先取两个坐标的最小维度值（公共的维度），通过常量数组lookup_msb_mask[]（从高位到低位依次变1，由64个0到64个1），完成prefix维度数到64位维度的横向描述mask，而将point值与此mask做“与”操作，得到坐标在维度上的坐标值（因为再hash的原因，实际这里仅能通过0/1粗略表示是否存在该维度坐标）,如果两个坐标公共的维度坐标相等，则他们相交。
有点抽象，三维空间里举例如下：平面x=5与点x=4,y=2,z=1不相交，因为在他们的公共维度x上5！=4,；同样平面x=5与y=3,z=4的直线相交，因为他们不存在公共的维度，即都为0。
这里还定义了查询坐标子类search_coordinate。 

#### mask.h,mask.cc
下面是mask类中坐标coordinate类里的数据成员：
```c++
    /*primary与key对应*/
    uint64_t primary_mask;
    uint64_t primary_hash;
    /*secondary与value对应*/
    uint64_t secondary_lower_mask;
    uint64_t secondary_lower_hash;
    uint64_t secondary_upper_mask;
    uint64_t secondary_upper_hash;
```
为了继续保持key-value存储对key查找的高效性，HyperDex将key和value分开，便有了这儿对应key的primary_hash和对应value的secondary_hash，其他方法与上类似。

#### range_match.h,rang_match.cc
提供构成prefix类的查询坐标子类search_coordinate主要方法match()的范围匹配类range_match。

#### search.h，search.cc
上面两种坐标体系的intersects()方法，都只是起到了数据查找的初步过滤，还需要精确的实际值比较，search类做的便是这个精确的值比较，被search类match()上的就是真正查找要返回的对象了。

#### hashes.h,hashes.cc,cfloat.h,cfloat.cc
默认提供两种hash算法：精确等于匹配时采用google的CityHash64()，需要范围匹配时的cfloat()和cfloat_range()，这里的范围匹配字段只支持64位存储以下的数字属性字段。

#### bithacks.h
这里不仅提供了lookup_msb_mask常量数组，还提供了用来对各维度上的hash值再hash的interlace相关函数,prefix坐标体系里用的upper_interlace()，mask坐标体系里用的是double_lower_interlace()。

## 总结

感觉这个东东真的还蛮厉害的，至少给拓宽了nosql的视野，期待它的实际应用！不过有很多的第三方依赖，实地编译安装起来感觉不是很方便。

本来还打算实地操作感受一下的，可是现在还没有提供ubuntu的二进制安装包，尝试源码编译，可是卡在了它libe依赖包上了，竟然要求必须是x86_64……，自作聪明的暴力注掉后，atomic_op.h编译报错……，难道只能运行在64位机上？

后面尝试将region，node，zone，space，subspace之间的关系梳理清楚，还有那个value-dependent chaining的replication技术，看介绍似乎是有用version做控制的乐观锁方式。

比较粗线条的一个介绍，很多的概念和代码细节自己都还没有完全理解，错误之处，还请指正。

