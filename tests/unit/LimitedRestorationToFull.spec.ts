import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { ActionTypes, FilingTypes } from '@/enums'
import { AuthServices, LegalServices, PayServices } from '@/services/'
import { shallowMount } from '@vue/test-utils'
import LimitedRestorationToFull from '@/views/LimitedRestorationToFull.vue'
import ViewWrapper from '@/components/ViewWrapper.vue'
import CertifySection from '@/components/common/CertifySection.vue'
import ListPeopleAndRoles from '@/components/common/PeopleAndRoles/ListPeopleAndRoles.vue'
import DocumentsDelivery from '@/components/common/DocumentsDelivery.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import YourCompanySummary from '@/components/Restoration/YourCompanySummary.vue'
import { BenRestorationResource } from '@/resources/LimitedRestorationToFull/BEN'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import {
  BusinessContactInfo, EntityName, FolioInformation, NameTranslation, OfficeAddresses, RecognitionDateTime,
  YourCompanyWrapper
} from '@/components/common'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

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
    type: 'limitedRestorationToFull'
  }
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
    approvalType: 'courtOrder',
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
        officer: {
          firstName: 'Adam',
          lastName: 'Smith',
          middleName: 'D',
          organizationName: '',
          partyType: 'person'
        },
        roles: [
          {
            roleType: 'Applicant'
          }
        ]
      }
    ]
  }
}
const businessInfo = {
  foundingDate: '2023-01-01T12:00:00+00:00',
  identifier: 'BC1234567',
  legalName: '1234567 B.C. LTD.',
  legalType: 'BEN',
  state: 'ACTIVE',
  stateFiling
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
const nameTranslations = [
  {
    id: '100',
    name: 'ALIAS ONE',
    type: 'TRANSLATION'
  }
]
const filingFees = {
  filingFees: 20.0
}
const newAddress = {
  mailingAddress: { deliveryInstructions: 'Test' }
}

// init session storage variables
sessionStorage.setItem('PAY_API_URL', 'https://pay.api.url/')
sessionStorage.setItem('KEYCLOAK_TOKEN', 'keycloak-token') // anything non-falsy

describe('Limited Restoration To Full component - edit page', () => {
  const { assign } = window.location
  let wrapper: any

  setActivePinia(createPinia())
  const store = useStore()

  const entitySnapshot = {
    businessInfo,
    addresses
  }

  beforeAll(async () => {
    // init store
    store.stateModel.summaryMode = false
    store.stateModel.validationFlags.appValidate = false
    store.stateModel.tombstone.businessId = 'BC1234567' // normally set in App.vue
    store.stateModel.tombstone.keycloakRoles = ['staff'] // normally set in App.vue
    store.stateModel.tombstone.filingType = FilingTypes.RESTORATION
    store.stateModel.restoration = filing.restoration as any
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.entitySnapshot.businessInfo.stateFiling = stateFiling as any
    store.stateModel.peopleAndRoles.orgPeople = stateFiling.restoration.parties[0] as any
    store.stateModel.businessInformation = { ...entitySnapshot.businessInfo } as any
    store.resourceModel = BenRestorationResource

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

    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    wrapper = shallowMount(LimitedRestorationToFull, {
      vuetify,
      computed: { showFeeSummary: () => false },
      propsData: {
        restorationId: 1234
      },
      mocks: { $route: { matched: [] } }
    })

    // enable filing and wait for all queries to complete
    await wrapper.setProps({ appReady: true })
    wrapper.vm.$data.isDataLoaded = true
    await wrapper.vm.$nextTick()

    await flushPromises()
  })

  afterAll(() => {
    window.location.assign = assign
    jest.restoreAllMocks()
    wrapper.destroy()
  })

  it('renders view and sub-components', () => {
    expect(wrapper.findComponent(LimitedRestorationToFull).exists()).toBe(true)
    expect(wrapper.findComponent(ViewWrapper).exists()).toBe(true)
    expect(wrapper.find('section header').text()).toBe('Conversion to Full Restoration')
    expect(wrapper.findComponent(YourCompanyWrapper).exists()).toBe(true)
    expect(wrapper.findComponent(EntityName).exists()).toBe(true)
    expect(wrapper.findComponent(NameTranslation).exists()).toBe(true)
    expect(wrapper.findComponent(RecognitionDateTime).exists()).toBe(true)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.findComponent(FolioInformation).exists()).toBe(true)
  })

  it('loads the entity snapshot into the store', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    setActivePinia(createPinia())
    const store = useStore()

    // Validate business identifier
    expect(store.stateModel.tombstone.businessId).toBe('BC1234567')

    // Validate Business
    expect(store.stateModel.businessInformation.legalType).toBe('BEN')
    expect(store.stateModel.businessInformation.legalName).toBe('1234567 B.C. LTD.')
    expect((store.stateModel.businessInformation.stateFiling as any).restoration.type).toBe('limitedRestoration')
    expect((store.stateModel.businessInformation.stateFiling as any).restoration.parties[0].roles[0].roleType)
      .toBe('Applicant')
  })
})

