import Vuetify from 'vuetify'
import { mount, shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HelpSectionToggle from '@/components/Alteration/HelpSectionToggle.vue'

const vuetify = new Vuetify({})

setActivePinia(createPinia())

describe('HelpSectionToggle component', () => {
  it('renders itself', () => {
    const wrapper = mount(HelpSectionToggle, { vuetify })

    expect(wrapper.findComponent(HelpSectionToggle).exists()).toBe(true)

    wrapper.destroy()
  })

  it('toggles the help section when clicked', async () => {
    const wrapper = shallowMount(HelpSectionToggle)
    const vm = wrapper.vm as any
    expect(vm.isHelpVisible).toBe(false)
    await wrapper.find('.help-toggle').trigger('click')
    await wrapper.vm.$nextTick()
    expect(vm.isHelpVisible).toBe(true)
  })
})
