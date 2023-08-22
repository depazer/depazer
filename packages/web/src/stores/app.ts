export const useAppStore = defineStore('app', () => {
  const npmRegistryURLs = ['https://registry.npmmirror.com/', 'https://registry.npmjs.cf/']
  const currentRegistry = ref<string>(npmRegistryURLs[0])

  const fixedNailModel = ref<boolean>(false)
  const toggleFixedNailModel = useToggle(fixedNailModel)

  /** @desc 斥力大小 */
  const repulsion = ref<number>(5000)

  return {
    currentRegistry,
    fixedNailModel,
    npmRegistryURLs,
    repulsion,
    toggleFixedNailModel
  }
})
