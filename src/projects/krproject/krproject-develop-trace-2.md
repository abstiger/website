---
order: 2
title: krproject开发进展（二）
article: false  
date: 2012-04-28 21:20:50
---

当你看到:
```
((4%3+4*27/(10-2)) > 12.99)&&
(F_1 !@ {'shanghai','beijing','guangzhou',})&&
(S_3 ## [^S_*])||(D_1 @@ A_1);
```
你会有怎样的反应呢？

让我尝试着来翻译一下吧：  
**如果**  
判断条件一：运算式(4%3+4*27/(10-2)) 的值 `大于` 12.99  
**并且**  
判断条件二：流水第一个域（F_1，比如一笔交易流水的交易地点）的值 `不属于` 多值集合{'shanghai','beijing','guangzhou',}  
**并且**  
判断条件三：静态数据项3（S_3，比如为同卡片上笔交易的交易码）`满足正则表达式` [^S_*]  
**或者**  
判断条件四：动态统计量1（D_1，比如半个小时内的交易次数） `属于` 集合1  

这便是我前段时间开发这段时间完善的一个简单的C版规则引擎，不过现在我更倾向与叫它计算器，因为在krproject里它不仅用来做规则运算，还会参与统计量和数据项的过滤条件运算，于是独立出来，取名为krcalc。

下面这个是运行kr_calc_test的截屏：
```
Dumping Calc:[D][((4%3+4*27/(10-2)) > 12.99)&&
(F_1 !@ {'shanghai','beijing','guangzhou',})&&(S_3 ## [^S_*])||(D_1 @@ A_1);]:
    fid_cnt:[1],sid_cnt:[1],did_cnt:[1],set_cnt:[1],regex_cnt:[1]
    Logic Op: ||
        Logic Op: &&
            Logic Op: &&
                Logic Op: >
                    Arith Op: +
                        Arith Op: %
                            Num_Const: 4
                            Num_Const: 3
                        Arith Op: /
                            Arith Op: *
                                Num_Const: 4
                                Num_Const: 27
                            Arith Op: -
                                Num_Const: 10
                                Num_Const: 2
                    FNum_Const: 12.990000
                Logic Op: !@
                    Fid: F_1
                    Multi: {'shanghai','beijing','guangzhou',}
            Logic Op: ##
                Sid: S_3
                Regex: ^S_*
        Logic Op: @@
            Did: D_1
            Set: A_1
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [0] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [0] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [0] called!
kr_evaluate_node [(null)] [0] called!
kr_evaluate_node [(null)] [0] called!
kr_evaluate_node [(null)] [3] called!
kr_evaluate_node [(null)] [1] called!
kr_evaluate_node [F_1] [5] called!
kr_evaluate_node [{'shanghai','beijing','guangzhou',}] [9] called!
kr_evaluate_node [(null)] [1] called!
kr_evaluate_node [(null)] [1] called!
kr_evaluate_node [S_3] [6] called!
kr_evaluate_node [^S_*] [10] called!
kr_evaluate_node [(null)] [1] called!
kr_evaluate_node [(null)] [1] called!
result_type:[B] result_value:[1]
```

先是dump出的树形结构，然后是具体的运算步骤，这里有做简单优化（计算表达式：`A&&B`，如果A为`FALSE`则B不会再计算，同理计算表达式：`A||B`，如果A为`TRUE`，则B不会被计算）；

对比表达式`3>5 && 1==1;`：
```
Dumping Calc:[D][3>5 && 1==1;]:
    fid_cnt:[0],sid_cnt:[0],did_cnt:[0],set_cnt:[0],regex_cnt:[0]
    Logic Op: &&
        Logic Op: >
            Num_Const: 3
            Num_Const: 5
        Logic Op: ==
            Num_Const: 1
            Num_Const: 1
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [1] called!
result_type:[B] result_value:[0]
```
与表达式 `3<=5 && 1==1;`：
```
Dumping Calc:[D][3<=5 && 1==1;]:
    fid_cnt:[0],sid_cnt:[0],did_cnt:[0],set_cnt:[0],regex_cnt:[0]
    Logic Op: &&
        Logic Op: <=
            Num_Const: 3
            Num_Const: 5
        Logic Op: ==
            Num_Const: 1
            Num_Const: 1
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [1] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [2] called!
kr_evaluate_node [(null)] [1] called!
kr_evaluate_node [(null)] [1] called!
result_type:[B] result_value:[1]
```

最后的result_type:[B] result_value:[1]表示它的运算结果类型为Boolean布尔型，运算结果为TRUE：1  
当然，你需要在调用这个计算器前设置两个回调callback函数，用来获取外部变量（包括域F_*、静态数据项S_*、动态统计量D_*、集合A_*）的类型与值。  
这里我上一篇博客里提到变量的记录级缓存与触发性缓存也都是需要在这个回调函数中完成，这个test里并没有实际去写，属于接下来的工作了！

除了完善这个核心的krcalc之外，这段时间还完成的模块包括：  
- 数据库操作模块（dbs）  
  本来叫krdbs的，觉得似乎容易与krdb混淆，便去了kr……，支持db2和oracle，编译时通过指定—with-db2或—with-oracle便可。这当中用power design生成krproject的数据库模型花了些时间；
- 共享内存模块（krshm）  
  将数据库中的统计量与规则配置读取至共享内存中，这里有纠结两天，目前共享内存里存放都是配置的静态信息，不包含动态信息（即只存放了数据库中用来表示规则的字符串，而将这个字符串解析后的ruletree没有放入共享内存，而是需要用户进程自己更新），主要是觉得写一个共享内存的动态分配器还是有点麻烦的，另外很多数据结构底层已经用了kr_alloc。这样，用户进程就需要通过一个timestamp来判断自己的动态内存配置是否与当前的共享内存静态配置一致，不一致就需要重新生成了；

接下来就是krdb的优化和krrules的包装以及各模块的集成服务化了……