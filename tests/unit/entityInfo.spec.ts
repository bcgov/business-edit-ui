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
document.body.setAttribute('data-app', 'true')

describe('Entity Info component in a Correction as a named company', () => {
  let wrapper
  let store

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
      parties: [],
      shareClasses: [],
      incorporationAgreement: {}
    }
  }

  beforeEach(() => {
    store = getVuexStore()
    let state = store.state.stateModel

    state.tombstone.keycloakRoles = ['staff']
    state.businessInformation = mockFiling.business
    state.tombstone.businessId = mockFiling.business.identifier
    state.defineCompanyStep.businessContact = mockFiling.incorporationApplication.contactPoint
    state.originalIA.incorporationApplication.nameRequest = mockFiling.incorporationApplication.nameRequest

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

  afterEach(async () => {
    await wrapper.destroy()
  })

  it('renders the EntityInfo Component', async () => {
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
  })

  it('displays the breadcrumb correctly as a named benefit company', async () => {
    const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

    const crumb1 = breadcrumbs.at(0)
    const divider = breadcrumbs.at(1) // Divider is present every odd index
    const crumb2 = breadcrumbs.at(2)
    const crumb3 = breadcrumbs.at(4)

    expect(crumb1.text()).toStrictEqual('Staff Dashboard')
    expect(divider.text()).toStrictEqual('>')
    expect(crumb2.text()).toStrictEqual('My Mock Name Inc.')
    expect(crumb3.text()).toStrictEqual('Correction - Incorporation Application')
  })

  it('renders the business name and numbers', async () => {
    expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
      .toContain('My Mock Name Inc.')

    expect(wrapper.vm.$el.querySelector('#entity-business-number').textContent)
      .toContain('1234567')

    expect(wrapper.vm.$el.querySelector('#entity-incorp-number').textContent)
      .toContain('BC1234567')
  })

  it('renders the business contact information', async () => {
    expect(wrapper.vm.$el.querySelector('#entity-business-email').textContent)
      .toContain('mock@email.com')

    expect(wrapper.vm.$el.querySelector('#entity-business-phone').textContent)
      .toContain('123-456-7890')
  })
})

describe('Entity Info component in a Correction as a numbered company', () => {
  let wrapper
  let store

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
        phone: '123-456-7890'
      },
      nameRequest: {},
      offices: {},
      parties: [],
      shareClasses: [],
      incorporationAgreement: {}
    }
  }

  beforeEach(() => {
    store = getVuexStore()
    let state = store.state.stateModel

    state.tombstone.keycloakRoles = ['staff']
    state.businessInformation = mockFiling.business
    state.tombstone.businessId = mockFiling.business.identifier
    state.defineCompanyStep.businessContact = mockFiling.incorporationApplication.contactPoint
    state.originalIA.incorporationApplication.nameRequest = mockFiling.incorporationApplication.nameRequest

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

  afterEach(async () => {
    await wrapper.destroy()
  })

  it('renders the EntityInfo Component', async () => {
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
  })

  it('displays the breadcrumb correctly as a named benefit company', async () => {
    const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

    const crumb1 = breadcrumbs.at(0)
    const divider = breadcrumbs.at(1) // Divider is present every odd index
    const crumb2 = breadcrumbs.at(2)
    const crumb3 = breadcrumbs.at(4)

    expect(crumb1.text()).toStrictEqual('Staff Dashboard')
    expect(divider.text()).toStrictEqual('>')
    expect(crumb2.text()).toStrictEqual('Numbered Benefit Company')
    expect(crumb3.text()).toStrictEqual('Correction - Incorporation Application')
  })

  it('renders the business name and numbers', async () => {
    expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
      .toContain('Numbered Benefit Company')

    expect(wrapper.vm.$el.querySelector('#entity-business-number').textContent)
      .toContain('7654321')

    expect(wrapper.vm.$el.querySelector('#entity-incorp-number').textContent)
      .toContain('BC7654321')
  })

  it('renders the business contact information', async () => {
    expect(wrapper.vm.$el.querySelector('#entity-business-email').textContent)
      .toContain('mock@email.com')

    expect(wrapper.vm.$el.querySelector('#entity-business-phone').textContent)
      .toContain('123-456-7890')
  })
})
