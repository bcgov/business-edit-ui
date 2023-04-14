import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import mockRouter from './MockRouter'
import { AuthServices, LegalServices, PayServices } from '@/services/'
import { createLocalVue, mount } from '@vue/test-utils'
import LimitedRestorationExtension from '@/views/LimitedRestorationExtension.vue'
import RestorationSummary from '@/components/Restoration/RestorationSummary.vue'
import CertifySection from '@/components/common/CertifySection.vue'
import ListPeopleAndRoles from '@/components/common/PeopleAndRoles/ListPeopleAndRoles.vue'
import DocumentsDelivery from '@/components/common/DocumentsDelivery.vue'
import PeopleAndRoles from '@/components/common/PeopleAndRoles/PeopleAndRoles.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import YourCompany from '@/components/common/YourCompany/YourCompany.vue'
import YourCompanySummary from '@/components/Restoration/YourCompanySummary.vue'
import { BenRestorationResource } from '@/resources/LimitedRestorationExtension/BEN'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()
// mock data
const filing = {
  header: {
    name: 'restoration',
    status: 'DRAFT'
  },
  business: {
    identifier: 'BC1234567',
    legalName: '1234567 B.C. LTD.',
    legalType: 'BEN'
  },
  restoration: {
    expiry: '2023-02-28',
    type: 'limitedRestorationExtension'
  }
}
const businessInfo = {
  foundingDate: '2023-01-01T12:00:00+00:00',
  identifier: 'BC1234567',
  legalName: '1234567 B.C. LTD.',
  legalType: 'BEN',
  state: 'ACTIVE'
}
const authInfo = {
  businessIdentifier: 'BC1234567',
  contacts: [{
    email: 'aaa@bbb.ccc',
    phone: '(111) 222-3333',
    extension: '444'
  }]
}
const addresses = {
  recordsOffice: {
    deliveryAddress: {
      addressCity: 'Victoria',
      addressCountry: 'CA',
      addressRegion: 'BC',
      deliveryInstructions: null,
      id: 11111,
      postalCode: 'V1V 1V1',
      streetAddress: '111 Main Street',
      streetAddressAdditional: null
    },
    mailingAddress: {
      addressCity: 'Victoria',
      addressCountry: 'CA',
      addressRegion: 'BC',
      deliveryInstructions: null,
      id: 22222,
      postalCode: 'V2V 2V2',
      streetAddress: '222 Main Street',
      streetAddressAdditional: null
    }
  },
  registeredOffice: {
    deliveryAddress: {
      addressCity: 'Victoria',
      addressCountry: 'CA',
      addressRegion: 'BC',
      deliveryInstructions: null,
      id: 33333,
      postalCode: 'V3V 3V3',
      streetAddress: '333 Main Street',
      streetAddressAdditional: null
    },
    mailingAddress: {
      addressCity: 'Victoria',
      addressCountry: 'CA',
      addressRegion: 'BC',
      deliveryInstructions: null,
      id: 44444,
      postalCode: 'V4V 4V4',
      streetAddress: '444 Main Street',
      streetAddressAdditional: null
    }
  }
}
const nameTranslations = [
  {
    id: '100',
    name: 'ALIAS ONE',
    type: 'TRANSLATION'
  }
]
const directors = {
  directors: [
    {
      appointmentDate: '2023-01-01',
      cessationDate: null,
      deliveryAddress: {
        addressCity: 'Victoria',
        addressCountry: 'CA',
        addressRegion: 'BC',
        deliveryInstructions: null,
        id: 55555,
        postalCode: 'V5V 5V5',
        streetAddress: '555 Main Street',
        streetAddressAdditional: null
      },
      mailingAddress: {
        addressCity: 'Victoria',
        addressCountry: 'CA',
        addressRegion: 'BC',
        deliveryInstructions: null,
        id: 66666,
        postalCode: 'V6V 6V6',
        streetAddress: '666 Main Street',
        streetAddressAdditional: null
      },
      officer: {},
      role: 'applicant'
    }
  ]
}
const stateFiling = {
  header: {
    name: 'restoration',
    status: 'COMPLETED'
  },
  business: {
    identifier: 'BC1234567',
    legalName: '1234567 B.C. LTD.',
    legalType: 'BEN'
  },
  restoration: {
    expiry: '2023-01-31',
    type: 'limitedRestoration',
    parties: [
      {
        deliveryAddress: {
          addressCity: 'Victoria',
          addressCountry: 'CA',
          addressRegion: 'BC',
          deliveryInstructions: null,
          id: 55555,
          postalCode: 'V5V 5V5',
          streetAddress: '555 Main Street',
          streetAddressAdditional: null
        },
        mailingAddress: {
          addressCity: 'Victoria',
          addressCountry: 'CA',
          addressRegion: 'BC',
          deliveryInstructions: null,
          id: 66666,
          postalCode: 'V6V 6V6',
          streetAddress: '666 Main Street',
          streetAddressAdditional: null
        },
        officer: {},
        role: 'applicant'
      }
    ]
  }
}
const filingFees = {
  filingFees: 20.0
}

