# WEB 可视化操作

## 开发依赖包

## 依赖查询深度

## 查看子依赖

当查询深度过大时，由于过多的依赖包显示在屏幕中，不方便分析相关的依赖关系，这时可以将依赖图的根依赖包更换为子依赖包，以排除其他依赖的干扰。

## 循环依赖

当项目依赖中出现循环依赖时，会在依赖图中将相关边标记为红色，如下图所示：

![loop dependency](assets/web-loopdependency.png)

同时右下角也会出现循环依赖查看的按钮，点击后会显示所有的循环依赖，如下图所示：

![loop dependency btn](assets/web-loopdependency-btns.png)

循环依赖的列表如下图所示

![loop dependency list](assets/web-loopdependency-list.png)

:::tip
列表图仅展示了循环依赖的关系，并未展示不属于循环圈的依赖关系
:::

若要查看循环依赖的详细依赖图，可以直接点击循环依赖列表中的依赖包节点，即可自动将该循环依赖设为有向图的根节点，并可以查看该依赖包的依赖图，如下图所示：

![loop dependency root](assets/web-loopdependency-root.png)
