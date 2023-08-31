# WEB 可视化操作

## 包含开发依赖

:::warning
开发依赖仅仅指当前项目的开发依赖，不包含依赖包的开发依赖。
:::

默认依赖不包含开发依赖包，如果需要查看开发依赖包，可以点击右上角的设置将开发依赖的开关打开以包含开发依赖，如下图所示：

<img src="https://qingshaner.oss-cn-hangzhou.aliyuncs.com/images/202308311105688.webp" alt="setting" class="depazer-img" />

为了区分开发依赖和生产依赖，指向生产依赖的线条会以偏紫色的背景色进行标记，而指向开发依赖的线条以偏蓝色的线条标记，如下图所示：
<img src="https://qingshaner.oss-cn-hangzhou.aliyuncs.com/images/202308311103783.webp" alt="line" class="depazer-img" />

## 依赖查询深度

依赖查询深度指的是从根依赖包到当前依赖包的最短路径的长度，可以通过右上角的设置按钮进行设置查询深度。相同深度的依赖包会以相同的颜色进行标记
随着查询深度的变化部分包的依赖深度会因与其它依赖共用依赖的原因而更新。

## 查看子依赖

当查询深度过大时，由于过多的依赖包显示在屏幕中，不方便分析相关的依赖关系，这时可以将依赖图的根依赖包更换为子依赖包，以排除其他依赖的干扰。

## 循环依赖

当项目依赖中出现循环依赖时，会在依赖图中将相关边标记为红色，如下图所示：

<!-- ![loop dependency](assets/web-loopdependency.png) -->

同时右下角也会出现循环依赖查看的按钮，点击后会显示所有的循环依赖，如下图所示：

<!-- ![loop dependency btn](assets/web-loopdependency-btns.png) -->

循环依赖的列表如下图所示

<!-- ![loop dependency list](assets/web-loopdependency-list.png) -->

:::tip
列表图仅展示了循环依赖的关系，并未展示不属于循环圈的依赖关系
:::

若要查看循环依赖的详细依赖图，可以直接点击循环依赖列表中的依赖包节点，即可自动将该循环依赖设为有向图的根节点，并可以查看该依赖包的依赖图，如下图所示：

<!-- ![loop dependency root](assets/web-loopdependency-root.png) -->
