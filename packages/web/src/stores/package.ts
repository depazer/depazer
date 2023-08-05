import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { ApiGetNpmPackageInfo } from '@/api/npmRegistry'

interface BaseInfo {
  name: string
  version: string
}

export const usePackageStore = defineStore('package', () => {
  const currentPackage = reactive<BaseInfo>({ name: '', version: '' })

  /** @example packageID: '@vue/shared@3.3.4' */
  function togglePackage(packageID: string) {
    currentPackage.version = packageID.split('@').at(-1)!
    currentPackage.name = packageID.split('@').slice(0, -1).join('@')
  }

  const packageRegistry = computed(async () => {
    return await ApiGetNpmPackageInfo(currentPackage.name, currentPackage.version)
  })

  return { currentPackage, packageRegistry, togglePackage }
})
