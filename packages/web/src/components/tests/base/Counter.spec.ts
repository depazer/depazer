import { describe, test } from 'vitest'

import { mount } from '@vue/test-utils'
import Counter from '@/components/base/Counter/index.vue'

describe.concurrent('base/Counter', async () => {
  test('render', async ({ expect }) => {
    const wrapper = mount(Counter, {
      props: {
        modelValue: 10
      }
    })

    expect(wrapper.findAll('button').length).toBe(2)
    expect(wrapper.find('input').exists()).toBe(true)

    const counterInput = wrapper.find('input')
    expect(counterInput.element.value).toBe('10')

    await counterInput.setValue('30')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([30])

    const counterButtons = wrapper.findAll('button')
    await counterButtons[0].trigger('click')
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([9])

    await counterButtons[1].trigger('click')
    expect(wrapper.emitted()['update:modelValue'][2]).toEqual([11])
  })

  test.concurrent('render with min and max', async ({ expect }) => {
    const wrapper = mount(Counter, {
      props: {
        modelValue: 100,
        min: -600,
        max: 400
      }
    })

    const counterInput = wrapper.find('input')
    expect(counterInput.element.value).toBe('100')

    const inputTest = test.extend({
      inputTest: async ({ inputValue, expected }: { inputValue: string; expected: number }) => {
        await counterInput.setValue(inputValue)
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([expected])
      }
    })

    describe.each([
      ['-700', -600],
      ['-600', -600],
      ['-90000', -600]
    ])(`input value %s`, async (inputValue, expected) => {
      inputTest('inputTest', ({ inputTest }) => inputTest({ inputValue, expected }))
    })

    describe.each([
      ['500', 400],
      ['400', 400],
      ['90000', 400]
    ])(`input value %s`, async (inputValue, expected) => {
      inputTest('inputTest', ({ inputTest }) => inputTest({ inputValue, expected }))
    })

    describe.each([
      ['abc', 0],
      ['-', 0],
      ['--', 0]
    ])(`input value %s`, async (inputValue, expected) => {
      inputTest('inputTest', ({ inputTest }) => inputTest({ inputValue, expected }))
    })
  })
})
