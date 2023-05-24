import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, shallowMount } from '@vue/test-utils'
import InstructionalText from '@/components/SpecialResolution/InstructionalText.vue'
import { VTooltip } from 'vuetify/lib'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('InstructionalText', () => {
  let wrapper

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component', () => {
    wrapper = shallowMount(InstructionalText, { vuetify })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the special resolution tooltip', async () => {
    // Mount displays the tool-tip-text.
    wrapper = mount(InstructionalText, { vuetify })
    const tooltip = wrapper.findComponent(VTooltip)
    expect(tooltip.exists()).toBe(true)
    const activator = wrapper.find('.tool-tip-text')
    expect(activator.exists()).toBe(true)
    expect(activator.text()).toBe('special resolution')
  })

  it('has the tooltip content', async () => {
    // Shallow mount has the tooltip content.
    wrapper = shallowMount(InstructionalText, { vuetify })
    const tooltip = wrapper.findComponent(VTooltip)
    const tooltipContent = tooltip.find('.tool-tip-content')
    expect(tooltipContent.exists()).toBe(true)
    expect(tooltipContent.text()).toContain('A decision voted on by the voting members')
  })
})
