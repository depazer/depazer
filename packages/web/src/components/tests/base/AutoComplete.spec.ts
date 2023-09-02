import { describe, expect, test } from 'vitest'

import { mount } from '@vue/test-utils'
import AutoComplete from '@/components/base/AutoComplete/index.vue'

describe('base/AutoComplete', async () => {
  const wrapper = mount(AutoComplete, {
    props: {
      modelValue: '',
      placeholder: '请输入',
      data: ['aaa', 'aab', 'abc']
    }
  })

  test('render', async ({ expect }) => {
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('请输入')
    expect(wrapper.find('ul').isVisible()).toBe(false)
  })

  test('input event', async ({ expect }) => {
    const input = wrapper.find('input')
    input.element.value = 'a'
    await input.trigger('input')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['a'])

    await wrapper.setProps({ modelValue: 'aa' })
    expect(wrapper.findAll('li').length).toBe(3)
    setTimeout(() => {
      expect(wrapper.find('li')).toBe(3)
    }, 1000)
  })

  test('focus event', async () => {
    const input = wrapper.find('input')
    await input.trigger('focus')
    const li = wrapper.findAll('li')
    expect(li.length).toBe(3)
  })

  test('change event', async () => {
    const input = wrapper.find('input')
    input.element.value = 'aa'
    await input.trigger('change')
    expect(wrapper.find('ul').isVisible()).toBe(false)
    expect(wrapper.emitted()['change'][0]).toEqual(['aa'])
  })

  test('select options', async () => {
    await wrapper.setProps({
      moduleValue: 'a',
      placeholder: '请输入',
      data: ['aaa', 'aab', 'abc']
    })
    const input = wrapper.find('input')
    await input.trigger('focus')

    const li = wrapper.find('li')
    expect(li.exists()).toBe(true)
    await li.trigger('mousedown')
    expect(wrapper.emitted()['change'][1]).toEqual(['aaa'])
  })
})
