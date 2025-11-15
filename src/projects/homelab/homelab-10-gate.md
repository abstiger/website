---
order: 10
title: 极客家居-路由网关
author: abstiger
article: false
---

# 极客家居-路由网关

基于 OpenWRT 构建的路由网关

## 原理背景

### 防火墙相关

- netfilter/iptables简介 https://segmentfault.com/a/1190000009043962
- iptables详解 https://www.xiebruce.top/1071.html

### 抓包分析

- tcpdump https://www.tcpdump.org/  基于cBPF增加了语法解析，命令行直接抓包
- wireshark  https://www.wireshark.org/  增加了GUI，更直观方便的学习了解网络处理

## 安装配置

https://www.cnblogs.com/Magiclala/p/18418732

### 操作系统

操作系统采用 [OpenWrt](https://openwrt.org)

- 官方文档 https://openwrt.org/docs/start
- 用户指南 https://openwrt.org/docs/guide-user/start

#### 安装引导固件Breed

https://openwrt.org/docs/techref/bootloader/breed

#### 使用开源固件

https://op.supes.top/firmware/

https://github.com/kiddin9/OpenWrt_x86-r2s-r4s   

#### 编译固件刷机（备选）

基于 github actions 自编译固件

https://docs.github.com/en/actions  

https://www.youtube.com/watch?v=R8_veQiYBjI  

### 配置动态域名

家庭网络一般为动态变化的ip地址，为了能够访问到家里的网络，需要在检测到ip变化时，及时更新域名对应的ip地址，使得域名永远指向家庭的ip地址，此即为[动态域名解析](http://baike.baidu.com/view/762.htm)。

1. DDNS

### 配置流量入口

#### 通过WireGuard

- 官方指南 https://openwrt.org/docs/guide-user/services/vpn/wireguard/start
- OpenWRT WireGuard VPN Server Tutorial https://www.reddit.com/r/openwrt/comments/bahhua/openwrt_wireguard_vpn_server_tutorial/
- 使用WireGuard随时随地访问家中内网资源 https://www.right.com.cn/forum/thread-1335402-1-1.html
- 安装和配置wireguard https://segmentfault.com/a/1190000021720487

#### 通过OpenVPN

### 配置流量出口

1. bypass

### 配置广告拦截

1. adbyby-plus

### 配置文件共享

Samba，参考：  
- https://ubuntu.com/server/docs/samba-introduction
- https://help.ubuntu.com/community/Samba/SambaClientGuide 
- https://wiki.samba.org/index.php/LinuxCIFS_utils

#### 服务端

TODO

#### 客户端

安装：
```bash
sudo apt -y install smbclient cifs-utils
```

测试：
```bash
smbclient //gate.krproject.org/samba -U root
```

挂载：
```bash
mkdir -p /samba

mount -t cifs -o username=root //gate.krproject.org/samba /samba
```

持久挂载：

vi /root/.samba_credentials

```
username=root
password=******
domain=WORKGROUP
```

vi /etc/fstab

```
//gate.krproject.org/samba  /samba cifs credentials=/root/.samba_credentials 0 0
```

```bash
mount -a
df -hT
```

### 配置域名证书

基于 acme

全站 HTTPS 没你想象的那么简单 : https://www.cnblogs.com/mafly/p/allhttps.html

#### 服务端

安装`luci-app-acme`

编辑 `/etc/config/nginx` 

```
config main global
	option uci_enable 'true'
	
config server '_lan'
	list listen '80'
	list listen '[::]:80'
	option return '302 https://$host$request_uri'

config server '_ssl'
	list listen '443 ssl'
	list listen '[::]:443 ssl'
	option server_name '*.krproject.org'
	list include 'conf.d/*.locations'
	option ssl_certificate '/mnt/sda3/acme/krproject.org/krproject.org.cer'
	option ssl_certificate_key '/mnt/sda3/acme/krproject.org/krproject.org.key'
	option ssl_session_cache 'shared:SSL:32k'
	option ssl_session_timeout '64m'
	option access_log 'off; # logd openwrt'
```

```bash
service nginx restart
```

#### 客户端

check-acme-files.sh

```bash
#!/bin/bash

LOG_FILE=${0}.log

FILE_LIST_ARRAY=(
        '/samba/acme/krproject.org/fullchain.cer /etc/ssl/krproject.org/fullchain.cer'
        '/samba/acme/krproject.org/krproject.org.cer /etc/ssl/krproject.org/krproject.org.cer'
        '/samba/acme/krproject.org/krproject.org.key /etc/ssl/krproject.org/krproject.org.key'
)
FILE_CHANGED=0

echo "$(date) : check files starting!"|tee -a ${LOG_FILE}

# check files changed or not
for i in ${!FILE_LIST_ARRAY[@]}; do
        FILE_ARRAY=(${FILE_LIST_ARRAY[$i]});
        SOURCE_FILE=${FILE_ARRAY[0]};
        TARGET_FILE=${FILE_ARRAY[1]};
        if [ ! -f ${SOURCE_FILE} ]; then
                echo "$(date) : ${SOURCE_FILE} not exists!"|tee -a ${LOG_FILE}
                break;
        fi

        if ! cmp -s "${SOURCE_FILE}" "${TARGET_FILE}"; then
                echo "$(date) : copy ${SOURCE_FILE} to ${TARGET_FILE}"|tee -a ${LOG_FILE}
                cp -f ${SOURCE_FILE} ${TARGET_FILE};
                FILE_CHANGED=1;
        fi
done

# restart apache2 when file changed
if [ "${FILE_CHANGED}" -eq "1" ]; then
        echo "$(date) : service apache2 restart"|tee -a ${LOG_FILE}
        service apache2 restart;
fi


echo "$(date) : check files finished!"|tee -a ${LOG_FILE}
```