// init session storage variables
sessionStorage.setItem('PAY_API_URL', 'https://pay.api.url/')
sessionStorage.setItem('KEYCLOAK_TOKEN', 'keycloak-token') // anything non-falsy

describe('Restoration component - edit page', () => {
  const { assign } = window.location
  let wrapper: any

  const entitySnapshot = {
    businessInfo: {
      legalName: '1234567 B.C. LTD.',
      legalType: 'BEN',
      stateFiling: stateFiling
    }
  }

  beforeAll(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    // mock services function
    jest.spyOn((LegalServices as any), 'fetchFilingById').mockImplementation(
      () => Promise.resolve(filing))
    jest.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(
      () => Promise.resolve(businessInfo))
    jest.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(
      () => Promise.resolve(authInfo))
    jest.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(
      () => Promise.resolve(addresses))
    jest.spyOn((LegalServices as any), 'fetchNameTranslations').mockImplementation(
      () => Promise.resolve(nameTranslations))
    jest.spyOn((LegalServices as any), 'fetchDirectors').mockImplementation(
      () => Promise.resolve(directors))
    jest.spyOn((LegalServices as any), 'fetchFiling').mockImplementation(
      () => Promise.resolve(stateFiling))
    jest.spyOn((PayServices as any), 'fetchFilingFees').mockImplementation(
      () => Promise.resolve(filingFees))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    // init store
    store.stateModel.summaryMode = false
    store.stateModel.validationFlags.appValidate = false
    store.stateModel.tombstone.businessId = 'BC1234567' // normally set in App.vue
    store.stateModel.tombstone.keycloakRoles = ['staff'] // normally set in App.vue
    store.stateModel.tombstone.filingType = FilingTypes.RESTORATION
    store.stateModel.restoration = filing.restoration as any
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.entitySnapshot.businessInfo.stateFiling = stateFiling as any
    store.stateModel.businessInformation = { ...entitySnapshot.businessInfo } as any
    store.resourceModel = BenRestorationResource

    await router.push({ name: 'limitedRestorationExtension', query: { 'restoration-id': '1234' } })
    wrapper = mount(LimitedRestorationExtension, { localVue, router, vuetify })

    // enable filing and wait for all queries to complete
    await wrapper.setProps({ appReady: true })
    await flushPromises()
  })

  afterAll(() => {
    window.location.assign = assign
    jest.restoreAllMocks()
    wrapper.destroy()
  })

  it('renders the page correctly', () => {
    expect(wrapper.findComponent(LimitedRestorationExtension).exists()).toBe(true)
    expect(wrapper.find('#limited-restoration-extension').exists()).toBe(true)
    expect(wrapper.find('section header').text()).toBe('Limited Restoration Extension')
  })

  it('loads the entity snapshot into the store', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    const state = store.stateModel

    // Validate business identifier
    expect(state.tombstone.businessId).toBe('BC1234567')

    // Validate Business
    expect(state.businessInformation.legalType).toBe('BEN')
    expect(state.businessInformation.legalName).toBe('1234567 B.C. LTD.')
    // Travis Semple - stateFiling is defined as a string here, not an object. should be fixed.
    expect((state.businessInformation.stateFiling as any).restoration.type).toBe('limitedRestoration')
    expect((state.businessInformation.stateFiling as any).restoration.parties[0].role).toBe('applicant')
  })

  it('renders the Your Company component correctly', () => {
    expect(wrapper.findComponent(YourCompany).exists()).toBe(true)
  })

  it('renders the People And Roles component correctly', () => {
    expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(true)
    expect(wrapper.find('#people-and-roles').exists()).toBe(true)
  })
})

