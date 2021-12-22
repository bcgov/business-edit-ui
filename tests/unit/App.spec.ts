// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import { axios } from '@/utils'

// Components
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { FeeSummary } from '@bcrs-shared-components/fee-summary'
import { Actions, BreadCrumb, EntityInfo } from '@/components/common'
import {
  FileAndPayInvalidNameRequestDialog,
  AccountAuthorizationDialog,
  FetchErrorDialog,
  PaymentErrorDialog,
  SaveErrorDialog,
  NameRequestErrorDialog,
  ConfirmDeleteAllDialog
} from '@/components/dialogs'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

// Mock filing data
const filingData = {
  header: {
    name: 'incorporationApplication',
    filingId: 12345,
    status: 'DRAFT'
  },
  business: {
    identifier: 'T1234567',
    legalType: 'BEN'
  },
  incorporationApplication: {
    contactPoint: {
      email: 'registered-office@example.com',
      confirmEmail: 'registered-office@example.com',
      phone: '(250) 123-4567'
    },
    nameRequest: {
      legalType: 'BEN',
      nrNumber: 'NR 1234567',
      legalName: 'My Name Request Inc.'
    },
    offices: {
      registeredOffice: {
        deliveryAddress: {
          streetAddress: 'delivery_address - address line one',
          addressCity: 'delivery_address city',
          addressCountry: 'delivery_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        mailingAddress: {
          streetAddress: 'mailing_address - address line one',
          addressCity: 'mailing_address city',
          addressCountry: 'mailing_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        }
      },
      recordsOffice: {
        deliveryAddress: {
          streetAddress: 'delivery_address - address line one',
          addressCity: 'delivery_address city',
          addressCountry: 'delivery_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        mailingAddress: {
          streetAddress: 'mailing_address - address line one',
          addressCity: 'mailing_address city',
          addressCountry: 'mailing_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        }
      }
    },
    parties: [
      {
        officer: {
          id: 1,
          firstName: 'Joe',
          lastName: 'Swanson',
          middleName: 'P',
          organizationName: '',
          partyType: 'person',
          email: 'completing-party@example.com'
        },
        mailingAddress: {
          streetAddress: 'mailing_address-addresslineone',
          streetAddressAdditional: '',
          addressCity: 'mailing_addresscity',
          addressCountry: 'CA',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        deliveryAddress: {
          streetAddress: 'delivery_address-addresslineone',
          streetAddressAdditional: '',
          addressCity: 'delivery_addresscity',
          addressCountry: 'CA',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        appointmentDate: '2018-01-01',
        roles: [
          {
            roleType: 'CompletingParty',
            appointmentDate: '2018-01-01'
          },
          {
            roleType: 'Director',
            appointmentDate: '2018-01-01'
          }
        ]
      },
      {
        officer: {
          id: 2,
          firstName: '',
          lastName: '',
          middleName: '',
          organizationName: 'XyzInc.',
          partyType: 'organization'
        },
        mailingAddress: {
          streetAddress: 'mailing_address-addresslineone',
          streetAddressAdditional: '',
          addressCity: 'mailing_addresscity',
          addressCountry: 'CA',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        appointmentDate: '2018-01-01',
        roles: [
          {
            roleType: 'Incorporator',
            appointmentDate: '2018-01-01'
          }
        ]
      }
    ],
    shareClasses: [
      {
        id: 1,
        name: 'ShareClass1',
        priority: 1,
        hasMaximumShares: true,
        maxNumberOfShares: 100,
        hasParValue: true,
        parValue: 10,
        currency: 'CAD',
        hasRightsOrRestrictions: false,
        series: [
          {
            id: 1,
            name: 'ShareSeries1',
            priority: 1,
            hasMaximumShares: true,
            maxNumberOfShares: 50,
            hasRightsOrRestrictions: false
          },
          {
            id: 2,
            name: 'ShareSeries2',
            priority: 2,
            hasMaximumShares: true,
            maxNumberOfShares: 100,
            hasRightsOrRestrictions: false
          }
        ]
      },
      {
        id: 2,
        name: 'ShareClass2',
        priority: 1,
        hasMaximumShares: false,
        maxNumberOfShares: null,
        hasParValue: false,
        parValue: null,
        currency: null,
        hasRightsOrRestrictions: true,
        series: [

        ]
      }
    ],
    incorporationAgreement: {
      agreementType: 'sample'
    }
  }
}

// Mock NR data
const nrData = {
  applicants: {
    addrLine1: 'address line 1',
    addrLine2: 'address line 2',
    addrLine3: 'address line 3',
    city: 'Victoria',
    countryTypeCd: 'CA',
    emailAddress: 'tester@test.com',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Joe',
    phoneNumber: '250-111-2222',
    postalCd: 'V1V 1A2',
    stateProvinceCd: 'BC'
  },
  consentFlag: 'R',
  corpNum: null as string,
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  requestTypeCd: 'BC',
  names: [
    {
      choice: 1,
      consumptionDate: null as string,
      corpNum: null as string,
      name: 'ABC 1234',
      state: 'APPROVED'
    },
    {
      choice: 2,
      consumptionDate: null,
      corpNum: null,
      name: 'CDE 1234',
      state: 'NE'
    }
  ],
  nrNum: 'NR 1234567',
  state: 'APPROVED'
}

describe.skip('Numbered company setup', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/business/`)

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET current user
    get.withArgs('users/@me')
      .returns(Promise.resolve({
        data:
        {
          contacts: [{
            email: 'completing-party@example.com'
          }]
        }
      }))

    // GET authorizations (role)
    get.withArgs('entities/T7654321/authorizations')
      .returns(Promise.resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      }))

    // GET IA filing
    get.withArgs('businesses/T7654321/filings')
      .returns(Promise.resolve({
        data:
        {
          filing: {
            header: {
              name: 'incorporationApplication',
              filingId: 54321,
              status: 'DRAFT'
            },
            business: {
              identifier: 'T7654321',
              legalType: 'BEN'
            },
            incorporationApplication: {
              nameRequest: {
                legalType: 'BEN'
              }
            }
          }
        }
      }))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { id: 'T7654321' } })
    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true } })

    // wait for all queries to complete
    await flushPromises()
  })

  it('loads a draft filing into the store', () => {
    // Validate IA for numbered company
    expect(store.state.stateModel.tombstone.entityType).toBe('BEN')
    expect(store.state.stateModel.tombstone.filingId).toBe(54321)

    // Validate no offices are loaded
    expect(store.state.stateModel.officeAddresses).toBeDefined()
    expect(store.state.stateModel.officeAddresses.recordsOffice).toBeUndefined()

    // Validate Contact Info
    expect(store.state.stateModel.businessContact).toBeDefined()

    // Validate Share Structure
    expect(store.state.stateModel.shareStructureStep.shareClasses).toBeDefined()
  })

  it('does not load a name request into the store', () => {
    // All Name request specific fields should be empty
    expect(store.state.stateModel.nameRequest.nrNumber).toEqual('')
    expect(store.state.stateModel.tombstone.filingId).toBe(54321)

    // Validate no NR Details
    expect(store.state.stateModel.nameRequest.details.approvedName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.details.status).toBeUndefined()
    expect(store.state.stateModel.nameRequest.details.consentFlag).toBeUndefined()
    expect(store.state.stateModel.nameRequest.details.expirationDate).toBeUndefined()

    // Validate no NR Applicant
    expect(store.state.stateModel.nameRequest.applicant.firstName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.middleName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.lastName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.emailAddress).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.phoneNumber).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.addressLine1).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.addressLine2).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.addressLine3).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.city).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.countryTypeCode).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.postalCode).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.stateProvinceCode).toBeUndefined()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })
})

describe.skip('App component', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/business/`)

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET current user
    get.withArgs('users/@me')
      .returns(Promise.resolve({
        data:
        {
          contacts: [{
            email: 'completing-party@example.com'
          }]
        }
      }))

    // GET authorizations (role)
    get.withArgs('entities/T1234567/authorizations')
      .returns(Promise.resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      }))

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
        {
          ...nrData
        }
      }))

    // GET IA filing
    get.withArgs('businesses/T1234567/filings')
      .returns(Promise.resolve({
        data:
        {
          filing: {
            ...filingData
          }
        }
      }))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { id: 'T1234567' } })
    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('gets auth and user info properly', () => {
    expect(store.getters.isAuthEdit).toBe(true)
    expect(store.getters.isAuthView).toBe(true)
    expect(store.state.stateModel.tombstone.userEmail).toBe('completing-party@example.com')
  })

  it('loads a draft filing into the store', () => {
    // Validate Filing ID - set by fetchDraft()
    expect(store.state.stateModel.tombstone.filingId).toBe(12345)

    // Validate Entity Type
    expect(store.state.stateModel.tombstone.entityType).toBe('BEN')

    // Validate Office Addresses
    expect(store.state.stateModel.officeAddresses.registeredOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.registeredOffice)
    expect(store.state.stateModel.officeAddresses.recordsOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.state.stateModel.businessContact)
      .toStrictEqual(filingData.incorporationApplication.contactPoint)

    // Validate People And Roles
    expect(store.state.stateModel.peopleAndRolesStep.orgPeople)
      .toStrictEqual(filingData.incorporationApplication.parties)

    // Validate Share Structure
    expect(store.state.stateModel.shareStructureStep.shareClasses)
      .toStrictEqual(filingData.incorporationApplication.shareClasses)

    // Validate Incorporation Agreement
    expect(store.state.stateModel.incorporationAgreementStep.agreementType)
      .toStrictEqual(filingData.incorporationApplication.incorporationAgreement.agreementType)
  })

  it('loads a name request into the store', () => {
    // Validate Name Request
    expect(store.state.stateModel.tombstone.entityType).toBe(nrData.requestTypeCd)
    expect(store.state.stateModel.nameRequest.nrNumber).toBe(nrData.nrNum)
    expect(store.state.stateModel.tombstone.filingId).toBe(12345)
    expect(store.state.stateModel.nameRequest.details).toBeDefined()
    expect(store.state.stateModel.nameRequest.applicant).toBeDefined()

    // Validate NR Details
    expect(store.state.stateModel.nameRequest.details.approvedName).toBe(nrData.names[0].name)
    expect(store.state.stateModel.nameRequest.details.status).toBe(nrData.state)
    expect(store.state.stateModel.nameRequest.details.consentFlag).toBe(nrData.consentFlag)
    expect(store.state.stateModel.nameRequest.details.expirationDate).toBe(nrData.expirationDate)

    // Validate NR Applicant
    expect(store.state.stateModel.nameRequest.applicant.firstName).toBe(nrData.applicants.firstName)
    expect(store.state.stateModel.nameRequest.applicant.middleName).toBe(nrData.applicants.middleName)
    expect(store.state.stateModel.nameRequest.applicant.lastName).toBe(nrData.applicants.lastName)
    expect(store.state.stateModel.nameRequest.applicant.emailAddress).toBe(nrData.applicants.emailAddress)
    expect(store.state.stateModel.nameRequest.applicant.phoneNumber).toBe(nrData.applicants.phoneNumber)
    expect(store.state.stateModel.nameRequest.applicant.addressLine1).toBe(nrData.applicants.addrLine1)
    expect(store.state.stateModel.nameRequest.applicant.addressLine2).toBe(nrData.applicants.addrLine2)
    expect(store.state.stateModel.nameRequest.applicant.addressLine3).toBe(nrData.applicants.addrLine3)
    expect(store.state.stateModel.nameRequest.applicant.city).toBe(nrData.applicants.city)
    expect(store.state.stateModel.nameRequest.applicant.countryTypeCode).toBe(nrData.applicants.countryTypeCd)
    expect(store.state.stateModel.nameRequest.applicant.postalCode).toBe(nrData.applicants.postalCd)
    expect(store.state.stateModel.nameRequest.applicant.stateProvinceCode).toBe(nrData.applicants.stateProvinceCd)
  })

  it('shows confirm popup if exiting before saving changes', async () => {
    // simulate that we have unsaved changes
    store.state.stateModel.tombstone.haveUnsavedChanges = true

    // call Go To Dashboard event handler
    await wrapper.vm.goToDashboard()

    // verify that dialog is showing
    const dialog = wrapper.find('.confirm-dialog')
    expect(dialog.classes('v-dialog--active')).toBe(true)
    expect(dialog.isVisible()).toBe(true)
    expect(dialog.text()).toContain('You have unsaved changes')

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('redirects to dashboard if exiting after saving changes', async () => {
    // simulate that we have no unsaved changes
    store.state.stateModel.tombstone.haveUnsavedChanges = false

    // call Go To Dashboard event handler
    await wrapper.vm.goToDashboard()

    // verify that dialog does not exist
    const dialog = wrapper.find('.confirm-dialog')
    expect(dialog.exists()).toBe(false)

    // verify redirection
    const baseUrl = 'myhost/business/T1234567'
    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })
})

