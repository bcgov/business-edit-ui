import Vue from 'vue'
import Vuetify from 'vuetify'
import sinon from 'sinon'
import { mount } from '@vue/test-utils'
import ChangeSummary from '@/components/Change/ChangeSummary.vue'
import NatureOfBusiness from '@/components/common/YourCompany/NatureOfBusiness.vue'
import OfficeAddresses from '@/components/common/YourCompany/OfficeAddresses.vue'
import { GpChangeResource } from '@/resources/Change/GP'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('Change Summary component', () => {
  let wrapper: any
  setActivePinia(createPinia())
  const store = useStore()

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
  } as any

  beforeAll(() => {
    // init store
    store.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.stateModel.tombstone.currentDate = '2021-03-01'
    store.stateModel.entitySnapshot = entitySnapshot
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    store.stateModel.businessInformation = { ...entitySnapshot.businessInfo }
    store.resourceModel = GpChangeResource
  })

  beforeEach(() => {
    // Set Original business Data
    store.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.stateModel.officeAddresses = addresses
    store.stateModel.summaryMode = true

    wrapper = mount(ChangeSummary, { vuetify })
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(ChangeSummary).exists()).toBe(true)
  })

  it('does not render the summary sections when no changes have been made', async () => {
    expect(wrapper.findComponent(NatureOfBusiness).exists()).toBe(false)
    expect(wrapper.find('#nob-summary-section').exists()).toBe(false)
  })

  it('renders the Nature of Business summary section when changes have been made', async () => {
    store.stateModel.businessInformation.naicsCode = '654321'
    await Vue.nextTick()

    expect(wrapper.find('#nob-summary-section').exists()).toBe(true)
  })

  it('renders the Address summary section when changes have been made', async () => {
    store.stateModel.officeAddresses = {}
    await Vue.nextTick()

    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
  })
})
