import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { mount, Wrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import CorrectNameRequestStaff from '@/components/common/YourCompany/CorrectName/CorrectNameRequestStaff.vue'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = vi.fn()

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

function getLastEvent (wrapper: Wrapper<any>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

describe('CorrectNameRequestStaff', () => {
  const wrapperFactory = (propsData = {}) => {
    return mount(CorrectNameRequestStaff, {
      propsData,
      vuetify
    })
  }

  beforeAll(() => {
    sessionStorage.setItem('LEGAL_API_URL', 'https://legal-api.url/')
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
  })

  it('renders the CorrectNameRequestStaff Component', async () => {
    const wrapper = wrapperFactory()

    expect(wrapper.findComponent(CorrectNameRequestStaff).exists()).toBe(true)

    wrapper.destroy()
  })

  it('verify the text fields and there label', async () => {
    const wrapper = wrapperFactory()

    const textFields = wrapper.findAll('.text-input-field')
    const nrInput = textFields.at(0)

    expect(nrInput.text()).toContain('Enter the NR Number')

    wrapper.destroy()
  })

  it('verifies inputs when valid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567'

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(vm.nameRequestNumber).toEqual('NR 1234567')

    wrapper.destroy()
  })

  // the spaces between 'NR' and the numbers are ignored
  it('verifies valid NR input', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR   1234567'

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(vm.nameRequestNumber).toEqual('NR 1234567')

    wrapper.destroy()
  })

  it('verifies invalid NR', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '123123NR'

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  // the leading or trailing spaces of a NR are invalid
  it('verifies invalid NR', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = '   NR 1234567'

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  // the leading or trailing spaces are invalid
  it('verifies invalid NR', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567    '

    await flushPromises()

    expect(vm.isFormValid).toBe(false)

    wrapper.destroy()
  })

  it('emits true when the form is valid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = 'NR 1234567'

    await flushPromises()

    expect(vm.isFormValid).toBe(true)
    expect(getLastEvent(wrapper, 'valid')).toBe(true)

    wrapper.destroy()
  })

  it('emits false when the form is invalid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    // Verify Invalid before input
    expect(vm.isFormValid).toBe(false)

    vm.nameRequestNumber = ''

    await flushPromises()

    expect(vm.isFormValid).toBe(false)
    expect(getLastEvent(wrapper, 'valid')).toBe(false)

    wrapper.destroy()
  })
})
