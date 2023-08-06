import { ref } from 'vue'

export function useForceUpdate() {
  const key = ref(0)

  const forceUpdate = () => {
    key.value++
  }

  return {
    key,
    forceUpdate
  }
}
