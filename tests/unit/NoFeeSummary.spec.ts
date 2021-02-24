// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { NoFeeSummary } from '@/components/Summary'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()
const vuetify = new Vuetify({})

describe('NoFeeSummary', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const contactInfo = {
    email: 'mock@email.com',
    confirmEmail: 'mock@email.com',
    phone: '250-123-4567',
    extension: '456'
  }

  const originalAlterationContact = {
    email: 'mockAlteration@email.com',
    confirmEmail: 'mockAlteration@email.com',
    phone: '250-321-1234'
  }

  beforeAll(async () => {
    await router.push({ name: 'alteration' })
    store.state.stateModel.summaryMode = true
    store.state.stateModel.defineCompanyStep.businessContact = contactInfo
    store.state.stateModel.originalSnapshot[5] = originalAlterationContact
  })

  beforeEach(() => {
    wrapper = mount(NoFeeSummary, { vuetify, store, localVue, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the NoFeeSummary Component', async () => {
    expect(wrapper.find(NoFeeSummary).exists()).toBe(true)
  })

  it('displays the contact info when changes have been made', async () => {
    expect(wrapper.vm.hasContactInfoChange).toBe(true)
    expect(wrapper.find('#no-fee-summary').exists()).toBe(true)
    expect(wrapper.find('#lbl-email').text()).toBe('mock@email.com')
    expect(wrapper.find('#lbl-phone').text()).toContain('250-123-4567')
    expect(wrapper.find('#lbl-phone span').text()).toContain('Ext: 456')
  })

  it('hides the contact info when there is no changes', async () => {
    store.state.stateModel.defineCompanyStep.businessContact = originalAlterationContact
    await Vue.nextTick()

    expect(wrapper.vm.hasContactInfoChange).toBe(false)
    expect(wrapper.find('#no-fee-contact').exists()).toBe(false)
  })

  it('hides the NoFeeSummary Component when NOT in summaryMode', async () => {
    store.state.stateModel.summaryMode = false
    await Vue.nextTick()

    expect(wrapper.find('#no-fee-summary').exists()).toBe(false)
  })
})
