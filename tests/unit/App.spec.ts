import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils/'
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { FeeSummary as FeeSummaryShared } from '@bcrs-shared-components/fee-summary/'
import Actions from '@/components/common/Actions.vue'
import EntityInfo from '@/components/common/EntityInfo.vue'
import FileAndPayInvalidNameRequestDialog from '@/dialogs/FileAndPayInvalidNameRequestDialog.vue'
import AccountAuthorizationDialog from '@/dialogs/AccountAuthorizationDialog.vue'
import FetchErrorDialog from '@/dialogs/FetchErrorDialog.vue'
import PaymentErrorDialog from '@/dialogs/PaymentErrorDialog.vue'
import SaveErrorDialog from '@/dialogs/SaveErrorDialog.vue'
import NameRequestErrorDialog from '@/dialogs/NameRequestErrorDialog.vue'
import ConfirmDeleteAllDialog from '@/dialogs/ConfirmDeleteAllDialog.vue'
import ViewWrapper from '@/components/ViewWrapper.vue'
import mockRouter from './MockRouter'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { AuthorizationRoles, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import * as utils from '@/utils'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

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
    ]
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
  corpNum: null,
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  requestTypeCd: 'BC',
  names: [
    {
      choice: 1,
      consumptionDate: null,
      corpNum: null,
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

const mockAddresses = {
  businessOffice: {
    mailingAddress: {
      addressCity: 'Vancouver',
      addressCountry: 'Canada',
      addressRegion: 'BC',
      postalCode: 'V8V 8V8',
      streetAddress: '321 Electra'
    },
    deliveryAddress: {
      addressCity: 'Vancouver',
      addressCountry: 'Canada',
      addressRegion: 'BC',
      postalCode: 'V8V 8V8',
      streetAddress: '123 Electra'
    }
  }
}

const mockEntitySnapshot = {
  businessInfo: {
    legalName: 'Mock Original Name',
    legalType: 'SP'
  },
  addresses: {}
}

describe.skip('Numbered company setup', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'https://auth-web.url/')
  sessionStorage.setItem('AUTH_API_URL', 'https://auth-api.url/')
  sessionStorage.setItem('BUSINESS_DASH_URL', 'https://business-dash.url/')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: vi.fn() } as any

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

    // mock GetKeycloakRoles so we don't need a KC token
    vi.spyOn(utils, 'GetKeycloakRoles').mockImplementation(() => [AuthorizationRoles.PUBLIC_USER])

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'define-company', query: { id: 'T7654321' } })

    wrapper = shallowMount(App, { localVue, router, vuetify, stubs: { Affix: true } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('loads a draft filing into the store', () => {
    // Validate IA for numbered company
    expect(store.stateModel.tombstone.entityType).toBe('BEN')
    expect(store.stateModel.tombstone.filingId).toBe(54321)

    // Validate no offices are loaded
    expect(store.stateModel.officeAddresses).toBeDefined()
    expect(store.stateModel.officeAddresses.recordsOffice).toBeUndefined()

    // Validate Contact Info
    expect(store.stateModel.businessContact).toBeDefined()

    // Validate Share Structure
    expect(store.stateModel.shareStructureStep.shareClasses).toBeDefined()
  })

  it('does not load a name request into the store', () => {
    // Validate tombstone data
    expect(store.stateModel.tombstone.filingId).toBe(54321)

    // Validate no NR data
    expect(store.stateModel.nameRequest.nrNum).toEqual('')
    expect(store.stateModel.nameRequest.state).toBeUndefined()
    expect(store.stateModel.nameRequest.consentFlag).toBeUndefined()
    expect(store.stateModel.nameRequest.expirationDate).toBeUndefined()
    expect(store.stateModel.nameRequestLegalName).toBeNull()

    // Validate no NR Applicant
    expect(store.stateModel.nameRequest.applicants.firstName).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.middleName).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.lastName).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.emailAddress).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.phoneNumber).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.addrLine1).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.addrLine2).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.addrLine3).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.city).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.countryTypeCd).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.postalCd).toBeUndefined()
    expect(store.stateModel.nameRequest.applicants.stateProvinceCd).toBeUndefined()
  })
})

