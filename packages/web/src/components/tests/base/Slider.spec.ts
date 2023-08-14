import { describe, test, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import Slider from '@/components/base/Slider/index.vue'

describe('base/Slider', async () => {
  test('render', async ({ expect }) => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 10
      }
    })

    const sliderButton = wrapper.find('button')
    expect(sliderButton.exists()).toBe(true)
    expect(sliderButton.attributes('title')).toBe('10%')

    await sliderButton.trigger('click')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([0])
  })

  test('render with min and max', async ({ expect }) => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 100,
        min: -600,
        max: 400
      }
    })

    const sliderButton = wrapper.find('button')
    expect(sliderButton.exists()).toBe(true)
    expect(sliderButton.attributes('title')).toBe('70%')

    await wrapper.setProps({ modelValue: -700 })
    expect(sliderButton.attributes('title')).toBe('0%')
  })

  test('mouse event', async ({ expect }) => {
    const wrapper = mount(Slider, {
      props: { modelValue: 10 }
    })

    const sliderButton = wrapper.find('button')
    ;(wrapper.getCurrentComponent().refs.slider as HTMLDivElement).getBoundingClientRect = () =>
      ({ width: 100, left: 0 }) as DOMRect

    const addEventListenerMock = vi.fn()
    const removeEventListenerMock = vi.fn()
    vi.stubGlobal('addEventListener', addEventListenerMock)
    vi.stubGlobal('removeEventListener', removeEventListenerMock)

    await sliderButton.trigger('click', { clientX: 35 })
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([35])

    await wrapper.trigger('mousemove')
    expect(addEventListenerMock).not.toHaveBeenCalled()
    expect(wrapper.emitted()['update:modelValue'][1]).toBeUndefined()

    await wrapper.find('button').trigger('mousedown')
    expect(addEventListenerMock).toHaveBeenCalled()
    expect(addEventListenerMock.mock.calls[0][0]).toBe('mousemove')
    expect(addEventListenerMock.mock.calls[1][0]).toBe('mouseup')

    const mousemoveHandler = addEventListenerMock.mock.calls[0][1]
    mousemoveHandler({ clientX: 35 })

    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([35])

    describe('mousemove', () => {
      test.each([
        [0, 0],
        [50, 50],
        [100, 100],
        [150, 100],
        [-50, 0]
      ])(`%s => %s`, async (clientX, expected) => {
        mousemoveHandler({ clientX })
        expect(wrapper.emitted()['update:modelValue'][2]).toEqual([expected])
      })
    })

    const mouseupHandler = addEventListenerMock.mock.calls[1][1]
    mouseupHandler()

    expect(removeEventListenerMock).toHaveBeenCalled()
    expect(removeEventListenerMock.mock.calls[0][0]).toBe('mousemove')
    expect(removeEventListenerMock.mock.calls[1][0]).toBe('mouseup')
  })
})
