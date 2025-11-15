---
order: 12
title: 体系结构-存储
author: abstiger
article: false
---

# 体系结构-存储

计算机存储系统是计算机体系结构中的重要组成部分，主要分为内部存储器（内存）和外部存储器（外存）。

## 内部存储器（内存）

### RAM（随机访问存储器）
- DRAM（动态随机访问存储器）
  - 需要定期刷新
  - 主要用作主内存
  - 容量大，价格相对便宜
- SRAM（静态随机访问存储器）
  - 不需要刷新
  - 主要用作高速缓存
  - 速度快，成本高

### ROM（只读存储器）
- BIOS/UEFI固件
- 引导程序
- 固件更新

## 外部存储器（外存）

### 机械硬盘（HDD）
- 工作原理：磁头读写
- 特点：
  - 大容量
  - 价格便宜
  - 读写速度较慢
  - 易受物理震动影响

### 固态硬盘（SSD）
- 接口类型：
  - SATA：传统接口，速度上限600MB/s
  - M.2：新型接口，支持SATA和PCIe协议
  - PCIe/NVMe：高速接口，速度可达数GB/s
- 特点：
  - 无机械部件
  - 读写速度快
  - 能耗低
  - 价格相对较高

### 存储介质
- U盘：便携式闪存设备
- SD卡：主要用于移动设备
- 光盘：CD/DVD/Blu-ray

## 文件系统

### Windows文件系统
- FAT32：兼容性好，单文件最大4GB
- NTFS：支持权限控制，文件加密
- exFAT：适用于大容量存储设备

### Linux文件系统
- ext4：Linux默认文件系统
- XFS：适用于大文件存储
- Btrfs：新一代文件系统，支持快照

### macOS文件系统
- APFS：针对SSD优化
- HFS+：较早的Mac文件系统

## 存储技术发展趋势

- NVMe存储技术
- 3D NAND闪存
- 新型存储技术（如QLC）
- 分布式存储系统
- 云存储技术

## 参考资料

- 磁盘的基本知识和基本命令： https://www.cnblogs.com/zsql/p/16435553.html 
- 存储与文件系统 https://deerchao.cn/blog/posts/storage.html
- NTFS, FAT32和exFAT文件系统有什么区别？ https://zhuanlan.zhihu.com/p/32364955
- Linux系统中常见文件系统格式 https://www.cnblogs.com/fengdejiyixx/p/10774397.html 
- 图解Linux中EXT4与EXT3的区别 https://blog.csdn.net/Jerry_1126/article/details/45305567 
- Mac 上"磁盘工具"中可用的文件系统格式 https://support.apple.com/zh-cn/guide/disk-utility/dsku19ed921c/mac 
- SSD中，SATA、m2、PCIE和NVME各有什么意义呢？ https://www.zhihu.com/question/48972075/answer/521468195
- 固态硬盘SSD与机械硬盘HDD的区别 https://zhuanlan.zhihu.com/p/73979282

