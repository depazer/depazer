# 依赖json文件说明

目前我们只输出经过打平后的依赖树。若要自定义可以使用`@depazer/core`提供的函数进行处理。

## 数据结构

```ts
type Name = string
type Version = string

type DependencyName = `${Name}@${Version}`

interface DependencyNode {
  name: DependencyName
  depth: number
  isDevDependency: boolean
  dependencies: DependencyName[]
}

type OutputJSON = DependencyNode[]
```
