import { get, set } from 'idb-keyval'
import { useFetch } from '@vueuse/core'

export async function ApiGetNpmPackageInfo(name: string, version: string) {
  const cached = await get(`${name}@${version}`)

  if (cached) {
    return { data: cached }
  }

  const { data, error } = await useFetch(
    `${name}@${version}`,
    {
      headers: { 'Content-Type': 'application/json' }
    },
    {
      afterFetch({ data, response }) {
        set(response.url, data)
        return { data }
      }
    }
  )
    .get()
    .json()

  return error.value ? { error: error.value } : { data: data.value }
}
