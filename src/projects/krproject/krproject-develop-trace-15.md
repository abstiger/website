---
order: 15
title: krproject开发进展（十五）
article: false
date: 2015-05-01 08:48:12
---

转眼距离上次博客已经快一年了-_- !，虽然krproject的开发时断时续、进展不多，但为了不让这里长草太深，还是想写点文字记录下这一年有关krproject的设计和开发情况吧，也算是对思考的一个整理和记录吧！

回归krproject的定位：基于大数据量的实时流数据分析系统，它由如下几个部分组成：

-   **krengine：** 核心数据分析引擎，基于规则的带流程控制的处理模块，以动态库发布；
-   **krserver：** 引擎服务器，是对krengine的包装，以tcp为传输层、自定义的协议层，以可执行程序发布；
-   **krcoordi：** krserver的集群协调器，基于一致性hash算法的集群调度器，以可执行程序发布
-   **krshell：** krserver的命令行终端，与krserver交互的终端管理程序，以可执行程序发布
-   **krweb：** web管理前端，提供对引擎的输入输出数据源定义、数据项、规则的管理，以web资源发布

## krweb

先前花了点时间将这个krrule规则编辑器完善了下，完全以jquery插件的方式开发，效果图如下：

![krrule_demo](./assets/krproject-rule-demo.png)

同时初步调研了下流程编辑器，最终选择基于goJS搭了个草图，遗憾的是它的免费版有水印，效果如下（这个后续考虑换成[bpmn.io](http://bpmn.io)）：

![krflow_demo](./assets/krproject-flow-demo.png)

## kriface

接口处理工具，根据配置的输入输出接口生成不同格式的接口描述文件以及服务端处理程序，以可执行程序发布

走过一些弯路后还是决定将krengine定义为krproject的核心，而在之前是考虑过以krserver方式发布，后来发现那样需要krserver造很多的轮子以满足支持不同通讯方式及协议的要求，尝试独立出krchannel模块，写着写着就发现又是一个rpc框架了，而这方面[thrift](https://thrift.apache.org/)俨然已经做得很好，最近好像google又出了个[grpc](https://github.com/grpc/grpc)……，索性只提供一个简单的以tcp为传输层、自定义协议的简单服务包装krserver，协议的适配交由外部程序处理。

## krflow

流程处理引擎，解析web端的bpmn的modeler，实现一个小的可视化流程处理引擎

这部分内容还在犹豫中，一方面规则引擎与流程引擎几乎是所有业务系统的标配，另一方面感觉这样相当于又创建了一门web编程语言，引入了巨大的复杂度。目前还处在调研阶段！

记录一下给自己留个档，怕时间太长忘了当初所想~
