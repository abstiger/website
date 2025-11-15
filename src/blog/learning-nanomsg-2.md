---
title: nanomsg源码阅读（二）
tag:
  - nanomsg
  - C
category:
  - learning
date: 2013-09-13 16:36:33
---

上一篇 [nanomsg源码阅读（一）](./learning-nanomsg-1) 简单介绍了下nanomsg的代码框架。这篇开始，我将深入代码细节，从基础的实用工具类开始一窥nanomsg的真面目。

<!-- more -->

## 精细类型定义：int.h

[stackoverflow](http://stackoverflow.com/questions/14515874/difference-between-int32-int-int32-t-int8-and-int8-t)上有人回答了关于int和精细类型的差异，C程序员还是推荐在知道具体长度或需要明确具体长度时用精细类型取代int。

windows下老版本的MSVC没有定义stdint.h，需要自己包装；Solaris 和 OpenVMS下定义在&lt;inttypes.h&gt;里；posix下采用&lt;stdint.h&gt;头文件。

## windows相关：win.h

包含了windows下的几个头文件，同时define了ssize_t为int
```c++
#include <windows.h>
#include <winsock2.h>
#include <mswsock.h>
#include <process.h>
#include <ws2tcpip.h>

#define ssize_t int
```

<!--more-->

## 两个常用宏定义：

### fast.h

对应linux kernel里的LIKELY和UNLIKELY，martin专门写了篇[博客](http://250bpm.com/blog:6)，说明为什么他要取名为nn_fast和nn_slow，而不用likely和unlikely，：）
```c++
#if defined __GNUC__ || defined __llvm__
#define nn_fast(x) __builtin_expect ((x), 1)
#define nn_slow(x) __builtin_expect ((x), 0)
#else
#define nn_fast(x) (x)
#define nn_slow(x) (x)
#endif
```

### cont.h

这是nanomsg对containerof的定义：
```c++
#define nn_cont(ptr, type, member) 
        (ptr ? ((type*) (((char*) ptr) - offsetof(type, member))) : NULL)
```
        
对比linux kernel里的container_of：
```c++
#define container_of(ptr, type, member) ({ 
        const typeof( ((type *)0)->member ) *__mptr = (ptr);
        (type *)( (char *)__mptr - offsetof(type,member) );})
```

是的，它去掉了第一行，而typeof正是是gcc内建的，去掉以后便达到编译器无关了，可是到底能不能去掉呢？

[stackoverflow上](http://stackoverflow.com/questions/13450292/the-definition-of-container-of-macro)有人问了我想问的问题，答案是内核版本多了编译时的类型检查，更为安全而已。

## 网路流处理：wire.h wire.c

网络协议字节序为big endian，所以也称big endian为网络字节序，即：最高字节在地址最低位，最低字节在地址最高位，一次排列，较符合人们阅读习惯。

关于字节序内容可参考wiki：http://en.wikipedia.org/wiki/Endianness

nn_gets 读取网路流中两个字节入uint16_t 结构中

nn_puts 将uint16_t 结构放入网路流中

nn_getl 读取网路流中四个字节入uint32_t 结构中

nn_putl 将uint32_t 结构放入网路流中

nn_getll 读取网路流中四个字节入uint64_t 结构中

nn_putll 将uint64_t 结构放入网路流中

## 错误处理：err.h err.c

nanomsg的错误代码完全采用posix标准的错误代码errno，这样的处理方式，让函数看起来更简洁，更易懂。


## 数据结构

### 双向链表：list.h list.c

内核版本的翻版，嵌入式链表
```c++
struct nn_list_item {
    struct nn_list_item *next;
    struct nn_list_item *prev;
};


struct nn_list {
    struct nn_list_item *first;
    struct nn_list_item *last;
};
```

### 队列：queue.h queue.c

单向链表实现
```c++
struct nn_queue_item {
    struct nn_queue_item *next;
};

struct nn_queue {
    struct nn_queue_item *head;
    struct nn_queue_item *tail;
};
```

### 哈希表：hash.h hash.c

链式冲突法，rehash采用double slots方法，hash函数也是比较简单，注释说以后可能会挑一下。
```c++
struct nn_hash_item {
    uint32_t key;
    struct nn_list_item list;
};

struct nn_hash {
    uint32_t slots;
    uint32_t items;
    struct nn_list *array;
};
```

## 时间相关

### 时钟管理：clock.h clock.c

主要采用的是rdtsc（http://en.wikipedia.org/wiki/Rdtsc）指令，如果不支持rdtsc指令，则采用nn_clock_time()函数，

在windows上采用QueryPerformanceFrequency() QueryPerformanceCounter() ；在MacOS X上采用mach_absolute_time()；

如果存在clock_gettime()函数则采用之；如果存在gethrtime()函数则采用之 ；万般无赖之下，采用gettimeofday()函数，注释是说这个函数在某些系统下会运行的比较慢。

当然，通过wiki（http://en.wikipedia.org/wiki/Rdtsc）和陈硕大牛写的一篇[《多核时代不宜再用 x86 的 RDTSC 指令测试指令周期和时间》](http://blog.csdn.net/solstice/article/details/5196544)，个人觉得martin这样的写法似乎并不准确，应该果断抛弃rdtsc！

此clock主要用在timeout的处理上！

### 休眠操作：sleep.h sleep.c

windows下调用Sleep()，否则调用nanosleep()。

### 性能统计：stopwatch.h stopwatch.c

nn_stopwatch_init 函数用在统计开始前；nn_stopwatch_term 函数用在统计结束时，返回值即为统计运行时间，以微秒（1/1000000秒）为单位

windows下采用QueryPerformanceFrequency()/QueryPerformanceCounter()；其他则采用gettimeofday()，这儿感觉似乎与clock有些重复，也许作者想要的是能以微秒为单位吧。

## 线程相关

###  全局锁：glock.h glock.c

对nanomsg库的全局锁，windows上采用CriticalSection；linux上采用mutex。用在core中！

### 互斥量：mutex.h mutex.c
```c++
struct nn_mutex {
    #ifdef NN_HAVE_WINDOWS
    CRITICAL_SECTION mutex; //windows下采用CRITICAL_SECTION封装mutex
    #else
    pthread_mutex_t mutex; //*nix下采用posix互斥量
    #endif
};
```

### 原子操作：atomic.h atomic.c
```c++
#if defined NN_HAVE_WINDOWS
#include "win.h"
#define NN_ATOMIC_WINAPI
#elif NN_HAVE_ATOMIC_SOLARIS
#include <atomic.h>
#define NN_ATOMIC_SOLARIS
#elif defined NN_HAVE_GCC_ATOMIC_BUILTINS
#define NN_ATOMIC_GCC_BUILTINS
#else
#include "mutex.h"
#define NN_ATOMIC_MUTEX
#endif

struct nn_atomic {
    #if defined NN_ATOMIC_MUTEX
    struct nn_mutex sync;
    #endif
    volatile uint32_t n;
};
```

windows和solaris下均有对应的原子操作函数；其他平台可采用gcc[内建原子操作](http://gcc.gnu.org/onlinedocs/gcc-4.3.5/gcc/Atomic-Builtins.html)：__sync_fetch_and_add()/__sync_fetch_and_sub()；否则，就需要重量级的互斥量mutex包装了。

### 信号量：sem.h sem.c

```c++
#if defined NN_HAVE_OSX

#include <pthread.h>

struct nn_sem {
    pthread_mutex_t mutex;
    pthread_cond_t cond;
    int signaled;
};

#elif defined NN_HAVE_WINDOWS

#include "win.h"

struct nn_sem {
    HANDLE h;
};

#elif defined NN_HAVE_SEMAPHORE

#include <semaphore.h>

struct nn_sem {
    sem_t sem;
};

#endif
```

即如果在MacOS X机器上将采用互斥量+条件变量实现信号量的PV操作，google了一下，发现是MacOS X只支持有名信号量而不支持无名信号量（http://lists.apple.com/archives/darwin-kernel/2005/Dec/msg00022.html）。

BTW：链接文章里提到的包装方法应该更标准：

> The first thing you should do is #include <unistd.h> and conditionalize your use of POSIX semaphores on the manifest constant _POSIX_SEMAPHORES, e.g.:

```c++
#if ((_POSIX_SEMAPHORES - 200112L) >= 0)
/* This platform fully supports POSIX semaphores */
#else
#if defined(__APPLE__)
/* This platform can support POSIX named semaphores, but not unnamed semaphores */
#else
/* this platform requires that I Google code for P/V semaphores and include it here */
#endif
#endif
```

thread.h thread.c thread_win.h thread_win.c thread_posix.h thread_posix.c ---- 线程操作

分别封装了posix的pthread和windows下的HANDLE操作，nn_thread_main_routine 作为线程操作函数的入口，内部忽略所有信号signals，再调用用户定义处理函数routine。


## 内存管理

### 内存分配器：alloc.h alloc.c

调试模式情况下，如果定义：NN_ALLOC_MONITOR，则会给实际内存增加header用于记录内存分配详细信息，
```c++
struct nn_alloc_hdr {
    size_t size;      //记录申请alloc内存大小
    const char *name; //记录申请alloc内存用途
};
static struct nn_mutex nn_alloc_sync; //分配器全局互斥量
static size_t nn_alloc_bytes;         //已分配总字节数（不包含nn_alloc_hdr）
static size_t nn_alloc_blocks;        //已分配总块数
```

实际分配内存总字节数为：nn_alloc_bytes+ nn_alloc_blocks*sizeof(struct nn_alloc_hdr)

### 内存块管理：chunk.h chunk.c
```c++
struct nn_chunk {

    /*  Number of places the chunk is referenced from. */
    struct nn_atomic refcount;

    /*  Size of the message in bytes. */
    size_t size;

    /*  Deallocation function. */
    nn_chunk_free_fn ffn;

    /*  The structure if followed by optional empty space, a 32 bit unsigned
        integer specifying the size of said empty space, a 32 bit tag and
        the message data itself. */
};
```

这儿，我对nanomsg的内存块管理不是很认同，nanomsg并没有实现自己内存的gc，所以增加refcount感觉有些多余，不知作者是不是为以后考虑。

### 内存块引用管理：chunkref.h chunkref.c
```c++
#define NN_CHUNKREF_MAX 32
struct nn_chunkref {
    uint8_t ref [NN_CHUNKREF_MAX];
};

struct nn_chunkref_chunk {
    uint8_t tag;
    void *chunk;
};
```

chunk的引用结构，这里作者做了个小小的trick，即当要分配的内存小于NN_CHUNKREF_MAX时，

直接将内容保存在struct nn_chunkref结构中，不再额外分配内存，否则struct nn_chunkref会被内部解释为struct nn_chunkref_chunk，

且tag将被设置为0xff，void *chunk就需要调用nn_chunk_alloc新分配了。

即ref[0]即为tag保存的是分配的chunk size,当chunk size大于NN_CHUNKREF_MAX时，该值会被设为0xff

## 消息管理：msg.h msg.c

```c++
struct nn_msg {

    /*  Contains SP protocol message header. */
    struct nn_chunkref hdr;

    /*  Contains application level message payload. */
    struct nn_chunkref body;
};
```
msg由header和body构成，而上面chunkref的结构基本上是为了header优化的。这儿我觉得与其这样不如直接将header固定在栈上，参考kr_message的结构设计，：）。


## 事件描述符：efd.h efd.c efd_eventfd.h efd_eventfd.c efd_pipe.h efd_pipe.c efd_socketpair.h efd_socketpair.c efd_win.h efd_win.c

提供了一种基于文件描述符file descriptors信号发送接收机制，通过nn_efd_getfd 你可以获取文件描述符，从而对其进行poll获取事件。

这样的好处在于可以拓展通信方式至线程间了，这也是nanomsg最大的特点，简单的改变参数类型即可实现不同的通信方式，进程内：inproc；进程间：ipc；网络通信：tcp。
```c++
/*  Initialise the efd object. */
int nn_efd_init (struct nn_efd *self);

/*  Uninitialise the efd object. */
void nn_efd_term (struct nn_efd *self);

/*  Get the OS file descriptor that is readable when the efd object
    is signaled. */
nn_fd nn_efd_getfd (struct nn_efd *self);

/*  Switch the object into signaled state. */
void nn_efd_signal (struct nn_efd *self);

/*  Switch the object into unsignaled state. */
void nn_efd_unsignal (struct nn_efd *self);

/*  Wait till efd object becomes signaled or when timeout (in milliseconds,
    nagative value meaning 'infinite') expires. In the former case 0 is
    returened. In the latter, -ETIMEDOUT. */
int nn_efd_wait (struct nn_efd *self, int timeout);
```

nn_efd_init和nn_efd_term是nanomsg的两个标准函数了，几乎所有对象都拥有这样两个方法。

nn_efd_getfd是用来获取内部文件描述符供poller使用，此处在介绍aio模块的worker时再细细品味。

nn_efd_signal和nn_efd_unsignal，顾名思义，即是将efd置于信号触发和未触发状态。

nn_efd_wait是自己对nn_efd_getfd获取的fd进行poll（提供poll函数的采用poll()否则如果在windows下调用select()），

即在未提供poller的情况下，自己实现的事件轮询机制，此处在core的sock.c中使用，介绍core时再做说明。

因为eventfd在linux内核2.6.22后才被引入，因此efd的实现分别通过eventfd,pipe,socketpair，以及windows上的SOCKET模拟实现，开销当然依次递增。


## 写在最后

实用工具类utils阅读到此，下一篇让我们看看aio的详细实现，这里martin引入了基于事件的状态机，取代常见事件处理的回调callback机制，

为什么这么做呢？具体又是如何实现的呢？敬请期待！

PS：代码阅读过程中，肯定会有误解或者理解不正确的地方，欢迎大家批评指正与讨论，谢谢~