import { createLocalVue, shallowMount } from '@vue/test-utils'
import HelpSectionToggle from '@/components/Alteration/HelpSectionToggle.vue'

const localVue = createLocalVue()

describe('HelpSectionToggle component', () => {
  it('toggles the help section when clicked', async () => {
    const wrapper = shallowMount(HelpSectionToggle, { localVue })
    expect(wrapper.vm.isHelpVisible).toBe(false)
    await wrapper.setData({ isHelpVisible: true })
    await localVue.nextTick()
    expect(wrapper.vm.isHelpVisible).toBe(true)
  })
})
