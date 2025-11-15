---
order: 14
title: krproject开发进展（十四）
article: false
date: 2014-04-19 17:45:11
---

这段时间在给krproject写interface generation，因为krproject的接口是通过数据库表描述的（数据源定义表kr_tbl_datasrc，数据源域定义表kr_tbl_datasrc_field，数据源索引定义表kr_tbl_datasrc_index）。

当初这样设计的考虑是是：一方面对于前台，可以简单方便通过页面的配置接口、以及规则及其他配置时对接口字段的直接引用；另一方面对于后台，程序通过域序号的方式获取该接口某字段的名称、类型及值（目前通过数组实现，要求配置时序号要与数组下标一致，换成哈希表就不会有此限制了，甚至可以通过字段名来访问该域了，但也多了个hash查找的时间）；

当我前段时间在写krclient的时，我发现原来这两张表实际就是一种简单的不带服务接口，暂时没有复杂数据类型的[IDL](http://en.wikipedia.org/wiki/Interface_description_language "idl")（Interface description language，接口描述语言），那它带来的好处就在于我可以通过写个小工具，根据接口定义，可生成固定长度的C struct接口文件；生成格式灵活一些的json或者xml样例文件；生成不同序列化框架的描述文件（比如：google protobuf的.proto文件、apache thrift的.thrift文件、apache avro的.avsc文件）。

于是我便花了些时间学习了下一些主流的序列化框架，接下来就谈谈我对于接口interface、远端过程调用RPC及序列化serialization的一些理解：

计算机的接口[interface](http://en.wikipedia.org/wiki/Interface_(computing) "interface")的定义其实很广泛，wiki上的解释是这样的：

> In computer science, an interface is a shared boundary across which two separate components of a computer system exchange information. The exchange can be between software, computer hardware, peripheral devices, humans and combinations of these. Some computer hardware devices such as a touchscreen can send and receive data through the interface, while others such as a mouse, microphone or joystick are one way only.

一句话总结就是：软件接口是用于两个模块间交互的共享数据边界，它提供：常量定义，数据类型及结构定义，方法描述及异常指定。

在同一个进程中，接口可以很容易的理解或处理为两个函数间的参数传递，接口的定义即为函数参数的设计与定义。而如果将问题延伸至进程间通讯（inter-process  communication），不同进程间、不同机器间、甚至不同机器不同编程语言间的消息通讯，这也就是现在所说的分布式开发中最基础的功能了，[RPC](http://en.wikipedia.org/wiki/Remote_procedure_call "RPC")（远程过程调用Remote Procedure Call）由此诞生。

依然摘自wiki上的解释：

> In computer science, a remote procedure call (RPC) is an inter-process communication that allows a computer program to cause a subroutine or procedure to execute in another address space (commonly on another computer on a shared network) without the programmer explicitly coding the details for this remote interaction. That is, the programmer writes essentially the same code whether the subroutine is local to the executing program, or remote. When the software in question uses object-oriented principles, RPC is called remote invocation or remote method invocation.

RPC的一般过程如下：

1. The client calls the client [stub](http://en.wikipedia.org/wiki/Stub_(distributed_computing) "Stub (distributed computing)"). The call is a local procedure call, with parameters pushed on to the stack in the normal way.

2. The [client stub](http://en.wikipedia.org/wiki/Class_stub "Class stub") packs the parameters into a message and makes a system call to send the message. Packing the parameters is called [marshalling](http://en.wikipedia.org/wiki/Marshalling_(computer_science) "Marshalling (computer science)").

3. The client's local [operating system](http://en.wikipedia.org/wiki/Operating_system "Operating system") sends the message from the client machine to the server machine.

4. The local [operating system](http://en.wikipedia.org/wiki/Operating_system "Operating system") on the server machine passes the incoming packets to the [server stub](http://en.wikipedia.org/wiki/Class_skeleton "Class skeleton").

5. The server stub unpacks the parameters from the message. Unpacking the parameters is called [unmarshalling](http://en.wikipedia.org/wiki/Unmarshalling "Unmarshalling").

6. Finally, the server stub calls the server procedure. The reply traces the same steps in the reverse direction.

进程间通讯的方式有很多：基于管道、信号、消息队列、共享内存、信号量、套接字等，考虑到通用性，一般远程过程调用都是基于套接字的tcp/ip方式，在wiki上可以找到很多RPC的定义与实现，如XML-RPC，JSON-RPC他们都叫XXX-RPC，他们共同的点是在通讯实现，不同的是具体的协议及数据格式，也即在上面RPC的过程列表中的第二步和第五步（对参数的marshalling和unmarshalling）方式不同。

这里的marshalling与unmarshalling包含了我们常说的序列化serialization与反序列化unserialization，关于序列化[serialization](http://en.wikipedia.org/wiki/Serialization "serialization")的定义，继续参考wiki的解释：
> In computer science, in the context of data storage, serialization is the process of translating data structures or object state into a format that can be stored (for example, in a file or memory buffer, or transmitted across a network connection link) and reconstructed later in the same or another computer environment.

有很多序列化的格式和框架，如文章一开头提到的XML、JSON、protobuf、thrift、avro等，关于他们之间的优劣与长短处，此处不再细述，推荐一篇slide：[pb-vs-thrift-vs-avro](http://www.slideshare.net/IgorAnishchenko/pb-vs-thrift-vs-avro)

还有人做了各种基于jvm的序列化工具的比较：[jvm-serializers](https://github.com/eishay/jvm-serializers/wiki)

这段时间也试玩了下序列化工具，等krproject的interface generation写完，我会再写篇博客记录下各个序列化框架的使用感受~
