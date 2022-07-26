import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, createWrapper, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { getVuexStore } from '@/store/'
import { StartDate } from '@/components/common/YourCompany'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()
const store = getVuexStore()

describe('Start Date', () => {
  let wrapper: any

  beforeEach(async () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.correctionInformation.correctedFilingDate = '2021-01-01T00:00:00.000000+00:00'
    store.state.stateModel.businessInformation.foundingDate = '2021-07-01T00:00:00.000000+00:00'
    await router.push({ name: 'correction' })
    await Vue.nextTick()
    wrapper = mount(StartDate, { store, vuetify, localVue, router })
    await flushPromises()
  })

  it('renders the componenet and displays the data correctly', () => {
    expect(wrapper.find('.pr-2').text()).toBe('Business Start Date')
    expect(wrapper.find('.info-text').text()).toBe('Unknown')
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
