import { describe, test, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import Switch from '@/components/base/Switch/index.vue'

describe('base/Switch', async () => {
  vi.mock('vue-i18n', () => ({
    useI18n: () => ({
      t: (key: string) => (key.includes('on') ? '开' : '关')
    })
  }))

  const wrapper = mount(Switch, {
    props: { modelValue: true },
    mocks: {}
  })

  test('render', async ({ expect }) => {
    const switchButton = wrapper.find('button')
    expect(switchButton.exists()).toBe(true)
    expect(switchButton.attributes('title')).toBe('开')
  })

  test('click', async ({ expect }) => {
    const switchButton = wrapper.find('button')
    await switchButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')

    await wrapper.setProps({ modelValue: false })
    expect(switchButton.attributes('title')).toBe('关')
  })
})
