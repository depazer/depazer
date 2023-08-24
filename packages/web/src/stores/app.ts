export const useAppStore = defineStore('app', () => {
  const npmRegistryURLs = ['https://registry.npmmirror.com/', 'https://registry.npmjs.cf/']
  const currentRegistry = ref<string>(npmRegistryURLs[0])

  /** @desc 设置卡片可见性 */
  const settingCardVisible = ref<boolean>(false)
  /** @desc 依赖包信息卡片可见性 */
  const packageInfoCardVisible = ref<boolean>(false)
  /** @desc 循环依赖包信息卡片可见性 */
  const loopDependencyCardVisible = ref<boolean>(false)
  function toggleLoopDependencyVisible() {
    if (loopDependencyCardVisible.value === false) {
      settingCardVisible.value = false
      packageInfoCardVisible.value = false
    }

    loopDependencyCardVisible.value = !loopDependencyCardVisible.value
  }

  /** @desc 节点拖拽后是否禁止节点移动 */
  const fixedNailModel = ref<boolean>(false)
  const toggleFixedNailModel = useToggle(fixedNailModel)
  /** @desc 斥力大小 */
  const repulsion = ref<number>(5000)

  return {
    settingCardVisible,
    packageInfoCardVisible,
    loopDependencyCardVisible,
    toggleLoopDependencyVisible,

    currentRegistry,
    fixedNailModel,
    npmRegistryURLs,
    repulsion,
    toggleFixedNailModel
  }
})
