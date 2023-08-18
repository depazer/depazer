export const useAppStore = defineStore('app', () => {
  const npmRegistryURLs = ['https://registry.npmmirror.com/', 'https://registry.npmjs.cf/']
  const currentRegistry = ref<string>(npmRegistryURLs[0])

  const fixedNailModel = ref<boolean>(false)
  const toggleFixedNailModel = useToggle(fixedNailModel)

  /** @desc 递归深度 */
  const depth = ref<number>(2)
  /** @desc 是否包含开发依赖 */
  const includeDev = ref<boolean>(false)
  /** @desc 斥力大小 */
  const repulsion = ref<number>(5000)

  return {
    currentRegistry,
    depth,
    includeDev,
    fixedNailModel,
    npmRegistryURLs,
    repulsion,
    toggleFixedNailModel
  }
})