describe('Limited Restoration To Full component - summary page (with no filing changes)', () => {
  const { assign } = window.location
  let wrapper: any

  setActivePinia(createPinia())
  const store = useStore()

  const entitySnapshot = {
    businessInfo,
    addresses
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
    store.stateModel.peopleAndRoles.orgPeople = stateFiling.restoration.parties as any
    store.stateModel.tombstone.userInfo = {
      email: 'currentuser@mail.com',
      contacts: [{ email: 'currentuser@mail.com' }]
    }
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

    wrapper = shallowMount(LimitedRestorationToFull, {
      vuetify,
      computed: { showFeeSummary: () => true },
      propsData: {
        restorationId: 1234
      },
      mocks: { $route: { matched: [] } }
    })

    // enable filing and wait for all queries to complete
    await wrapper.setProps({ appReady: true })
    await wrapper.setData({ isDataLoaded: true })
    await wrapper.vm.$nextTick()

    await flushPromises()
  })

  afterAll(() => {
    window.location.assign = assign
    jest.restoreAllMocks()
    wrapper.destroy()
  })

  it('renders the page correctly and mounted components', () => {
    expect(wrapper.findComponent(LimitedRestorationToFull).exists()).toBe(true)
    expect(wrapper.find('section header').text()).toBe('Review and Certify')
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBe(true)
    expect(wrapper.findComponent(YourCompanySummary).exists()).toBe(true)
    expect(wrapper.findComponent(DocumentsDelivery).exists()).toBe(true)
    expect(wrapper.findComponent(CertifySection).exists()).toBe(true)
    expect(wrapper.findComponent(StaffPayment).exists()).toBe(true)
  })
})

describe('Limited Restoration To Full component - summary page (with filing changes)', () => {
  const { assign } = window.location
  let wrapper: any

  setActivePinia(createPinia())
  const store = useStore()

  const entitySnapshot = {
    businessInfo,
    addresses
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
    store.stateModel.peopleAndRoles.orgPeople = stateFiling.restoration.parties as any
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

    wrapper = shallowMount(LimitedRestorationToFull, {
      vuetify,
      computed: { showFeeSummary: () => true },
      propsData: {
        restorationId: 1234
      },
      mocks: { $route: { matched: [] } }
    })

    // enable filing and wait for all queries to complete
    await wrapper.setProps({ appReady: true })
    await wrapper.setData({ isDataLoaded: true })
    await wrapper.vm.$nextTick()

    await flushPromises()
  })

  afterAll(() => {
    window.location.assign = assign
    jest.restoreAllMocks()
    wrapper.destroy()
  })

  it('Returns correct flags with Address and Name translations changes', () => {
    store.stateModel.nameTranslations = [{ action: ActionTypes.ADDED }] as any
    expect(wrapper.vm.haveNameTranslationsChanged).toBe(true)

    store.stateModel.officeAddresses = { businessOffice: newAddress } as any
    expect(wrapper.vm.haveOfficeAddressesChanged).toBe(true)
  })
})
