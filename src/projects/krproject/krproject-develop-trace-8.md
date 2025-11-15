---
order: 8
title: krproject开发进展（八）
article: false
date: 2013-04-22 14:53:43
---

有两个月没有写博客了，中间是写了些草稿的，前段时间在学习java时，随手写了篇《java util实用工具包之数据结构浅析》，后来在网上搜了下，发现别人写的比我的好，而且深入，就丢进回收站了。不过文字越不写就越手生，好习惯不能丢弃。所以尽管这段时间因为一些乱七八遭的原因，krproject没有太多的进展，但我还是凑合凑合整篇博客记录一下：

上篇 [krproject开发进展（七）](./krproject-develop-trace-7) 主要的工作就是将krrule由之前的较简洁直观的字符串表达换成了json格式，最主要的目的就是方便页面的操作处理，这段时间学习了些javascript相关知识，参考了些开源实现（推荐一个还蛮不错的在线json编辑器：[jsoneditor](http://jsoneditoronline.org/ "jsoneditor")），凑合着整了几百行基于jquery的js代码，实现了一个较为简单和粗糙的krrule界面编辑器demo，放在我的小树莓派上了。

具体在实现时，将上次的json格式规则又简化了下，将操作符的左右child值换成了json的数组，这样对单目或三目操作符也很方便，字符串内容也稍微精简了些。另外就是去除了KR_CALCKIND_ARITH和KR_CALCKIND_LOGIC算术表达式和逻辑表达式两种kind，直接json对象表示表达式。

其中表达式的操作符有：
```js
    var E_KRCalcOp = {
      KR_CALCOP_PLUS   : {value:1 , text:"+ ", desc:"加"},
      KR_CALCOP_SUB    : {value:2 , text:"- ", desc:"减"},
      KR_CALCOP_MUT    : {value:3 , text:"* ", desc:"乘"},
      KR_CALCOP_DIV    : {value:4 , text:"/ ", desc:"除"},
      KR_CALCOP_MOD    : {value:5 , text:"% ", desc:"取模"},
      KR_CALCOP_NOT    : {value:6 , text:"! ", desc:"非"},
      KR_CALCOP_LT     : {value:7 , text:"&lt; ", desc:"小于"},
      KR_CALCOP_LE     : {value:8 , text:"&lt;=", desc:"小于等于"},
      KR_CALCOP_GT     : {value:9 , text:"&gt; ", desc:"大于"},
      KR_CALCOP_GE     : {value:10, text:"&gt;=", desc:"大于等于"},
      KR_CALCOP_EQ     : {value:11, text:"==", desc:"等于"},
      KR_CALCOP_NEQ    : {value:12, text:"!=", desc:"不等于"},
      KR_CALCOP_AND    : {value:13, text:"&amp;&amp;", desc:"并且"},
      KR_CALCOP_OR     : {value:14, text:"||", desc:"或者"},
      KR_CALCOP_BL     : {value:15, text:"@@", desc:"属于"},
      KR_CALCOP_NBL    : {value:16, text:"!@", desc:"不属于"},
      KR_CALCOP_MATCH  : {value:17, text:"##", desc:"正则匹配"}
    };
```    
<!--more-->     

元素类型有：
```js
    var E_KRCalcKind = {
      //KR_CALCKIND_ARITH   : {value:1 , text:"arithmetic",  desc:"算术运算符"},      
      //KR_CALCKIND_LOGIC   : {value:2 , text:"logic",  desc:"逻辑运算符"},      
      KR_CALCKIND_INT     : {value:3 , text:"integer",  desc:"整型常量"},      
      KR_CALCKIND_FLOAT   : {value:4 , text:"float",  desc:"浮点型常量"},      
      KR_CALCKIND_STRING  : {value:5 , text:"string",  desc:"字符串常量"},    
      KR_CALCKIND_CID     : {value:6 , text:"current",  desc:"当笔字段", options:null},      
      KR_CALCKIND_FID     : {value:7 , text:"field",  desc:"遍历字段", options:null},    
      KR_CALCKIND_SID     : {value:8 , text:"static", desc:"静态数据项", options:null},
      KR_CALCKIND_DID     : {value:9 , text:"dynamic",  desc:"动态统计量", options:null},    
      KR_CALCKIND_HID     : {value:10, text:"historic", desc:"历史统计量", options:null},
      KR_CALCKIND_SET     : {value:11, text:"set", desc:"集合"},    
      KR_CALCKIND_MINT    : {value:12, text:"multi-int", desc:"多值整型集合"},  
      KR_CALCKIND_MFLOAT  : {value:13, text:"multi-float", desc:"多值浮点型集合"},    
      KR_CALCKIND_MSTRING : {value:14, text:"multi-string", desc:"多值字符串型集合"},    
      KR_CALCKIND_REGEX   : {value:15, text:"regex", desc:"正则表达式"}
    };
```   

这个规则编辑界面可能还是偏技术了些，但这已经是我能想到比较简洁直观的规则编辑界面了，希望有熟悉js或者前台的大牛帮我指点指点、改吧改吧~  
接下来就是基于flask的krweb开发了，之前小看前端开发了，现在看起来整个web界面还需要耗些时日的。  
欢迎大家试玩，提提建议！
