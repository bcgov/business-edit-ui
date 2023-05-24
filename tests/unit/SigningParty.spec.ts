import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import SigningParty from '@/components/SpecialResolution/SigningParty.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// Store required for component, although not read or modified in unit test.
setActivePinia(createPinia())

describe('SigningParty', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SigningParty, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('initializes with empty signatory and signingDate', () => {
    expect(wrapper.vm.signatory).toEqual({
      givenName: '',
      familyName: '',
      additionalName: ''
    })
    expect(wrapper.vm.signingDate).toBe('')
  })

  it('sets the signing date when onSigningDate is called', async () => {
    const date = '2023-05-08'
    await wrapper.vm.onSigningDate(date)
    expect(wrapper.vm.signingDate).toBe(date)
    expect(wrapper.vm.getSpecialResolution.signingDate).toBe(date)
  })

  it('updates the signatory when onSignatoryChanged is called', async () => {
    const signatory = {
      givenName: 'John',
      familyName: 'Doe',
      additionalName: 'Smith'
    }
    wrapper.setData({ signatory })
    await wrapper.vm.onSignatoryChanged()
    expect(wrapper.vm.getSpecialResolution.signatory).toEqual(signatory)
  })

  it('validates the form onValidate is called', async () => {
    const signatory = {
      givenName: 'John',
      familyName: 'Doe',
      additionalName: 'Smith'
    }
    const signingDate = '2023-01-01'
    wrapper.setData({ signatory, signingDate })
    wrapper.vm.$refs.signatureDatePickerRef = {
      validateForm: jest.fn(),
      isDateValid: jest.fn().mockReturnValue(true)
    }

    wrapper.vm.setSpecialResolutionSignatureValid = jest.fn()

    wrapper.vm.onValidate()
    await Vue.nextTick()

    expect(wrapper.vm.setSpecialResolutionSignatureValid).toHaveBeenCalledWith(true)
  })
})
