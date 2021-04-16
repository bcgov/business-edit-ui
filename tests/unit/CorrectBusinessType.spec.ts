// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import mockRouter from './MockRouter'
import VueRouter from 'vue-router'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { CorrectBusinessType } from '@/components/YourCompany'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()
const vuetify = new Vuetify({})

describe('CorrectBusinessType in a Correction', () => {
  let wrapper: any
  let store: any = getVuexStore()

  beforeAll(() => {
    router.push({ name: 'correction' })
  })

  beforeEach(() => {
    wrapper = mount(CorrectBusinessType, { vuetify, store, localVue, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the CorrectBusinessType Component', async () => {
    expect(wrapper.find(CorrectBusinessType).exists()).toBe(true)
  })

  it('hides the row for corrections', async () => {
    expect(wrapper.find('#business-type').exists()).toBe(false)
  })
})

describe('CorrectBusinessType in an Alteration', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const originalSnapShot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'BC'
    }
  }

  beforeAll(() => {
    router.push({ name: 'alteration' })
  })

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.nameRequest.legalName = originalSnapShot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = originalSnapShot.businessInfo.legalType
    store.state.stateModel.originalSnapshot = originalSnapShot

    wrapper = mount(CorrectBusinessType, { vuetify, store, localVue, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the CorrectBusinessType Component', async () => {
    expect(wrapper.find(CorrectBusinessType).exists()).toBe(true)
  })

  // TODO: fix this
  xit('displays the Business Type row for Alterations', async () => {
    expect(wrapper.find('#business-type').exists()).toBe(true)
  })

  // TODO: fix this
  xit('displays the title and entity type in display mode', async () => {
    expect(wrapper.findAll('label').at(0).text()).toBe('Business Type')
    expect(wrapper.findAll('.info-text').at(0).text()).toBe('BC Limited Company')
  })

  // TODO: fix this
  xit('displays the type selector in edit mode', async () => {
    // Verify selector is hidden in display mode
    expect(wrapper.find('#business-type-selector').exists()).toBe(false)

    // Click edit btn and open edit mode
    wrapper.find('#btn-correct-business-type').trigger('click')
    await Vue.nextTick()

    expect(wrapper.find('#business-type-selector').exists()).toBe(true)
  })

  // TODO: fix this
  xit('displays the confirm articles checkbox and enables Done btn when selected', async () => {
    // Set the selected entity to Benefit Company
    wrapper.setData({ selectedEntityType: 'BEN' })

    // Verify checkbox is hidden until in display mode
    expect(wrapper.find('#confirm-articles-checkbox').exists()).toBe(false)

    // Click edit btn and open edit mode
    wrapper.find('#btn-correct-business-type').trigger('click')
    await Vue.nextTick()

    // Verify checkbox is displayed in edit mode and DONE btn is disabled
    expect(wrapper.find('#confirm-articles-checkbox').exists()).toBe(true)
    expect(wrapper.find('#done-btn').attributes('disabled')).toBeTruthy()

    // Select the Confirm Articles checkbox
    wrapper.find('#confirm-articles-checkbox').trigger('click')
    await Vue.nextTick()

    // Verify DONE btn is enabled after selecting the checkbox
    expect(wrapper.find('#done-btn').attributes('disabled')).toBeUndefined()
  })

  // TODO: fix this
  xit('renders the CHANGE option for editing a business type', async () => {
    const editLabel = wrapper.find('#btn-correct-business-type').text()
    expect(editLabel).toBe('Change')
  })

  it('hides the CHANGE option for editing a business type when NOT Limited Company', async () => {
    store.state.stateModel.tombstone.entityType = 'BEN'
    await Vue.nextTick()

    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(false)
  })
})
