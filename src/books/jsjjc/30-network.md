---
order: 30
title: 网络连接
author: abstiger
article: false
---

# 网络连接

计算机网络是现代信息技术的核心基础设施，它实现了计算机之间的互联互通。

## 网络分层模型

### OSI七层模型
1. 物理层：比特流传输
2. 数据链路层：帧传输和差错控制
3. 网络层：路由选择和分组转发
4. 传输层：端到端连接和可靠传输
5. 会话层：会话管理和同步
6. 表示层：数据格式转换和加密
7. 应用层：应用程序接口和服务

### TCP/IP四层模型
1. 网络接口层：对应OSI的物理层和数据链路层
2. 网络层：IP协议
3. 传输层：TCP和UDP协议
4. 应用层：HTTP、FTP、SMTP等协议

## 核心网络协议

### TCP/IP协议族
- IP（网际协议）
  - IPv4：32位地址
  - IPv6：128位地址
  - 子网划分
  - 路由选择

- TCP（传输控制协议）
  - 面向连接
  - 可靠传输
  - 流量控制
  - 拥塞控制

- UDP（用户数据报协议）
  - 无连接
  - 不可靠传输
  - 高效传输

### 应用层协议
- HTTP/HTTPS
  - HTTP/1.1：持久连接
  - HTTP/2：多路复用
  - HTTP/3：基于QUIC
  - HTTPS：安全传输

- WebSocket
  - 全双工通信
  - 实时数据传输

- gRPC
  - 高性能RPC框架
  - 基于HTTP/2

## 网络硬件设备

### 传输介质
- 双绞线：常用网线
- 光纤：高速长距离传输
- 无线：WiFi、5G等

### 网络设备
- 交换机：数据链路层设备
- 路由器：网络层设备
- 防火墙：网络安全设备

## 网络安全

### 安全协议
- SSL/TLS：安全传输层
- SSH：安全shell
- IPSec：网络层安全

### 安全机制
- 加密技术
- 身份认证
- 访问控制
- 入侵检测

## 现代网络技术

### 云计算网络
- 虚拟网络
- SDN（软件定义网络）
- NFV（网络功能虚拟化）

### 边缘计算
- CDN（内容分发网络）
- Edge Computing
- 5G网络

## 参考资料

- 计算机网络基础知识总结 https://www.cnblogs.com/cxuanBlog/p/16168310.html
- 以太网与 TCP/IP https://deerchao.cn/blog/posts/network.html
- 网络分层概述 https://segmentfault.com/a/1190000008741770
- Linux网络 - 数据包的接收过程 https://segmentfault.com/a/1190000008836467
- Linux网络 - 数据包的发送过程 https://segmentfault.com/a/1190000008926093
- 网线知识科普+选购指南 https://post.smzdm.com/p/aqm8vevk/
- 关于光纤宽带技术，看这一篇就够啦！ https://zhuanlan.zhihu.com/p/40011697
- 网络协议总结 https://www.jianshu.com/p/02bd37c689c5
- WebSocket协议：5分钟从入门到精通 https://www.cnblogs.com/chyingp/p/websocket-deep-in.html
- SSL/TLS协议解析 https://www.jianshu.com/p/355cee44268e
- HTTP2协议解析 https://www.jianshu.com/p/42ca44202ca4
- 深入理解HTTP/3协议 https://www.51cto.com/article/713935.html
- 深入了解 gRPC 协议 https://cn.pingcap.com/blog/grpc
