export const useAppStore = defineStore('app', () => {
  const npmRegistryURLs = [
    'https://registry.npmmirror.com/',
    'https://registry.npmjs.cf/',
    'https://registry.npmjs.org/'
  ]
  const currentRegistry = ref<string>(npmRegistryURLs[0])

  const fixedNailModel = ref<boolean>(false)
  const toggleFixedNailModel = useToggle(fixedNailModel)

  /** @desc 递归深度 */
  const depth = ref<number>(2)
  /** @desc 斥力大小 */
  const repulsion = ref<number>(5000)

  return {
    currentRegistry,
    depth,
    fixedNailModel,
    npmRegistryURLs,
    repulsion,
    toggleFixedNailModel
  }
})
