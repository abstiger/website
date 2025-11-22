import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,d as e,o as l}from"./app-CdpNCDY8.js";const i={};function p(d,n){return l(),a("div",null,[...n[0]||(n[0]=[e(`<p>当你看到:</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>((4%3+4*27/(10-2)) &gt; 12.99)&amp;&amp;</span></span>
<span class="line"><span>(F_1 !@ {&#39;shanghai&#39;,&#39;beijing&#39;,&#39;guangzhou&#39;,})&amp;&amp;</span></span>
<span class="line"><span>(S_3 ## [^S_*])||(D_1 @@ A_1);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你会有怎样的反应呢？</p><p>让我尝试着来翻译一下吧：<br><strong>如果</strong><br> 判断条件一：运算式(4%3+4<em>27/(10-2)) 的值 <code>大于</code> 12.99<br><strong>并且</strong><br> 判断条件二：流水第一个域（F_1，比如一笔交易流水的交易地点）的值 <code>不属于</code> 多值集合{&#39;shanghai&#39;,&#39;beijing&#39;,&#39;guangzhou&#39;,}<br><strong>并且</strong><br> 判断条件三：静态数据项3（S_3，比如为同卡片上笔交易的交易码）<code>满足正则表达式</code> [^S_</em>]<br><strong>或者</strong><br> 判断条件四：动态统计量1（D_1，比如半个小时内的交易次数） <code>属于</code> 集合1</p><p>这便是我前段时间开发这段时间完善的一个简单的C版规则引擎，不过现在我更倾向与叫它计算器，因为在krproject里它不仅用来做规则运算，还会参与统计量和数据项的过滤条件运算，于是独立出来，取名为krcalc。</p><p>下面这个是运行kr_calc_test的截屏：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>Dumping Calc:[D][((4%3+4*27/(10-2)) &gt; 12.99)&amp;&amp;</span></span>
<span class="line"><span>(F_1 !@ {&#39;shanghai&#39;,&#39;beijing&#39;,&#39;guangzhou&#39;,})&amp;&amp;(S_3 ## [^S_*])||(D_1 @@ A_1);]:</span></span>
<span class="line"><span>    fid_cnt:[1],sid_cnt:[1],did_cnt:[1],set_cnt:[1],regex_cnt:[1]</span></span>
<span class="line"><span>    Logic Op: ||</span></span>
<span class="line"><span>        Logic Op: &amp;&amp;</span></span>
<span class="line"><span>            Logic Op: &amp;&amp;</span></span>
<span class="line"><span>                Logic Op: &gt;</span></span>
<span class="line"><span>                    Arith Op: +</span></span>
<span class="line"><span>                        Arith Op: %</span></span>
<span class="line"><span>                            Num_Const: 4</span></span>
<span class="line"><span>                            Num_Const: 3</span></span>
<span class="line"><span>                        Arith Op: /</span></span>
<span class="line"><span>                            Arith Op: *</span></span>
<span class="line"><span>                                Num_Const: 4</span></span>
<span class="line"><span>                                Num_Const: 27</span></span>
<span class="line"><span>                            Arith Op: -</span></span>
<span class="line"><span>                                Num_Const: 10</span></span>
<span class="line"><span>                                Num_Const: 2</span></span>
<span class="line"><span>                    FNum_Const: 12.990000</span></span>
<span class="line"><span>                Logic Op: !@</span></span>
<span class="line"><span>                    Fid: F_1</span></span>
<span class="line"><span>                    Multi: {&#39;shanghai&#39;,&#39;beijing&#39;,&#39;guangzhou&#39;,}</span></span>
<span class="line"><span>            Logic Op: ##</span></span>
<span class="line"><span>                Sid: S_3</span></span>
<span class="line"><span>                Regex: ^S_*</span></span>
<span class="line"><span>        Logic Op: @@</span></span>
<span class="line"><span>            Did: D_1</span></span>
<span class="line"><span>            Set: A_1</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [0] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [0] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [0] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [0] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [0] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [3] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>kr_evaluate_node [F_1] [5] called!</span></span>
<span class="line"><span>kr_evaluate_node [{&#39;shanghai&#39;,&#39;beijing&#39;,&#39;guangzhou&#39;,}] [9] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>kr_evaluate_node [S_3] [6] called!</span></span>
<span class="line"><span>kr_evaluate_node [^S_*] [10] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>result_type:[B] result_value:[1]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>先是dump出的树形结构，然后是具体的运算步骤，这里有做简单优化（计算表达式：<code>A&amp;&amp;B</code>，如果A为<code>FALSE</code>则B不会再计算，同理计算表达式：<code>A||B</code>，如果A为<code>TRUE</code>，则B不会被计算）；</p><p>对比表达式<code>3&gt;5 &amp;&amp; 1==1;</code>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>Dumping Calc:[D][3&gt;5 &amp;&amp; 1==1;]:</span></span>
<span class="line"><span>    fid_cnt:[0],sid_cnt:[0],did_cnt:[0],set_cnt:[0],regex_cnt:[0]</span></span>
<span class="line"><span>    Logic Op: &amp;&amp;</span></span>
<span class="line"><span>        Logic Op: &gt;</span></span>
<span class="line"><span>            Num_Const: 3</span></span>
<span class="line"><span>            Num_Const: 5</span></span>
<span class="line"><span>        Logic Op: ==</span></span>
<span class="line"><span>            Num_Const: 1</span></span>
<span class="line"><span>            Num_Const: 1</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>result_type:[B] result_value:[0]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与表达式 <code>3&lt;=5 &amp;&amp; 1==1;</code>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>Dumping Calc:[D][3&lt;=5 &amp;&amp; 1==1;]:</span></span>
<span class="line"><span>    fid_cnt:[0],sid_cnt:[0],did_cnt:[0],set_cnt:[0],regex_cnt:[0]</span></span>
<span class="line"><span>    Logic Op: &amp;&amp;</span></span>
<span class="line"><span>        Logic Op: &lt;=</span></span>
<span class="line"><span>            Num_Const: 3</span></span>
<span class="line"><span>            Num_Const: 5</span></span>
<span class="line"><span>        Logic Op: ==</span></span>
<span class="line"><span>            Num_Const: 1</span></span>
<span class="line"><span>            Num_Const: 1</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [2] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>kr_evaluate_node [(null)] [1] called!</span></span>
<span class="line"><span>result_type:[B] result_value:[1]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后的result_type:[B] result_value:[1]表示它的运算结果类型为Boolean布尔型，运算结果为TRUE：1<br> 当然，你需要在调用这个计算器前设置两个回调callback函数，用来获取外部变量（包括域F_<em>、静态数据项S_</em>、动态统计量D_<em>、集合A_</em>）的类型与值。<br> 这里我上一篇博客里提到变量的记录级缓存与触发性缓存也都是需要在这个回调函数中完成，这个test里并没有实际去写，属于接下来的工作了！</p><p>除了完善这个核心的krcalc之外，这段时间还完成的模块包括：</p><ul><li>数据库操作模块（dbs）<br> 本来叫krdbs的，觉得似乎容易与krdb混淆，便去了kr……，支持db2和oracle，编译时通过指定—with-db2或—with-oracle便可。这当中用power design生成krproject的数据库模型花了些时间；</li><li>共享内存模块（krshm）<br> 将数据库中的统计量与规则配置读取至共享内存中，这里有纠结两天，目前共享内存里存放都是配置的静态信息，不包含动态信息（即只存放了数据库中用来表示规则的字符串，而将这个字符串解析后的ruletree没有放入共享内存，而是需要用户进程自己更新），主要是觉得写一个共享内存的动态分配器还是有点麻烦的，另外很多数据结构底层已经用了kr_alloc。这样，用户进程就需要通过一个timestamp来判断自己的动态内存配置是否与当前的共享内存静态配置一致，不一致就需要重新生成了；</li></ul><p>接下来就是krdb的优化和krrules的包装以及各模块的集成服务化了……</p>`,16)])])}const t=s(i,[["render",p]]),u=JSON.parse(`{"path":"/projects/krproject/krproject-develop-trace-2.html","title":"krproject开发进展（二）","lang":"zh-CN","frontmatter":{"order":2,"title":"krproject开发进展（二）","article":false,"date":"2012-04-28T21:20:50.000Z","description":"当你看到: 你会有怎样的反应呢？ 让我尝试着来翻译一下吧： 如果 判断条件一：运算式(4%3+427/(10-2)) 的值 大于 12.99 并且 判断条件二：流水第一个域（F_1，比如一笔交易流水的交易地点）的值 不属于 多值集合{'shanghai','beijing','guangzhou',} 并且 判断条件三：静态数据项3（S_3，比如为同卡...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"WebPage\\",\\"name\\":\\"krproject开发进展（二）\\",\\"description\\":\\"当你看到: 你会有怎样的反应呢？ 让我尝试着来翻译一下吧： 如果 判断条件一：运算式(4%3+427/(10-2)) 的值 大于 12.99 并且 判断条件二：流水第一个域（F_1，比如一笔交易流水的交易地点）的值 不属于 多值集合{'shanghai','beijing','guangzhou',} 并且 判断条件三：静态数据项3（S_3，比如为同卡...\\"}"],["meta",{"property":"og:url","content":"https://abstiger.com/projects/krproject/krproject-develop-trace-2.html"}],["meta",{"property":"og:site_name","content":"Tiger's Website"}],["meta",{"property":"og:title","content":"krproject开发进展（二）"}],["meta",{"property":"og:description","content":"当你看到: 你会有怎样的反应呢？ 让我尝试着来翻译一下吧： 如果 判断条件一：运算式(4%3+427/(10-2)) 的值 大于 12.99 并且 判断条件二：流水第一个域（F_1，比如一笔交易流水的交易地点）的值 不属于 多值集合{'shanghai','beijing','guangzhou',} 并且 判断条件三：静态数据项3（S_3，比如为同卡..."}],["meta",{"property":"og:type","content":"website"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-11-15T10:21:25.000Z"}],["meta",{"property":"article:published_time","content":"2012-04-28T21:20:50.000Z"}],["meta",{"property":"article:modified_time","content":"2025-11-15T10:21:25.000Z"}]]},"git":{"createdTime":1763202085000,"updatedTime":1763202085000,"contributors":[{"name":"mingqiang.cheng","username":"","email":"mingqiang.cheng@cloudpense.com","commits":1}]},"readingTime":{"minutes":3.72,"words":1116},"filePathRelative":"projects/krproject/krproject-develop-trace-2.md","excerpt":"<p>当你看到:</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span>((4%3+4*27/(10-2)) &gt; 12.99)&amp;&amp;</span></span>\\n<span class=\\"line\\"><span>(F_1 !@ {'shanghai','beijing','guangzhou',})&amp;&amp;</span></span>\\n<span class=\\"line\\"><span>(S_3 ## [^S_*])||(D_1 @@ A_1);</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{t as comp,u as data};
