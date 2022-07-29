import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, createWrapper, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { getVuexStore } from '@/store/'
import { StartDate } from '@/components/common/YourCompany'
import { DatePicker } from '@bcrs-shared-components/date-picker'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const localVue = createLocalVue()
localVue.use(VueRouter)

const router: any = mockRouter.mock()
const store: any = getVuexStore()

describe('Start Date', () => {
  let wrapper: any

  const correctionInformation = {
    comment: 'Test',
    correctedFilingId: 1,
    correctedFilingDate: '2021-01-01T00:00:00.000000+00:00',
    correctedFilingType: 'correction',
    type: 'STAFF',
    startDate: ''
  }

  beforeEach(async () => {
    store.state.stateModel.businessInformation.foundingDate = '2021-07-01T00:00:00.000000+00:00'
    wrapper = mount(StartDate, { store, vuetify, localVue, router })
    await flushPromises()
  })

  it('render the component correctly for change filings', async () => {
    store.state.stateModel.tombstone.filingType = 'change'
    await router.push({ name: 'change' })
    await Vue.nextTick()

    expect(wrapper.find('.pr-2').text()).toBe('Business Start Date')
    expect(wrapper.find('.info-text').text()).toBe('Unknown')
    expect(wrapper.find('#start-changes-btn').exists()).toBe(false)
  })

  it('renders the component correctly for correction filings', async () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    await router.push({ name: 'correction' })
    await Vue.nextTick()

    expect(wrapper.find('.pr-2').text()).toBe('Business Start Date')
    expect(wrapper.find('.info-text').text()).toBe('Unknown')
    expect(wrapper.find('#start-changes-btn').text()).toBe('Correct')
  })

  it('startDate component displays/hides date picker', async () => {
    const correctBtn = wrapper.find('#start-changes-btn')
    await correctBtn.trigger('click')

    const cancelBtn = wrapper.find('#start-cancel-btn')
    expect(cancelBtn.text()).toBe('Cancel')
    expect(wrapper.find('#start-done-btn').text()).toBe('Done')
    expect(wrapper.find('.start-date-title').text()).toBe('Start Date')
    expect(wrapper.find('.dotted-underline').text()).toBe('no more than 2 years in the past')
    expect(wrapper.findComponent(DatePicker).exists()).toBe(true)
    await cancelBtn.trigger('click')

    expect(wrapper.findComponent(DatePicker).exists()).toBe(false)
  })

  it('component to display corrected badge and undo btn for corrected filings', async () => {
    await wrapper.setData({ isCorrected: true }) // setting the correction flag
    await Vue.nextTick()

    expect(wrapper.find('.v-chip__content').text()).toBe('Corrected')
    expect(wrapper.find('#start-undo-btn').text()).toBe('Undo')
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
