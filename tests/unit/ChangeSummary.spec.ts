// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import sinon from 'sinon'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { ChangeSummary } from '@/components/Edit'
import { OfficeAddresses } from '@/components/common'

Vue.use(Vuetify)
const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('Change Summary component', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const addresses = {
    registeredOffice: {
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

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'SP'
    },
    addresses: addresses
  }

  beforeAll(() => {
    // init store
    store.state.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.state.stateModel.tombstone.currentDate = '2021-03-01'
    store.state.stateModel.entitySnapshot = entitySnapshot
    store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
  })

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.state.stateModel.officeAddresses = addresses
    store.state.stateModel.summaryMode = true

    wrapper = mount(ChangeSummary, { vuetify, store, localVue })
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(ChangeSummary).exists()).toBe(true)
  })

  it('does not render the summary sections when no changes have been made', async () => {
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(false)
  })

  it('renders the type summary section when changes have been made', async () => {
    store.state.stateModel.officeAddresses = { }
    await Vue.nextTick()

    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
  })
})
