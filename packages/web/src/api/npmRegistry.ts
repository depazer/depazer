import { get, set } from 'idb-keyval'
import { useFetch } from '@vueuse/core'

/**
 * @desc 获取npm包信息, 从缓存中获取, 如果没有则从网络获取, 未指定具体版本则不缓存
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
  const url = `${baseURL || 'https://registry.npmjs.org/'}${name}/${version}`

  const cached = version === '' ? undefined : await get(url)

  if (cached) {
    return { data: cached, error: undefined }
  }

  const { data, error } = await useFetch(
    url,
    { headers: { 'Content-Type': 'application/json' }, method: 'GET' },
    {
      afterFetch({ data }) {
        if (version !== '') set(url, data)
        return { data }
      }
    }
  ).json()

  return { error: error.value, data: data.value }
}
