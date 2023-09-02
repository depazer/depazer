import { createStore, del, get, set } from 'idb-keyval'
import { useFetch } from '@vueuse/core'

const registryStore = createStore('depazer', 'registry')

/**
 * @desc 获取npm包信息, 指定版本号永久缓存，其他版本号5分钟缓存
 * @param name 包名
 * @param version 版本 可为 '' 查询所有版本 ‘latest’ 查询最新版本
 * @param baseURL npm registry 接口地址
 */
export async function ApiGetNpmPackageInfo(
  name: string,
  version: string,
  baseURL: string
): Promise<{
  data: any
  error: any
}> {
  const key = `${name}@${version}`

  const hasCache = await get(key, registryStore)
  if (hasCache) {
    if (hasCache.ttl === undefined) return { data: hasCache, error: undefined }
    if (hasCache.ttl > Date.now()) return { data: hasCache.registry, error: undefined }
    else del(key, registryStore)
  }

  const { data, error } = await useFetch(
    `${baseURL || 'https://registry.npmjs.org/'}${name}/${version}`,
    { headers: { 'Content-Type': 'application/json' }, method: 'GET' },
    {
      afterFetch({ data }) {
        version !== '' && set(`${name}@${data.version}`, data, registryStore)

        version !== data.version &&
          set(
            `${name}@${version}`,
            { ttl: Date.now() + 1000 * 60 * 5, registry: data },
            registryStore
          )

        return { data }
      }
    }
  ).json()

  return { error: error.value, data: data.value }
}