describe('Restoration component - summary page (with filing changes)', () => {
  const { assign } = window.location
  let wrapper: any

  const entitySnapshot = {
    businessInfo: {
      legalName: '1234567 B.C. LTD.',
      legalType: 'BEN',
      stateFiling: stateFiling
    }
  }

  beforeAll(async () => {
    // init store
    store.stateModel.summaryMode = true
    store.stateModel.validationFlags.appValidate = false
    store.stateModel.tombstone.businessId = 'BC1234567' // normally set in App.vue
    store.stateModel.tombstone.keycloakRoles = ['staff'] // normally set in App.vue
    store.stateModel.tombstone.filingType = FilingTypes.RESTORATION
    store.stateModel.restoration = filing.restoration as any
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.entitySnapshot.businessInfo.stateFiling = stateFiling as any
    store.stateModel.businessInformation = { ...entitySnapshot.businessInfo } as any
    store.resourceModel = BenRestorationResource

    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    // mock services function
    jest.spyOn((LegalServices as any), 'fetchFilingById').mockImplementation(
      () => Promise.resolve(filing))
    jest.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(
      () => Promise.resolve(businessInfo))
    jest.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(
      () => Promise.resolve(authInfo))
    jest.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(
      () => Promise.resolve(addresses))
    jest.spyOn((LegalServices as any), 'fetchNameTranslations').mockImplementation(
      () => Promise.resolve(nameTranslations))
    jest.spyOn((LegalServices as any), 'fetchDirectors').mockImplementation(
      () => Promise.resolve(directors))
    jest.spyOn((LegalServices as any), 'fetchFiling').mockImplementation(
      () => Promise.resolve(stateFiling))
    jest.spyOn((PayServices as any), 'fetchFilingFees').mockImplementation(
      () => Promise.resolve(filingFees))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'limitedRestorationExtension', query: { 'restoration-id': '1234' } })
    wrapper = mount(LimitedRestorationExtension, {
      localVue,
      router,
      vuetify,
      computed: { showFeeSummary: () => true },
      // FUTURE: make these components work
      stubs: { ListPeopleAndRoles: true,
        YourCompanySummary: true,
        DocumentsDelivery: true,
        CertifySection: true,
        StaffPayment: true }
    })

    // enable filing and wait for all queries to complete
    await wrapper.setProps({ appReady: true })
    await flushPromises()
  })

  afterAll(() => {
    window.location.assign = assign
    jest.restoreAllMocks()
    wrapper.destroy()
  })

  xit('renders the page correctly', () => {
    expect(wrapper.findComponent(LimitedRestorationExtension).exists()).toBe(true)
    // expect(wrapper.find('section header').text()).toBe('Review and Certify')
  })

  xit('renders the ListPeopleAndRoles component correctly for Applicant', () => {
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBe(true)
  })

  xit('renders the Documents Delivery component correctly', () => {
    expect(wrapper.findComponent(DocumentsDelivery).exists()).toBe(true)
  })

  xit('renders the Certify Section component correctly', () => {
    expect(wrapper.findComponent(CertifySection).exists()).toBe(true)
  })

  xit('renders the Staff Payment component correctly', () => {
    expect(wrapper.findComponent(StaffPayment).exists()).toBe(true)
  })
})

xdescribe('Restoration component - summary page (with no filing changes)', () => {
  const { assign } = window.location
  let wrapper: any

  beforeAll(async () => {
    // init store
    store.stateModel.summaryMode = true
    store.stateModel.validationFlags.appValidate = false
    store.stateModel.tombstone.businessId = 'BC1234567' // normally set in App.vue
    store.stateModel.tombstone.keycloakRoles = ['staff'] // normally set in App.vue

    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    // mock services function
    jest.spyOn((LegalServices as any), 'fetchFilingById').mockImplementation(
      () => Promise.resolve(filing))
    jest.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(
      () => Promise.resolve(businessInfo))
    jest.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(
      () => Promise.resolve(authInfo))
    jest.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(
      () => Promise.resolve(addresses))
    jest.spyOn((LegalServices as any), 'fetchNameTranslations').mockImplementation(
      () => Promise.resolve(nameTranslations))
    jest.spyOn((LegalServices as any), 'fetchDirectors').mockImplementation(
      () => Promise.resolve(directors))
    jest.spyOn((PayServices as any), 'fetchFilingFees').mockImplementation(
      () => Promise.resolve(filingFees))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'limitedRestorationToFull', query: { 'restoration-id': '1234' } })
    wrapper = mount(LimitedRestorationExtension, {
      localVue,
      router,
      vuetify,
      computed: { showFeeSummary: () => false },
      // FUTURE: make these components work
      stubs: { ListPeopleAndRoles: true,
        YourCompanySummary: true,
        DocumentsDelivery: true,
        CertifySection: true,
        StaffPayment: true }
    })

    // enable filing and wait for all queries to complete
    await wrapper.setProps({ appReady: true })
    await flushPromises()
  })

  afterAll(() => {
    window.location.assign = assign
    jest.restoreAllMocks()
    wrapper.destroy()
  })

  it('renders the page correctly', () => {
    expect(wrapper.findComponent(LimitedRestorationExtension).exists()).toBe(true)
    expect(wrapper.find('section header').text()).toBe('Review and Certify')
    expect(wrapper.find('section section').text()).toContain('You have deleted all')
    expect(wrapper.find('#done-button').exists()).toBe(true)
  })
})
