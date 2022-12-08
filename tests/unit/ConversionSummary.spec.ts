import Vue from 'vue'
import Vuetify from 'vuetify'
import sinon from 'sinon'
import { getVuexStore } from '@/store/'
import { createLocalVue, mount } from '@vue/test-utils'
import ConversionSummary from '@/components/Conversion/ConversionSummary.vue'
import NatureOfBusiness from '@/components/common/YourCompany/NatureOfBusiness.vue'
import OfficeAddresses from '@/components/common/YourCompany/OfficeAddresses.vue'
import { GpChangeResource } from '@/resources/Change/GP'

Vue.use(Vuetify)

const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('Conversion Summary component', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const addresses = {
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

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'SP',
      naicsCode: '123456',
      naicsDescription: 'Mock description'
    },
    addresses: addresses
  }

  beforeAll(() => {
    // init store
    store.state.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.state.stateModel.tombstone.currentDate = '2021-03-01'
    store.state.stateModel.entitySnapshot = entitySnapshot
    store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
    store.state.stateModel.businessInformation = { ...entitySnapshot.businessInfo }
    store.state.resourceModel = GpChangeResource
  })

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.state.stateModel.officeAddresses = addresses
    store.state.stateModel.summaryMode = true

    wrapper = mount(ConversionSummary, { vuetify, store, localVue })
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(ConversionSummary).exists()).toBe(true)
  })

  it('does not render the summary sections when no changes have been made', async () => {
    expect(wrapper.findComponent(NatureOfBusiness).exists()).toBe(false)
    expect(wrapper.find('#nob-summary-section').exists()).toBe(false)
  })

  it('renders the Nature of Business summary section when changes have been made', async () => {
    store.state.stateModel.businessInformation.naicsCode = '654321'
    await Vue.nextTick()

    expect(wrapper.find('#nob-summary-section').exists()).toBe(true)
    expect(wrapper.find('#nob-summary-section label').text()).toBe('Nature of Business')
    expect(wrapper.find('#nob-summary-section span').text()).toBe('654321 - Mock description')
  })

  it('renders the Address summary section when changes have been made', async () => {
    store.state.stateModel.officeAddresses = {}
    await Vue.nextTick()

    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
  })
})
