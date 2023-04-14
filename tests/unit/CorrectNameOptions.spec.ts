import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import CorrectNameOptions from '@/components/common/YourCompany/CompanyName/CorrectNameOptions.vue'
import CorrectCompanyName from '@/components/common/YourCompany/CompanyName/CorrectCompanyName.vue'
import CorrectNameRequest from '@/components/common/YourCompany/CompanyName/CorrectNameRequest.vue'
import CorrectNameToNumber from '@/components/common/YourCompany/CompanyName/CorrectNameToNumber.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('CorrectNameOptions', () => {
  let wrapperFactory: any
  let correctionNameChoices: any

  beforeEach(() => {
    wrapperFactory = (propsData: any) => {
      return shallowMount(CorrectNameOptions, {
        propsData: {
          ...propsData
        },
        vuetify
      })
    }
  })

  it('renders the appropriate choices for a numbered company', async () => {
    correctionNameChoices = ['correct-new-nr']
    const wrapper = wrapperFactory({ correctionNameChoices })
    await Vue.nextTick()

    // Verify correct components are rendered
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectNameRequest).exists()).toBe(true)
    expect(wrapper.findComponent(CorrectCompanyName).exists()).toBe(false)
    expect(wrapper.findComponent(CorrectNameToNumber).exists()).toBe(false)
  })

  it('renders the appropriate choices for a named company', async () => {
    correctionNameChoices = ['correct-name', 'correct-new-nr', 'correct-name-to-number']
    const wrapper = wrapperFactory({ correctionNameChoices })
    await Vue.nextTick()

    // Verify correct components are rendered
    expect(wrapper.findComponent(CorrectNameOptions).exists()).toBe(true)
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
  })
})
