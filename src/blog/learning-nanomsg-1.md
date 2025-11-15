---
title: nanomsg源码阅读（一）
tag:
  - nanomsg
  - C
category:
  - learning
date: 2013-09-05 11:58:53
---

[nanomsg](http://nanomsg.org/ "nanomsg")是[zeromq](http://zeromq.org/ "zeromq")作者Martin Sustrik用C重写的一套具有可扩展协议的一套通信框架，具体nanomsg与zeromq的不同与改进之处及为什么要用C重写在[这里](http://nanomsg.org/documentation-zeromq.html "ifferences between nanomsg and ZeroMQ")有详细的描述，个人感觉C的代码风格和目录结构组织都看着舒服多了，：），另外Martin Sustrik博客（[http://250bpm.com/](http://250bpm.com/) ）里面的每篇文章感觉都挺不错的，推荐关注订阅！

<!-- more -->

## 框架简介

因为nanomsg还处于开发测试阶段，代码量还不是十分庞大，文档和注释也不够全面，于是想通过这一系列博客，一方面记录下我对nanomsg当前源码（[https://github.com/250bpm/nanomsg](https://github.com/250bpm/nanomsg)）的阅读过程，同时也学习下一个好的开源项目的代码组织及开发过程。

## 源码组织

首先看下nanomsg的src目录：

```c++
nn.h*                 // nanomsg对外暴露的接口api
transport.h*          // 通信层定义，，目的应该是想暴露给用户以实现可扩展，但目前还包含utils下头文件……
inproc.h*             // 一种transport，安装到include/nanomsg下
ipc.h*                // 一种transport，安装到include/nanomsg下
tcp.h*                // 一种transport，安装到include/nanomsg下
protocol.h*           // 协议层定义，目的应该是想暴露给用户以实现可扩展，但目前还包含utils下头文件……
reqrep.h*             // 一种protocol，安装到include/nanomsg下
pubsub.h*             // 一种protocol，安装到include/nanomsg下
bus.h*                // 一种protocol，安装到include/nanomsg下
pair.h*               // 一种protocol，安装到include/nanomsg下
pipeline.h*           // 一种protocol，安装到include/nanomsg下
survey.h*             // 一种protocol，安装到include/nanomsg下
utils/                // 实用工具包，包含基本数据结构（list，queue，hash）互斥及原子操作（mutex，atomic）等
transports/           // 通信层实现，包括（inproc:进程内通信；ipc:进程间通信；tcp：tcp通信）
protocols/            // 协议层实现，包括（REQ/REP:请求/应答；PUB/SUB:发布订阅等.）
core/                 // generic code，glue between the pieces
aio/                  // 线程池模拟的异步操作，带状态机的事件驱动
CMakeLists.txt*       // cmake编译文件
pkgconfig.in*         // pkconfig工具配置文件
README*               // readme
```

其中nanomsg对外暴露的接口api定义在nn.h中：

```c++
NN_EXPORT int nn_socket (int domain, int protocol);
NN_EXPORT int nn_close (int s);
NN_EXPORT int nn_setsockopt (int s, int level, int option, 
                             const void *optval, size_t optvallen);
NN_EXPORT int nn_getsockopt (int s, int level, int option, 
                             void *optval, size_t *optvallen);
NN_EXPORT int nn_bind (int s, const char *addr);
NN_EXPORT int nn_connect (int s, const char *addr);
NN_EXPORT int nn_shutdown (int s, int how);
NN_EXPORT int nn_send (int s, const void *buf, size_t len, int flags);
NN_EXPORT int nn_recv (int s, void *buf, size_t len, int flags);
NN_EXPORT int nn_sendmsg (int s, const struct nn_msghdr *msghdr, int flags);
NN_EXPORT int nn_recvmsg (int s, struct nn_msghdr *msghdr, int flags);
NN_EXPORT int nn_device (int s1, int s2);
```

熟悉posix socket接口api的人应该对这些接口不陌生（除了后面三个函数，以后会介绍）， 所以一个简单的服务端应答程序大致是这样的：

```c++
char buf[10];
int s = nn_socket(AF_SP, NN_REP);
nn_bind(s, "tcp://*:5555");
nn_recv(s, buf, 10, 0);
nn_send(s, "World", 5, 0);
nn_close(s);
```
对应的客户端请求程序大致为：

```c++
char buf[10];
int s = nn_socket(AF_SP, NN_REQ);
nn_connect(s, "tcp://localhost:5555");
nn_send(s, "Hello", 5, 0);
nn_recv(s, buf, 10, 0);
printf("Hello %sn", buf);
nn_close(s);
```

## 原理背景

[The C10K problem](http://www.kegel.com/c10k.html "The C10K Problem")提出后，不仅给web服务器的代码设计开发提供了思路，也给整个网络通信的架构提出了建议和意见，于是各种eventloop层出不穷（libevent/libev/libuv/redis的ae/nginx的event等等，这样的说法可能不正确，这些代码的出现应该是伴随着C10K问题完善的）。

[《UNIX网络编程》](http://book.douban.com/subject/1500149/ "UNIX网络编程")将IO模型分为五类：阻塞式IO/非阻塞式IO/IO多路复用/信号驱动式IO/异步IO（参考：[《Unix系统的IO模型》](http://shenxueliang.iteye.com/blog/1677194)），而IO的多路分离及异步非阻塞这样的通信模型几乎集成在目前所有的高性能服务端程序框架中。

### 关于IO的多路分离

IO的多路分离器有select,poll,dev/poll,epoll,kqueue等，网络上已经有很多对他们的对比和解释，此处不再赘述了。

值得关注的是，从陈硕大牛的这篇[《Linux 新增系统调用的启示》](http://www.cnblogs.com/Solstice/archive/2010/02/26/linux_new_syscalls.html)中可以发现linux kernel引入了timerfd,signalfd,eventfd后，带来的好处在于我不需要再自己维护一个timer结构（list或者rbtree）便可处理timeout事件了，不需要makepipe便可处理signal事件了，而eventfd不仅提供一种线程间通信方式，实际上也为用户级事件提供了接口（实际上nanomsg正是用它来处理task的）。这样我们在linux上实现一个eventloop要容易很多，通过接口创建对应事件的fd后加入到epoll池中即可，当然需要注意的是可能要设置最大打开句柄数（ulimit -n，默认的1024可能不一定够用）。

### 关于非阻塞

在创建文件描述符fd时，增加相应NONBLOCK标志（很多系统调用均支持额外的flags参数，比如：accept4，eventfd2，pipe2等，也可通过fcntl事后设置O_NONBLOCK），即为非阻塞了：

而在读写时，都需要对read或write包上一层while：

do {

    read()/write()

} while(errno == EAGAIN  ||errno == EWOULDBLOCK || errno == EINTR);

### 关于异步IO

目前应该是有两类异步IO的实现方式：

一种是线程池模拟（glibc的aio：[http://www.ibm.com/developerworks/linux/library/l-async/](http://www.ibm.com/developerworks/linux/library/l-async/) ；libev作者写的libeio：[http://software.schmorp.de/pkg/libeio.html](http://software.schmorp.de/pkg/libeio.html) ；而libuv则是自己将线程池的实现集成到自己内部threadpool.c，然后将对文件系统的操作以及getaddrinfo()包裹于其上，实现了其文件操作及getaddrinfo()的异步化）；

另一种则是linux在2.6.22版本后自带的[native aio](http://lse.sourceforge.net/io/aio.html)（nginx则是真正利用linux native aio（syscall方式）实现的异步IO；参考：[http://www.pagefault.info/?p=76](http://www.pagefault.info/?p=76)）

### 参考资料

以下是几位大牛的文章，我觉得都挺不错的：

1.  [Unix系统的IO模型](http://shenxueliang.iteye.com/blog/1677194)
2.  [Linux下异步IO(libaio)的使用以及性能](http://blog.yufeng.info/archives/741)
3.  [nginx 0.8.x稳定版对linux aio的支持](http://www.pagefault.info/?p=76)
4.  [Linux 新增系统调用的启示](http://www.cnblogs.com/Solstice/archive/2010/02/26/linux_new_syscalls.html)

## 敬请期待

对nanomsg接口及代码框架了解后，不妨让我们深入下细节，探探究竟。

下一篇文章将深入实用工具类包utils内部，看看nanomsg都需要哪些基础功能？以及如何包装的？

敬请期待~
