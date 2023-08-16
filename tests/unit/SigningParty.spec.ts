import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import SigningParty from '@/components/SpecialResolution/SigningParty.vue'
import { useStore } from '@/store/store'
import { vi } from 'vitest'

const vuetify = new Vuetify({})

// Store required for component, although not read or modified in unit test.
setActivePinia(createPinia())
const store = useStore()

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
    await wrapper.vm.saveToStore()
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
      validateForm: vi.fn(),
      isDateValid: vi.fn().mockReturnValue(true)
    }

    wrapper.vm.setSpecialResolutionSignatureValid = vi.fn()

    wrapper.vm.onValidate()
    await Vue.nextTick()

    expect(wrapper.vm.setSpecialResolutionSignatureValid).toHaveBeenCalledWith(true)
  })

  it('Undo and save to store works as expected', async () => {
    // Fire isEditing / Save to store / undo to store
    const firstSignatoryDate = '2021-05-05'
    const firstSignatory = {
      givenName: 'John',
      familyName: 'Doe',
      additionalName: 'Smith'
    }
    wrapper.setData({ signatory: firstSignatory, signingDate: firstSignatoryDate })

    // This should save the local component state.
    await wrapper.setProps({ isEditing: true })

    const secondSignatory = {
      givenName: 'John2',
      familyName: 'Doe2',
      additionalName: 'Smith2'
    }
    const secondSignatoryDate = '2025-05-05'

    wrapper.setData({ signatory: secondSignatory, signingDate: secondSignatoryDate })

    await Vue.nextTick()

    // Called by parent component Resolution via ref
    await wrapper.vm.saveToStore()
    expect(store.getSpecialResolution.signatory).toEqual(secondSignatory)
    expect(store.getSpecialResolution.signingDate).toEqual(secondSignatoryDate)

    // Called by parent component Resolution via ref
    await wrapper.vm.undoToStore()
    expect(store.getSpecialResolution.signatory).toEqual(firstSignatory)
    expect(store.getSpecialResolution.signingDate).toEqual(firstSignatoryDate)
  })
})
