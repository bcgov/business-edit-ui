import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store/'
import CorrectNameToNumber from '@/components/common/YourCompany/CompanyName/CorrectNameToNumber.vue'

Vue.use(Vuetify)

function getLastEvent (wrapper: Wrapper<CorrectNameToNumber>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

describe('CorrectNameToNumber', () => {
  let vuetify: any
  let wrapperFactory: any
  let store: any = getVuexStore()

  beforeEach(() => {
    vuetify = new Vuetify({})

    store.state.stateModel.nameRequest.legalName = 'Bobs Plumbing'
    store.state.stateModel.tombstone.businessId = 'BC 1234567'
    store.state.stateModel.tombstone.entityType = 'BEN'

    wrapperFactory = (props: any) => {
      return mount(CorrectNameToNumber, {
        propsData: {
          props
        },
        store,
        vuetify
      })
    }
  })

  it('renders the CorrectNameToNumber Component', async () => {
    const wrapper = wrapperFactory()

    expect(wrapper.findComponent(CorrectNameToNumber).exists()).toBe(true)
  })

  it('verifies the checkbox default state', async () => {
    const wrapper = wrapperFactory()
    const nameToNumberInput = wrapper.find('#correct-name-to-number-checkbox')

    await Vue.nextTick()

    // Verify data from Store
    expect(nameToNumberInput.attributes('aria-checked')).toBe('false')
    expect(wrapper.emitted('isValid')).toBeUndefined()
    expect(store.state.stateModel.nameRequest.legalName).toBe('Bobs Plumbing')
  })

  it('verifies the emission when checkbox state changes', async () => {
    const wrapper = wrapperFactory()
    const nameToNumberInput = wrapper.find('#correct-name-to-number-checkbox')

    await Vue.nextTick()

    // Verify data from Store
    expect(nameToNumberInput.attributes('aria-checked')).toBe('false')
    expect(wrapper.emitted('isValid')).toBeUndefined()

    // Select Name to Number Checkbox
    nameToNumberInput.trigger('click')

    await Vue.nextTick()

    // Verify local state change and event emission
    expect(nameToNumberInput.attributes('aria-checked')).toBe('true')
    expect(getLastEvent(wrapper, 'isValid')).toBe(true)
    expect(store.state.stateModel.nameRequest.legalType).toBeNull()
    expect(store.state.stateModel.nameRequest.legalName).toBe('Bobs Plumbing')
  })

  it('verifies the form submission and verify global state change', async () => {
    const wrapper = wrapperFactory()
    const nameToNumberInput = wrapper.find('#correct-name-to-number-checkbox')

    await Vue.nextTick()

    // Verify data from Store
    expect(nameToNumberInput.attributes('aria-checked')).toBe('false')
    expect(wrapper.emitted('isValid')).toBeUndefined()

    // Select Name to Number Checkbox
    nameToNumberInput.trigger('click')

    await Vue.nextTick()

    // Verify local state change and event emission
    expect(nameToNumberInput.attributes('aria-checked')).toBe('true')
    expect(getLastEvent(wrapper, 'isValid')).toBe(true)
    expect(store.state.stateModel.nameRequest.legalName).toBe('Bobs Plumbing')

    // Submit Change
    await wrapper.setProps({ formType: 'correct-name-to-number' })
    await flushPromises()

    expect(getLastEvent(wrapper, 'done')).toBe(true)

    // Verify Data change in store
    expect(store.state.stateModel.nameRequest.legalType).toBe('BEN')
    expect(store.state.stateModel.nameRequest.legalName).toBeUndefined()
  })
})
