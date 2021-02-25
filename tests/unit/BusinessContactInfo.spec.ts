// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import sinon from 'sinon'
import { axios } from '@/utils'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, createWrapper, mount } from '@vue/test-utils'
import { BusinessContactInfo } from '@/components/YourCompany'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()
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
    await router.push({ name: 'correction' })
    store.state.stateModel.defineCompanyStep.businessContact = contactInfo
    store.state.stateModel.originalIA.incorporationApplication.contactPoint = originalCorrectionContact
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify, store, localVue, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the CorrectBusinessContactInfo Component', async () => {
    expect(wrapper.find(BusinessContactInfo).exists()).toBe(true)
  })

  it('loads the correct original contact info for a correction', async () => {
    expect(wrapper.vm.originalContact.email).toEqual(originalCorrectionContact.email)
    expect(wrapper.vm.originalContact.phone).toEqual(originalCorrectionContact.phone)
  })

  it('watches for business contact info changes ', async () => {
    // Verify there is a diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(true)

    // Call the set Contact method and set the data back to it's original
    wrapper.vm.setContact(originalCorrectionContact)
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
    .returns(new Promise(resolve => resolve({
      resolve
    })))

  const originalAlterationContact = {
    email: 'mockAlteration@email.com',
    confirmEmail: 'mockAlteration@email.com',
    phone: '250-123-4567',
    extension: '123'
  }

  beforeAll(async () => {
    await router.push({ name: 'alteration' })
    sessionStorage.setItem('AUTH_API_URL', `myhost/basePath/auth/`)
    store.state.stateModel.tombstone.businessId = 'BC1234567'
    store.state.stateModel.defineCompanyStep.businessContact = contactInfo
    store.state.stateModel.originalSnapshot[5] = originalAlterationContact
  })

  beforeEach(async () => {
    wrapper = mount(BusinessContactInfo, { vuetify, store, localVue, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the CorrectBusinessContactInfo Component', async () => {
    expect(wrapper.find(BusinessContactInfo).exists()).toBe(true)
  })

  it('loads the correct original contact info for an alteration', async () => {
    expect(wrapper.vm.originalContact.email).toEqual(originalAlterationContact.email)
    expect(wrapper.vm.originalContact.phone).toEqual(originalAlterationContact.phone)
  })

  it('watches for business contact info changes ', async () => {
    // Verify there is a diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(true)

    // Call the set Contact method and set the data back to it's original
    wrapper.vm.setContact(originalAlterationContact)
    await flushPromises()

    // Verify there is NO diff between current and original contact data
    expect(wrapper.vm.hasBusinessContactInfoChange).toBe(false)
  })
})
