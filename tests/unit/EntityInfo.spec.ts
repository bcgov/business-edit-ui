// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { EntityInfo } from '@/components/common'

// Other
import mockRouter from './MockRouter'
import VueRouter from 'vue-router'

Vue.use(Vuetify)
const vuetify = new Vuetify({})
const store = getVuexStore()
let state = store.state.stateModel
document.body.setAttribute('data-app', 'true')

describe('Entity Info component in a Correction as a named company', () => {
  let wrapper: any

  const mockFiling = {
    header: {
      name: 'incorporationApplication',
      filingId: 12345
    },
    business: {
      identifier: 'BC1234567',
      legalType: 'BEN'
    },
    incorporationApplication: {
      contactPoint: {
        email: 'mock@email.com',
        phone: '123-456-7890'
      },
      nameRequest: {
        legalType: 'BEN',
        nrNumber: 'NR 1234567',
        legalName: 'My Mock Name Inc.'
      },
      offices: {},
      parties: [] as [],
      shareClasses: [] as [],
      incorporationAgreement: {}
    }
  }

  beforeAll(() => {
    state.tombstone.keycloakRoles = ['staff']
    state.businessInformation = mockFiling.business
    state.tombstone.businessId = mockFiling.business.identifier
    state.defineCompanyStep.businessContact = mockFiling.incorporationApplication.contactPoint
    state.originalIA.incorporationApplication.nameRequest = mockFiling.incorporationApplication.nameRequest
  })

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'correction' })

    wrapper = mount(EntityInfo, {
      localVue,
      vuetify,
      store,
      router
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the EntityInfo Component', () => {
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
  })

  it('displays the breadcrumb correctly as a named benefit company', () => {
    const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

    const crumb1 = breadcrumbs.at(0)
    const divider = breadcrumbs.at(1) // Divider is present every odd index
    const crumb2 = breadcrumbs.at(2)
    const crumb3 = breadcrumbs.at(4)

    expect(crumb1.text()).toBe('Staff Dashboard')
    expect(divider.text()).toBe('>')
    expect(crumb2.text()).toBe('My Mock Name Inc.')
    expect(crumb3.text()).toBe('Correction - Incorporation Application')
  })

  it('renders the business name and numbers', () => {
    expect(wrapper.find('#entity-legal-name').text()).toBe('My Mock Name Inc.')
    expect(wrapper.find('#entity-business-number').text()).toBe('1234567')
    expect(wrapper.find('#entity-incorp-number').text()).toBe('BC1234567')
  })

  it('renders the business contact information', () => {
    expect(wrapper.find('#entity-business-email').text()).toBe('mock@email.com')
    expect(wrapper.find('#entity-business-phone').text()).toBe('123-456-7890')
  })
})

describe('Entity Info component in a Correction as a numbered company', () => {
  let wrapper: any

  const mockFiling = {
    header: {
      name: 'incorporationApplication',
      filingId: 12345
    },
    business: {
      identifier: 'BC7654321',
      legalType: 'BEN'
    },
    incorporationApplication: {
      contactPoint: {
        email: 'mock@email.com',
        phone: '321-456-7890'
      },
      nameRequest: {},
      offices: {},
      parties: [] as [],
      shareClasses: [] as [],
      incorporationAgreement: {}
    }
  }

  beforeAll(() => {
    state.tombstone.keycloakRoles = ['staff']
    state.businessInformation = mockFiling.business
    state.tombstone.businessId = mockFiling.business.identifier
    state.defineCompanyStep.businessContact = mockFiling.incorporationApplication.contactPoint
    state.originalIA.incorporationApplication.nameRequest = mockFiling.incorporationApplication.nameRequest
  })

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'correction' })

    wrapper = mount(EntityInfo, {
      localVue,
      vuetify,
      store,
      router
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the EntityInfo Component', () => {
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
  })

  it('displays the breadcrumb correctly as a named benefit company', () => {
    const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

    const crumb1 = breadcrumbs.at(0)
    const divider = breadcrumbs.at(1) // Divider is present every odd index
    const crumb2 = breadcrumbs.at(2)
    const crumb3 = breadcrumbs.at(4)

    expect(crumb1.text()).toBe('Staff Dashboard')
    expect(divider.text()).toBe('>')
    expect(crumb2.text()).toBe('Numbered Benefit Company')
    expect(crumb3.text()).toBe('Correction - Incorporation Application')
  })

  it('renders the business name and numbers', () => {
    expect(wrapper.find('#entity-legal-name').text()).toBe('Numbered Benefit Company')
    expect(wrapper.find('#entity-business-number').text()).toBe('7654321')
    expect(wrapper.find('#entity-incorp-number').text()).toBe('BC7654321')
  })

  it('renders the business contact information', () => {
    expect(wrapper.find('#entity-business-email').text()).toBe('mock@email.com')
    expect(wrapper.find('#entity-business-phone').text()).toBe('321-456-7890')
  })
})
