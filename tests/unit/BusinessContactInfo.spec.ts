import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import BusinessContactInfo from '@/components/common/YourCompany/BusinessContactInfo.vue'
import AuthServices from '@/services/auth-services'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// mock services function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUpdateContactInfo = vi.spyOn((AuthServices as any), 'updateContactInfo').mockImplementation(() => {})

const contactInfo = {
  email: 'mock@example.com',
  confirmEmail: 'mock@example.com',
  phone: '250-123-4567'
}

describe('Business Contact Info for a Correction', () => {
  let wrapper: any

  const originalCorrectionContact = {
    email: 'mockCorrection@email.com',
    confirmEmail: 'mockCorrection@email.com',
    phone: '250-123-4567'
  }

  beforeAll(() => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.businessContact = contactInfo
    store.stateModel.entitySnapshot = {
      authInfo: {
        contact: originalCorrectionContact
      }
    } as any
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the CorrectBusinessContactInfo component', async () => {
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
  })

  it('loads the correct original contact info for a correction', async () => {
    expect(wrapper.vm.originalContact.email).toEqual(originalCorrectionContact.email)
    expect(wrapper.vm.originalContact.phone).toEqual(originalCorrectionContact.phone)
  })

  it('watches for business contact info changes ', async () => {
    // Verify there is a diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(true)

    // Call the set Contact method and set the data back to it's original
    wrapper.vm.onContactInfoChange(originalCorrectionContact)
    await Vue.nextTick()

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })
})

describe('Business Contact Info for an Alteration', () => {
  let wrapper: any

  const originalAlterationContact = {
    email: 'mockAlteration@email.com',
    confirmEmail: 'mockAlteration@email.com',
    phone: '250-123-4567',
    extension: '123'
  }

  beforeAll(async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    sessionStorage.setItem('AUTH_API_URL', `myhost/basePath/auth/`)
    store.stateModel.tombstone.businessId = 'BC1234567'
    store.stateModel.businessContact = contactInfo
    store.stateModel.entitySnapshot = { authInfo: { contact: originalAlterationContact } } as any
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the BusinessContactInfo component', async () => {
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
  })

  it('loads the correct original contact info', async () => {
    expect(wrapper.vm.originalContact.email).toEqual(originalAlterationContact.email)
    expect(wrapper.vm.originalContact.phone).toEqual(originalAlterationContact.phone)
  })

  it('watches for business contact info changes ', async () => {
    // Verify there is a diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(true)

    // Call the set Contact method and set the data back to it's original
    await wrapper.vm.onContactInfoChange(originalAlterationContact)

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })

  it('passes the correct label per filing type', async () => {
    // Verify there is a diff between current and original contact data
    expect(wrapper.vm.getEditSavedLabel).toBe('Changes Saved')

    // Call the set Contact method and set the data back to it's original
    await wrapper.vm.onContactInfoChange(originalAlterationContact)

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })
})

describe('Business Contact Info for a Change of Registration', () => {
  let wrapper: any

  const originalContact = {
    email: 'mock@example.com',
    confirmEmail: 'mock@example.com',
    phone: '250-123-4567',
    extension: '123'
  }

  beforeAll(async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    sessionStorage.setItem('AUTH_API_URL', `myhost/basePath/auth/`)
    store.stateModel.tombstone.businessId = 'BC1234567'
    store.stateModel.businessContact = contactInfo
    store.stateModel.entitySnapshot = { authInfo: { contact: originalContact } } as any
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the BusinessContactInfo component', async () => {
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
  })

  it('loads the correct original contact info', async () => {
    expect(wrapper.vm.originalContact.email).toEqual(originalContact.email)
    expect(wrapper.vm.originalContact.phone).toEqual(originalContact.phone)
  })

  it('watches for business contact info changes ', async () => {
    // Verify there is a diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(true)

    // Call the set Contact method and set the data back to it's original
    await wrapper.vm.onContactInfoChange(originalContact)

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })

  it('passes the correct label per filing type', async () => {
    // Verify there is a diff between current and original contact data
    expect(wrapper.vm.getEditSavedLabel).toBe('Changes Saved')

    // Call the set Contact method and set the data back to it's original
    await wrapper.vm.onContactInfoChange(originalContact)

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })
})
