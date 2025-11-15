---
order: 20
title: 极客家居-数据存储
author: abstiger
article: false
---

# 极客家居-数据存储

基于 Ubuntu 的数据存储

## 原理背景

家庭数据的核心存储

## 方案选型

Nextcloud的文件直接放在磁盘上，方便查看和备份

### Nextcloud
- 官网： https://nextcloud.com/
- 仓库： https://github.com/nextcloud

软件，ubuntu上有snap管理，开发活跃，社区参与度高，终端覆盖也较全（mac，win，android，ios等）

### Seafile
- 官网：https://www.seafile.com/
- 仓库：https://github.com/haiwen/seafile

软件，性能较nextcloud高一些，但社区参与度不高

### OpenMediaVault
- 官网： https://www.openmediavault.org/
- 仓库： https://github.com/openmediavault

操作系统，几乎没有社区参与

### FreeNAS/TrueNAS
- 官网： https://www.freenas.org/
- 仓库： https://github.com/freenas

操作系统，基于FreeBSD，ZFS文件系统格式，社区参与度不高

### 方案对比

https://www.freenas.org/freenas-vs-openmediavault/

## 安装配置

基于 Nextcloud 的数据同步

### 挂载数据盘

https://help.ubuntu.com/community/Fstab

To get a list of all the UUIDs, use one of the following two commands:

```bash
sudo blkid
ls -l /dev/disk/by-uuid
```

To list the drives and relevant partitions that are attached to your system, run:

```bash
sudo fdisk -l 
sudo mkfs -t ext4 /dev/sdb
sudo mkdir -p /mnt/data1
sudo mount -t ext4 /dev/sdb /mnt/data1
sudo umount /mnt/data1
sudo mount -a # To mount all file systems in /etc/fstab
sudo mkdir -p /mnt/data1/nextcloud/data
```

编辑：`/etc/fstab` 永久挂载
```
# Added by tiger 20220608, get uuid by: sudo blkid
UUID=274f2f35-cd65-4ec3-aa0b-2df87e7406f6 /mnt/data1 ext4 defaults 0 0
UUID=2e53e266-6742-4824-88bb-b5ef946b1bf3 /mnt/data2 ext4 defaults 0 0
```

### 配置文件同步

https://www.ruanyifeng.com/blog/2020/08/rsync.html

### 配置nextcloud
