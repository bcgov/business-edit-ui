// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import mockRouter from './MockRouter'
import VueRouter from 'vue-router'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { BusinessContactInfo, FolioNumber, OfficeAddresses, YourCompany } from '@/components/YourCompany'
import { CorrectNameOptions } from '@/components/YourCompany/CompanyName'
import flushPromises from 'flush-promises';

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()

const vuetify = new Vuetify({})

describe('YourCompany in a Correction', () => {
  let wrapper: any
  let store: any = getVuexStore()

  beforeAll(() => {
    router.push({ name: 'correction' })
  })

  beforeEach(() => {
    wrapper = mount(YourCompany, { vuetify, store, localVue, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the YourCompany Component and default subcomponents', async () => {
    expect(wrapper.find(YourCompany).exists()).toBe(true)
    expect(wrapper.find(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.find(OfficeAddresses).exists()).toBe(true)

    // Not a premium account
    expect(wrapper.find(FolioNumber).exists()).toBe(false)

    // Not currently editing Company Name
    expect(wrapper.find(CorrectNameOptions).exists()).toBe(false)
  })

  it('renders the FolioNumber Component and account is premium', async () => {
    store.state.stateModel.accountInformation.accountType = 'PREMIUM'
    await Vue.nextTick()

    expect(wrapper.find(FolioNumber).exists()).toBe(true)
  })

  it('renders the CORRECT label for editing a name option', async () => {
    const editLabel = wrapper.find('#btn-correct-company-name').text()
    expect(editLabel).toBe('Correct')
  })

  it('renders the CorrectNameOptions when correcting Company Name', async () => {
    // Click the `Correct` btn
    wrapper.find('#btn-correct-company-name').trigger('click')
    await Vue.nextTick()

    expect(wrapper.find(CorrectNameOptions).exists()).toBe(true)
  })
})

describe.only('YourCompany in an Alteration', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const originalSnapShot = [
    {
      business: {
        legalName: 'Mock Original Name',
        legalType: 'BEN'
      }
    }
  ]

  beforeAll(() => {
    router.push({ name: 'alteration' })
  })

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.nameRequest.legalName = originalSnapShot[0].business.legalName
    store.state.stateModel.tombstone.entityType = originalSnapShot[0].business.legalType
    store.state.stateModel.originalSnapshot = originalSnapShot

    wrapper = mount(YourCompany, { vuetify, store, localVue, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the YourCompany Component and default subcomponents', async () => {
    expect(wrapper.find(YourCompany).exists()).toBe(true)
    expect(wrapper.find(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.find(OfficeAddresses).exists()).toBe(true)

    // Not a premium account
    expect(wrapper.find(FolioNumber).exists()).toBe(false)

    // Not currently editing Company Name
    expect(wrapper.find(CorrectNameOptions).exists()).toBe(false)
  })

  it('renders the FolioNumber Component and account is premium', async () => {
    store.state.stateModel.accountInformation.accountType = 'PREMIUM'
    await Vue.nextTick()

    expect(wrapper.find(FolioNumber).exists()).toBe(true)
  })

  it('renders the CHANGE label for editing a name option', async () => {
    const editLabel = wrapper.find('#btn-correct-company-name').text()
    expect(editLabel).toBe('Change')
  })

  it('renders the CorrectNameOptions when correcting Company Name', async () => {
    // Click the `Correct` btn
    wrapper.find('#btn-correct-company-name').trigger('click')
    await Vue.nextTick()

    expect(wrapper.find(CorrectNameOptions).exists()).toBe(true)
  })

  it('displays the business type and message after changing to a numbered Company', async () => {
    expect(wrapper.find('.company-name').text()).toBe('Mock Original Name')

    // Set new Name
    store.state.stateModel.nameRequest.legalName = 'BC1234567 B.C. Ltd.'
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.company-info')

    expect(wrapper.find('.company-name').text()).toBe('BC1234567 B.C. Ltd.')
    expect(companyInfo.at(0).text()).toBe('Business Type:  BC Benefit Company')
    expect(companyInfo.at(1).text()).toBe('The name of this business will be the current Incorporation ' +
      'Number followed by "B.C. Ltd."')
  })

  it('displays the Name Request information when NR data changes', async () => {
    store.state.stateModel.nameRequest.nrNumber = 'NR1234567'
    store.state.stateModel.nameRequest.legalType = 'BEN'
    store.state.stateModel.nameRequest.expiry = 'Wed, 10 Mar 2021 07:59:00 GMT'
    store.state.stateModel.nameRequest.status = 'APPROVED'
    store.state.stateModel.nameRequest.applicant.fullName = 'Mock Full Name'
    store.state.stateModel.nameRequest.applicant.address = '123 Mock Lane, Victoria, BC, 1t2 3t4, CA'
    store.state.stateModel.nameRequest.applicant.phoneNumber = '250 123-4567'
    await Vue.nextTick()

    const companyInfo = wrapper.findAll('.company-info')

    expect(companyInfo.at(0).text()).toBe('Business Type:  BC Benefit Company')
    expect(companyInfo.at(1).text()).toBe('Request Type:  New Business')
    expect(companyInfo.at(2).text()).toBe('Expiry Date:  Tue Mar 09 2021')
    expect(companyInfo.at(3).text()).toBe('Status:  APPROVED')

    const nameRequestApplicantInfo = wrapper.findAll('.name-request-applicant-info')

    expect(nameRequestApplicantInfo.at(0).text()).toBe('Name:  Mock Full Name')
    expect(nameRequestApplicantInfo.at(1).text()).toBe('Address:  123 Mock Lane, Victoria, BC, 1t2 3t4, CA')
    expect(nameRequestApplicantInfo.at(2).text()).toBe('Email:  N/A')
    expect(nameRequestApplicantInfo.at(3).text()).toBe('Phone:  250 123-4567')

  })
})
