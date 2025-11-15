---
order: 30
title: 极客家居-连接控制
author: abstiger
article: false
---

# 极客家居-连接控制

基于 HAOS 的连接控制处理

## 原理背景

现有的智能家居解决方案几乎都是需要将家庭数据上传至云端，在云端编辑规则或者场景方案来实现自动化及智能控制。  

但这带来了诸多的安全隐患，尽管各厂商均宣称其尊重隐私，但显然我们并不希望将家庭的私有数据放到云端！  

### 运算处理

所谓智能家居的运作流程：收集各种智能设备的输入，在**核心**中进行场景匹配和规则运算，再调用智能设备的输出

### 连接协议

目前来说IOT的连接标准或者统一联盟为：https://csa-iot.org

下属有两个工作组WorkGroup：
- [Zigbee](https://csa-iot.org/all-solutions/zigbee/) 目前较为完善，厂商支持较好
- [Matter](https://csa-iot.org/all-solutions/matter/) 基于IP的方案，是趋势

总之，目前物联网的发展还是蓬勃的阶段，处于标准的设计和建立阶段，但不影响我们基于这些协议和连接做的上层应用上！

- mqtt
https://mqtt.org/

MQTT is an OASIS standard messaging protocol for the Internet of Things (IoT). It is designed as an extremely lightweight publish/subscribe messaging transport that is ideal for connecting remote devices with a small code footprint and minimal network bandwidth. MQTT today is used in a wide variety of industries, such as automotive, manufacturing, telecommunications, oil and gas, etc.

MQTT is the most commonly used messaging protocol for the Internet of Things (IoT). MQTT stands for MQ Telemetry Transport. The protocol is a set of rules that defines how IoT devices can publish and subscribe to data over the Internet. MQTT is used for messaging and data exchange between IoT and industrial IoT (IIoT) devices, such as embedded devices, sensors, industrial PLCs, etc. The protocol is event driven and connects devices using the publish /subscribe (Pub/Sub) pattern. The sender (Publisher) and the receiver (Subscriber) communicate via Topics and are decoupled from each other. The connection between them is handled by the MQTT broker. The MQTT broker filters all incoming messages and distributes them correctly to the Subscribers.

- CSA-IOT  
https://csa-iot.org/  
Building the Foundation and Future of the IoT
The Connectivity Standards Alliance is the place where industry professionals across the globe come together, paving the way to a world of seamless interaction that is transforming the way we live, work, and play. We believe all objects can work together to enhance our day-to-day experiences, and together we create the standards, tools, and platforms which make this possible.

- Zigbee  
https://csa-iot.org/all-solutions/zigbee/
Zigbee is the only complete loT solution — from mesh network to the universal language that allows smart objects to work together.

- Matter  
https://csa-iot.org/all-solutions/matter/

Matter (formerly Project Connected Home over IP, or Project CHIP) is a new Working Group within the Connectivity Standards Alliance (CSA, formerly Zigbee Alliance). This Working Group plans to develop and promote the adoption of a new, royalty-free connectivity standard to increase compatibility among smart home products, with security as a fundamental design tenet.

The goal of the Matter project is to simplify development for manufacturers and increase compatibility for consumers. The project is built around a shared belief that smart home devices should be secure, reliable, and seamless to use. By building upon Internet Protocol (IP), the project aims to enable communication across smart home devices, mobile apps, and cloud services and to define a specific set of IP-based networking technologies for device certification.

The CSA officially opened the Matter Working Group on January 17, 2020 and is in the process of drafting the specification.


- PLC-IOT  
https://e.huawei.com/cn/solutions/enterprise-networks/plc-iot-alliance  
> 基于IPv6

## 方案选型

### HomeAssistant
- 官网： https://www.home-assistant.io/
- 仓库： https://github.com/home-assistant

### WebThings
- 官网： https://webthings.io/
- 仓库： https://github.com/WebThingsIO

### openHAB
- 官网： https://www.openhab.org/
- 仓库： https://github.com/openhab


## 安装配置

Ubuntu 20.04 focal

基于 Home Assistant Container 的核心大脑

### 文件共享客户端samba

数据共享

### 域名证书同步ssl

let's encrypt 证书

### 服务暴露Apache

### 镜像容器Docker

官方安装参考文档：<https://docs.docker.com/engine/install/ubuntu/>

#### 安装步骤

```bash
# 安装 docker-ce 及 docker compose
sudo apt-get -y install docker-ce docker-compose-plugin
```

#### 安装检查

```bash
docker version
docker compose version
```

#### 安装配置

- Manage Docker as a non-root user，参考文档： <https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user>

```bash
# Create the docker group.
sudo groupadd docker

# Add your user to the docker group.
sudo usermod -aG docker $USER
```

### HomeAssistant
Home Assistant
- 官网：https://www.home-assistant.io/
- 仓库：https://github.com/home-assistant/core

参考文档：https://www.home-assistant.io/installation/linux#install-home-assistant-container

### mosquitto
mqtt broker
- 官网：https://www.mosquitto.org/
- 仓库：https://github.com/eclipse/mosquitto

### zigbee2mqtt
依赖mqtt
- 官网：https://www.zigbee2mqtt.io/
- 仓库：https://github.com/Koenkk/zigbee2mqtt

### Frigate
摄像头，依赖mqtt
- 官网：https://frigate.video/
- 仓库：https://github.com/blakeblackshear/frigate

### duplicati
备份恢复
- 官网：https://www.duplicati.com/
- 仓库：https://github.com/duplicati/duplicati