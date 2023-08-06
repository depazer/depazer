import { get, set } from 'idb-keyval'
import { useFetch } from '@vueuse/core'

export async function ApiGetNpmPackageInfo(name: string, version: string, baseURL: string) {
  const url = `${baseURL || 'https://registry.npmjs.org/'}${name}/${version}`

  const cached = await get(url)

  if (cached) {
    return { data: cached }
  }

  const { data, error } = await useFetch(
    url,
    {
      headers: { 'Content-Type': 'application/json' }
    },
    {
      afterFetch({ data }) {
        set(url, data)
        return { data }
      }
    }
  )
    .get()
    .json()

  return error.value ? { error: error.value } : { data: data.value }
}
