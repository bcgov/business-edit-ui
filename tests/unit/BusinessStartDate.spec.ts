import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { BusinessStartDate } from '@/components/common/YourCompany'
import { DatePicker } from '@bcrs-shared-components/date-picker'
import flushPromises from 'flush-promises'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { FilingTypes } from '@/enums'

const vuetify = new Vuetify({})

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()

setActivePinia(createPinia())
const store = useStore()

describe('Business Start Date', () => {
  let wrapper: any

  beforeEach(async () => {
    store.stateModel.businessInformation.foundingDate = '2021-07-01T12:00:00.000000+00:00'
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    wrapper = mount(BusinessStartDate, { vuetify, localVue, router })
    await flushPromises()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component correctly for firm change filings', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    await router.push({ name: 'change' })
    await Vue.nextTick()

    expect(wrapper.find('.pr-2').text()).toBe('Business Start Date')
    expect(wrapper.find('.info-text').text()).toBe('(Not entered)')
    expect(wrapper.find('#start-changes-btn').exists()).toBe(false)
  })

  it('renders the component correctly for firm conversion filings', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CONVERSION
    await router.push({ name: 'conversion' })
    await Vue.nextTick()

    expect(wrapper.find('.pr-2').text()).toBe('Business Start Date')
    expect(wrapper.find('.info-text').text()).toBe('(Not entered)')
    expect(wrapper.find('#start-changes-btn').text()).toBe('Change')
  })

  it('renders the component correctly for firm correction filings', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    await router.push({ name: 'correction' })
    await Vue.nextTick()

    expect(wrapper.find('.pr-2').text()).toBe('Business Start Date')
    expect(wrapper.find('.info-text').text()).toBe('(Not entered)')
    expect(wrapper.find('#start-changes-btn').text()).toBe('Correct')
  })

  it('startDate component displays/hides date picker', async () => {
    const correctBtn = wrapper.find('#start-changes-btn')
    await correctBtn.trigger('click')

    const cancelBtn = wrapper.find('#start-cancel-btn')
    expect(cancelBtn.text()).toBe('Cancel')
    expect(wrapper.find('#start-done-btn').text()).toBe('Done')
    expect(wrapper.find('.start-date-title').text()).toBe('Start Date')
    expect(wrapper.find('.dotted-underline').text()).toBe('up to 10 years before the Registration Date')
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

  it('has correct minimum and maximum dates for a staff user ', () => {
    store.setKeycloakRoles(['staff'])

    expect(wrapper.vm.startDateMin).toBe(null) // no minimum date
    expect(wrapper.vm.startDateMax).toBe('2021-09-29') // 90 days after founding date
  })

  it('has correct minimum and maximum dates for a regular user', () => {
    store.setKeycloakRoles([])

    expect(wrapper.vm.startDateMin).toBe('2011-07-01') // 10 years before founding date
    expect(wrapper.vm.startDateMax).toBe('2021-09-29') // 90 days after founding date
  })
})
