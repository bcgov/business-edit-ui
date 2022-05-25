import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
import { mount } from '@vue/test-utils'
import BusinessContactInfo from '@/components/common/YourCompany/BusinessContactInfo.vue'
import AuthServices from '@/services/auth-services'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// mock services function
const mockUpdateContactInfo = jest.spyOn((AuthServices as any), 'updateContactInfo').mockImplementation()

const contactInfo = {
  email: 'mock@email.com',
  confirmEmail: 'mock@email.com',
  phone: '250-123-4567'
}

describe('BusinessContactInfo for a Correction', () => {
  let wrapper: any

  const originalCorrectionContact = {
    email: 'mockCorrection@email.com',
    confirmEmail: 'mockCorrection@email.com',
    phone: '250-123-4567'
  }

  beforeAll(async () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.businessContact = contactInfo
    store.state.stateModel.originalIA.incorporationApplication.contactPoint = originalCorrectionContact
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the CorrectBusinessContactInfo Component', async () => {
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

describe('BusinessContactInfo for an Alteration', () => {
  let wrapper: any

  const originalAlterationContact = {
    email: 'mockAlteration@email.com',
    confirmEmail: 'mockAlteration@email.com',
    phone: '250-123-4567',
    extension: '123'
  }

  beforeAll(async () => {
    store.state.stateModel.tombstone.filingType = 'alteration'
    sessionStorage.setItem('AUTH_API_URL', `myhost/basePath/auth/`)
    store.state.stateModel.tombstone.businessId = 'BC1234567'
    store.state.stateModel.businessContact = contactInfo
    store.state.stateModel.entitySnapshot = { authInfo: { contact: originalAlterationContact } }
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the BusinessContactInfo Component', async () => {
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
    expect(wrapper.vm.editSavedLabel).toBe('Changes Saved')

    // Call the set Contact method and set the data back to it's original
    await wrapper.vm.onContactInfoChange(originalAlterationContact)

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })
})

describe('BusinessContactInfo for a Change of Registration', () => {
  let wrapper: any

  const originalContact = {
    email: 'mock@email.com',
    confirmEmail: 'mock@email.com',
    phone: '250-123-4567',
    extension: '123'
  }

  beforeAll(async () => {
    store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
    sessionStorage.setItem('AUTH_API_URL', `myhost/basePath/auth/`)
    store.state.stateModel.tombstone.businessId = 'BC1234567'
    store.state.stateModel.businessContact = contactInfo
    store.state.stateModel.entitySnapshot = { authInfo: { contact: originalContact } }
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the BusinessContactInfo Component', async () => {
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
    expect(wrapper.vm.editSavedLabel).toBe('Changes Saved')

    // Call the set Contact method and set the data back to it's original
    await wrapper.vm.onContactInfoChange(originalContact)

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })
})
