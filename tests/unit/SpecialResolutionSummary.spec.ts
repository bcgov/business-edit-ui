import Vue from 'vue'
import Vuetify from 'vuetify'
import { SpecialResolutionSummary } from '@/components/SpecialResolution'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CoopTypes } from '@/enums'
import VSanitize from 'v-sanitize'

Vue.use(Vuetify)
Vue.use(VSanitize)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Special Resolution Review', () => {
  let wrapper: any

  beforeEach(() => {
    store.stateModel.entitySnapshot = {
      ...store.stateModel.entitySnapshot,
      businessDocuments: {
        documents: {
          certifiedMemorandum: 'url',
          certifiedRules: 'url'
        },
        documentsInfo: {
          certifiedMemorandum: {
            key: 'key',
            name: 'name',
            includedInResolution: false,
            uploaded: '2022-01-01T08:00:00.000000+00:00'
          },
          certifiedRules: {
            key: 'key2',
            name: 'name2',
            includedInResolution: false,
            uploaded: '2022-01-01T08:00:00.000000+00:00'
          }
        }
      }
    }
    store.stateModel.rules = {}
    store.stateModel.memorandum = {}
    wrapper = mount(SpecialResolutionSummary, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders multiple fees', async () => {
    store.stateModel.currentFees = [{
      'filingFees': 70.0,
      'filingType': 'Special resolution',
      'filingTypeCode': 'SPRLN',
      'futureEffectiveFees': 0,
      'priorityFees': 0,
      'processingFees': 0,
      'serviceFees': 0,
      'tax': {
        'gst': 0,
        'pst': 0
      },
      'total': 70.0
    },
    {
      'filingFees': 70.0,
      'filingType': 'Special resolution',
      'filingTypeCode': 'SPRLN',
      'futureEffectiveFees': 0,
      'priorityFees': 0,
      'processingFees': 0,
      'serviceFees': 0,
      'tax': {
        'gst': 0,
        'pst': 0
      },
      'total': 70.0
    }]
    // Next tick is needed here, because the data wont update in component until next tick.
    await Vue.nextTick()
    expect(wrapper.find('.summary-title').text()).toBe('Summary of Changes to File')

    store.stateModel.currentFees = [{
      filingFees: null,
      filingType: null,
      filingTypeCode: null,
      futureEffectiveFees: null,
      priorityFees: null,
      processingFees: null,
      serviceFees: null,
      tax: {
        pst: null,
        gst: null
      },
      total: null
    }]
    // Next tick is needed here, because the data wont update in component until next tick.
    await Vue.nextTick()
    expect(wrapper.find('.summary-title').text()).toBe('Summary of Changes to File')
  })

  it('business name', async () => {
    store.stateModel.nameRequest.legalName = 'Mock name'
    store.stateModel.nameRequest.nrNumber = 'NR 12345678'
    await Vue.nextTick()
    expect(wrapper.find('.company-name').text()).toBe('Mock name')
    expect(wrapper.find('.company-nr').text()).toBe('NR 12345678')
  })

  it('association type', async () => {
    store.stateModel.businessInformation.associationType = CoopTypes.HOUSING_COOPERATIVE
    await Vue.nextTick()
    expect(wrapper.find('#association-description').text()).toBe('Housing Cooperative')
  })

  it('rules', async () => {
    await store.setSpecialResolutionRules({
      ...store.getSpecialResolutionRules,
      includedInResolution: true
    })
    expect(wrapper.find('#rules-included-resolution').text()).toContain('described in the special resolution')
    await store.setSpecialResolutionRules({
      ...store.getSpecialResolutionRules,
      key: '123',
      name: '12',
      includedInResolution: false
    })
    expect(wrapper.find('#rules-uploaded').text()).toBe('12')
  })

  it('memorandum', async () => {
    await store.setSpecialResolutionMemorandum({
      ...store.getSpecialResolutionMemorandum,
      includedInResolution: true
    })
    expect(wrapper.find('#memorandum-included-resolution').text()).toContain('described in the special resolution')
  })
})
