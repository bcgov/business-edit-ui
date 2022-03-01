// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import sinon from 'sinon'
import { axios } from '@/utils'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { BusinessContactInfo } from '@/components/common'

Vue.use(Vuetify)
const localVue = createLocalVue()
const vuetify = new Vuetify({})

const contactInfo = {
  email: 'mock@email.com',
  confirmEmail: 'mock@email.com',
  phone: '250-123-4567'
}

describe('BusinessContactInfo for a correction', () => {
  let wrapper: any
  let store: any = getVuexStore()

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
    wrapper = mount(BusinessContactInfo, { vuetify, store, localVue })
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

describe('CorrectBusinessContactInfo for an alteration', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const put = sinon.stub(axios, 'put')

  // Update Contact Info
  put.withArgs('myhost/basePath/auth/entities/BC1234567/contacts', contactInfo)

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
    store.state.stateModel.entitySnapshot = { authInfo: { contacts: [ originalAlterationContact ] } }
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify, store, localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the CorrectBusinessContactInfo Component', async () => {
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
  })

  it('loads the correct original contact info for an alteration', async () => {
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
})
