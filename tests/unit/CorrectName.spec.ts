import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import CorrectName from '@/components/common/YourCompany/CorrectName/CorrectName.vue'
import CorrectCompanyName from '@/components/common/YourCompany/CorrectName/CorrectCompanyName.vue'
import CorrectNameRequest from '@/components/common/YourCompany/CorrectName/CorrectNameRequest.vue'
import CorrectNameToNumber from '@/components/common/YourCompany/CorrectName/CorrectNameToNumber.vue'

const vuetify = new Vuetify({})

describe('Correct Name component', () => {
  let wrapperFactory: any
  let correctNameChoices: any

  beforeEach(() => {
    wrapperFactory = (propsData = {}) => {
      return shallowMount(CorrectName, {
        propsData,
        vuetify
      })
    }
  })

  it('renders the appropriate choices for a numbered company', async () => {
    correctNameChoices = ['correct-new-nr']
    const wrapper = wrapperFactory({ correctNameChoices })
    await Vue.nextTick()

    // Verify correct components are rendered
    expect(wrapper.findComponent(CorrectName).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectNameRequest).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectCompanyName).exists()).toBe(false)
    expect(wrapper.findComponent(CorrectNameToNumber).exists()).toBe(false)

    wrapper.destroy()
  })

  it('renders the appropriate choices for a named company', async () => {
    correctNameChoices = ['correct-name', 'correct-new-nr', 'correct-name-to-number']
    const wrapper = wrapperFactory({ correctNameChoices })
    await Vue.nextTick()

    // Verify correct components are rendered
    expect(wrapper.findComponent(CorrectName).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectNameRequest).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectCompanyName).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectNameToNumber).exists()).toBe(true)

    const selectorTitles = wrapper.vm.$el.querySelectorAll('.names-option-title')
    const correctCompanyName = selectorTitles[0]
    const correctNameToNumber = selectorTitles[1]
    const correctNewNr = selectorTitles[2]

    expect(correctCompanyName.textContent).toBe('Edit the company name')
    expect(correctNameToNumber.textContent).toBe('Use the incorporation number as the name')
    expect(correctNewNr.textContent).toBe('Use a new name request number')

    wrapper.destroy()
  })
})