describe.skip('App component', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'https://auth-web.url/')
  sessionStorage.setItem('AUTH_API_URL', 'https://auth-api.url/')
  sessionStorage.setItem('BUSINESS_DASH_URL', 'https://business-dash.url/')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: vi.fn() } as any

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

    // GET NR data
    get.withArgs('nameRequests/NR 1234567/validate?phone=&email=')
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

    // mock GetKeycloakRoles so we don't need a KC token
    vi.spyOn(utils, 'GetKeycloakRoles').mockImplementation(() => [AuthorizationRoles.PUBLIC_USER])

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'define-company', query: { id: 'T1234567' } })

    wrapper = shallowMount(App, { localVue, router, vuetify, stubs: { Affix: true } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('gets user info properly', () => {
    expect(store.stateModel.tombstone.userEmail).toBe('completing-party@example.com')
  })

  it('loads a draft filing into the store', () => {
    // Validate Filing ID - set by fetchDraft()
    expect(store.stateModel.tombstone.filingId).toBe(12345)

    // Validate Entity Type
    expect(store.stateModel.tombstone.entityType).toBe('BEN')

    // Validate Office Addresses
    expect(store.stateModel.officeAddresses.registeredOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.registeredOffice)
    expect(store.stateModel.officeAddresses.recordsOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.stateModel.businessContact)
      .toStrictEqual(filingData.incorporationApplication.contactPoint)

    // Validate People And Roles
    expect(store.stateModel.peopleAndRoles.orgPeople)
      .toStrictEqual(filingData.incorporationApplication.parties)

    // Validate Share Structure
    expect(store.stateModel.shareStructureStep.shareClasses)
      .toStrictEqual(filingData.incorporationApplication.shareClasses)
  })

  it('loads a name request into the store', () => {
    // Validate tombstone data
    expect(store.stateModel.tombstone.entityType).toBe(nrData.requestTypeCd)
    expect(store.stateModel.tombstone.filingId).toBe(12345)

    // Validate NR data
    expect(store.stateModel.nameRequest.nrNum).toBe(nrData.nrNum)
    expect(store.stateModel.nameRequest.state).toBe(nrData.state)
    expect(store.stateModel.nameRequest.consentFlag).toBe(nrData.consentFlag)
    expect(store.stateModel.nameRequest.expirationDate).toBe(nrData.expirationDate)
    expect(store.stateModel.nameRequestLegalName).toBe(nrData.names[0].name)

    // Validate NR Applicant
    expect(store.stateModel.nameRequest.applicants.firstName).toBe(nrData.applicants.firstName)
    expect(store.stateModel.nameRequest.applicants.middleName).toBe(nrData.applicants.middleName)
    expect(store.stateModel.nameRequest.applicants.lastName).toBe(nrData.applicants.lastName)
    expect(store.stateModel.nameRequest.applicants.emailAddress).toBe(nrData.applicants.emailAddress)
    expect(store.stateModel.nameRequest.applicants.phoneNumber).toBe(nrData.applicants.phoneNumber)
    expect(store.stateModel.nameRequest.applicants.addrLine1).toBe(nrData.applicants.addrLine1)
    expect(store.stateModel.nameRequest.applicants.addrLine2).toBe(nrData.applicants.addrLine2)
    expect(store.stateModel.nameRequest.applicants.addrLine3).toBe(nrData.applicants.addrLine3)
    expect(store.stateModel.nameRequest.applicants.city).toBe(nrData.applicants.city)
    expect(store.stateModel.nameRequest.applicants.countryTypeCd).toBe(nrData.applicants.countryTypeCd)
    expect(store.stateModel.nameRequest.applicants.postalCd).toBe(nrData.applicants.postalCd)
    expect(store.stateModel.nameRequest.applicants.stateProvinceCd).toBe(nrData.applicants.stateProvinceCd)
  })

  it('shows confirm popup if exiting before saving changes', async () => {
    // simulate that we have unsaved changes
    store.stateModel.tombstone.haveUnsavedChanges = true

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
    store.stateModel.tombstone.haveUnsavedChanges = false

    // call Go To Dashboard event handler
    await wrapper.vm.goToDashboard()

    // verify that dialog does not exist
    const dialog = wrapper.find('.confirm-dialog')
    expect(dialog.exists()).toBe(false)

    // verify redirection
    const baseUrl = 'myhost/business/T1234567?accountid=668'
    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })
})

describe('App component - other', () => {
  let wrapper: any

  beforeAll(() => {
    sessionStorage.clear()
    sessionStorage.setItem('AUTH_API_URL', 'https://auth.api.url/')
    sessionStorage.setItem('KEYCLOAK_TOKEN', 'keycloak-token') // anything non-falsy
    sessionStorage.setItem('BUSINESS_ID', 'BC0007291')
    sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
  })

  beforeEach(async () => {
    const get = sinon.stub(axios, 'get')

    // GET current user
    get.withArgs('https://auth.api.url/users/@me')
      .returns(Promise.resolve({
        data:
        {
          contacts: [{
            email: 'completing-party@example.com'
          }]
        }
      }))

    // GET org info
    get.withArgs('https://auth.api.url/orgs/668')
      .returns(Promise.resolve({
        data: {
          mailingAddress: {
            city: 'Victoria',
            country: 'CA',
            postalCode: 'V8W 3E6',
            region: 'BC',
            street: '2-940 Blanshard St',
            streetAdditional: ''
          }
        }
      }))

    // mock GetKeycloakRoles so we don't need a KC token
    vi.spyOn(utils, 'GetKeycloakRoles').mockImplementation(() => [AuthorizationRoles.PUBLIC_USER])

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    wrapper = shallowMount(App, { localVue, router, vuetify, stubs: { Affix: true } })
  })

  afterEach(() => {
    sinon.restore()
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
    expect(wrapper.findComponent(FeeSummaryShared).exists()).toBe(false) // not displayed initially
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

  // FUTURE: fix this
  // atm it can't work because we are shallow-mounting App, so we only get a router view stub
  // also the comment on the expect statement doesn't match the test
  it.skip('the ViewWrapper renders the fee summary properly following changes', async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    store.stateModel.entitySnapshot = mockEntitySnapshot as any
    store.stateModel.officeAddresses = mockAddresses
    store.stateModel.filingData = {
      filingTypeCode: 'FMCHANGE',
      entityType: 'SP',
      priority: false,
      waiveFees: false
    } as any
    await Vue.nextTick()

    expect(wrapper.findComponent(ViewWrapper).exists()).toBe(true) // not displayed initially
  })
})
