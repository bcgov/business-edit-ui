import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { mount, Wrapper } from '@vue/test-utils'
import CorrectCompanyName from '@/components/common/YourCompany/CorrectName/CorrectCompanyName.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

function getLastEvent (wrapper: Wrapper<CorrectCompanyName>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

describe('CorrectCompanyName', () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.stateModel.nameRequestLegalName = 'Bobs Plumbing'

    wrapperFactory = (propsData = {}) => {
      return mount(CorrectCompanyName, {
        propsData,
        vuetify
      })
    }
  })

  it('renders the CorrectCompanyName Component', async () => {
    const wrapper = wrapperFactory()

    expect(wrapper.findComponent(CorrectCompanyName).exists()).toBe(true)

    wrapper.destroy()
  })

  it('verifies the text field populated from store', async () => {
    const wrapper = wrapperFactory()
    const companyNameInput = wrapper.find('#company-name-input')

    await flushPromises()

    // Verify data from Store
    expect(companyNameInput.element.value).toBe('Bobs Plumbing')
    expect(getLastEvent(wrapper, 'valid')).toBe(true)

    wrapper.destroy()
  })

  it('verifies it is invalid with no Company Name', async () => {
    const wrapper = wrapperFactory()
    const companyNameInput = wrapper.find('#company-name-input')
    wrapper.vm.companyName = null

    await flushPromises()

    // Verify data from Store
    expect(companyNameInput.element.value).toBe('')
    expect(getLastEvent(wrapper, 'valid')).toBe(false)

    wrapper.destroy()
  })

  it('verifies the done emission when the change is complete', async () => {
    const wrapper = wrapperFactory()
    const companyNameInput = wrapper.find('#company-name-input')
    wrapper.vm.companyName = 'Bob\'s Plumbing Ltd.'

    await flushPromises()

    // Verify data from Store
    expect(companyNameInput.element.value).toBe('Bob\'s Plumbing Ltd.')
    expect(getLastEvent(wrapper, 'valid')).toBe(true)

    // Submit Change
    await wrapper.setProps({ formType: 'correct-name' })
    await flushPromises()

    expect(getLastEvent(wrapper, 'saved')).toBe(true)

    // Verify Data change in store
    expect(wrapper.vm.getNameRequestLegalName).toBe('Bob\'s Plumbing Ltd.')

    wrapper.destroy()
  })
})
