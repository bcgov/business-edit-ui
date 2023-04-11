import Vue from 'vue'
import Vuetify from 'vuetify'
import { SpecialResolutionSummary } from '@/components/SpecialResolution'
import { getVuexStore } from '@/store/'
import { createLocalVue, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)

const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('Special Resolution Review', () => {
  let wrapper: any
  setActivePinia(createPinia())
  const store = useStore()

  beforeEach(() => {
    wrapper = mount(SpecialResolutionSummary, { vuetify, localVue })
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
})
