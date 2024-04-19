import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { mount, Wrapper } from '@vue/test-utils'
import CorrectNameToNumber from '@/components/common/YourCompany/CorrectName/CorrectNameToNumber.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

function getLastEvent (wrapper: Wrapper<CorrectNameToNumber>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

describe('CorrectNameToNumber', () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.stateModel.nameRequest = {
      legalType: CorpTypeCd.BENEFIT_COMPANY
    } as any
    store.stateModel.nameRequestLegalName = 'Bobs Plumbing'

    wrapperFactory = (propsData = {}) => {
      return mount(CorrectNameToNumber, {
        propsData,
        vuetify
      })
    }
  })

  it('renders the CorrectNameToNumber Component', async () => {
    const wrapper = wrapperFactory()

    expect(wrapper.findComponent(CorrectNameToNumber).exists()).toBe(true)

    wrapper.destroy()
  })

  it('verifies the checkbox default state', async () => {
    const wrapper = wrapperFactory()
    const nameToNumberInput = wrapper.find('#correct-name-to-number-checkbox')

    await Vue.nextTick()

    // Verify data from Store
    expect(nameToNumberInput.attributes('aria-checked')).toBe('false')
    expect(wrapper.emitted('valid')).toBeUndefined()
    expect(store.stateModel.nameRequestLegalName).toBe('Bobs Plumbing')

    wrapper.destroy()
  })

  it('verifies the emission when checkbox state changes', async () => {
    const wrapper = wrapperFactory()
    const nameToNumberInput = wrapper.find('#correct-name-to-number-checkbox')

    await Vue.nextTick()

    // Verify data from Store
    expect(nameToNumberInput.attributes('aria-checked')).toBe('false')
    expect(wrapper.emitted('valid')).toBeUndefined()

    // Select Name to Number Checkbox
    await nameToNumberInput.trigger('click')

    // Verify local state change and event emission
    expect(nameToNumberInput.attributes('aria-checked')).toBe('true')
    expect(getLastEvent(wrapper, 'valid')).toBe(true)
    expect(store.stateModel.nameRequest.legalType).toBe('BEN')
    expect(store.stateModel.nameRequestLegalName).toBe('Bobs Plumbing')

    wrapper.destroy()
  })

  it('verifies the form submission and verify global state changes', async () => {
    const wrapper = wrapperFactory({})
    const nameToNumberInput = wrapper.find('#correct-name-to-number-checkbox')

    // await Vue.nextTick()

    // Verify data from Store
    expect(nameToNumberInput.attributes('aria-checked')).toBe('false')
    expect(wrapper.emitted('valid')).toBeUndefined()

    // Select Name to Number Checkbox
    await nameToNumberInput.trigger('click')

    // Verify local state change and event emission
    expect(nameToNumberInput.attributes('aria-checked')).toBe('true')
    expect(getLastEvent(wrapper, 'valid')).toBe(true)
    expect(store.stateModel.nameRequestLegalName).toBe('Bobs Plumbing')

    // Submit Change
    await wrapper.setProps({ formType: 'correct-name-to-number' })
    await flushPromises()

    expect(getLastEvent(wrapper, 'saved')).toBe(true)

    // Verify Data change in store
    expect(store.stateModel.nameRequest.legalType).toBe('BEN')
    expect(store.stateModel.nameRequest.nrNum).toBeUndefined()
    expect(store.stateModel.nameRequestLegalName).toBeNull()

    wrapper.destroy()
  })
})