describe('App component - other', () => {
  let wrapper: any

  beforeEach(async () => {
    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true } })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the dialogs properly', () => {
    expect(wrapper.findComponent(FileAndPayInvalidNameRequestDialog).exists()).toBe(true)
    expect(wrapper.findComponent(AccountAuthorizationDialog).exists()).toBe(true)
    expect(wrapper.findComponent(FetchErrorDialog).exists()).toBe(true)
    expect(wrapper.findComponent(PaymentErrorDialog).exists()).toBe(true)
    expect(wrapper.findComponent(SaveErrorDialog).exists()).toBe(true)
    expect(wrapper.findComponent(NameRequestErrorDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmDeleteAllDialog).exists()).toBe(true)
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.findComponent(SbcHeader).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFooter).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFeeSummary).exists()).toBe(false) // not used for alterations
    expect(wrapper.findComponent(FeeSummary).exists()).toBe(false) // not displayed initially
    expect(wrapper.findComponent(SbcFooter).exists()).toBe(true)
    expect(wrapper.findComponent(EntityInfo).exists()).toBe(true)
    expect(wrapper.findComponent(Actions).exists()).toBe(false) // not used for alterations
  })

  it('initializes the local properties properly', () => {
    const vm: any = wrapper.vm
    expect(vm.accountAuthorizationDialog).toBe(false)
    expect(vm.fetchErrorDialog).toBe(false)
    expect(vm.paymentErrorDialog).toBe(false)
    expect(vm.saveErrorDialog).toBe(false)
    expect(vm.nameRequestErrorDialog).toBe(false)
    expect(vm.nameRequestErrorType).toBe('')
    expect(vm.saveErrors).toEqual([])
    expect(vm.saveWarnings).toEqual([])
    expect(vm.fileAndPayInvalidNameRequestDialog).toBe(false)
    expect(vm.confirmDeleteAllDialog).toBe(false)
  })
})
