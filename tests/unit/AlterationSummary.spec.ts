// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { AlterationSummary } from '@/components/Summary'
import { ConfirmDialog } from '@/components/dialogs'

Vue.use(Vuetify)
const localVue = createLocalVue()
const vuetify = new Vuetify({})

// *** TODO: BROKEN
xdescribe('AlterationSummary', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const originalSnapShot = [
    {
      business: {
        legalName: 'Mock Original Name',
        legalType: 'BC'
      }
    }
  ]

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.nameRequest.legalName = originalSnapShot[0].business.legalName
    store.state.stateModel.tombstone.entityType = originalSnapShot[0].business.legalType
    store.state.stateModel.originalSnapshot = originalSnapShot
    store.state.stateModel.summaryMode = true

    wrapper = mount(AlterationSummary, { vuetify, store, localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the AlterationSummary Component', async () => {
    expect(wrapper.find(AlterationSummary).exists()).toBe(true)
    expect(wrapper.find(ConfirmDialog).exists()).toBe(true)
  })

  it('renders the Change and Remove actions', async () => {
    const changeAction = wrapper.find('#btn-change-alteration').text()
    expect(changeAction).toBe('Change')

    const removeAction = wrapper.find('#btn-delete-alteration').text()
    expect(removeAction).toBe('Remove')
  })

  it('reverts out of summaryMode when selecting the change action', async () => {
    expect(store.state.stateModel.summaryMode).toBe(true)

    // Select the Change action
    const changeAction = wrapper.find('#btn-change-alteration')
    changeAction.trigger('click')

    await Vue.nextTick()

    // Verify summaryMode state has changed
    expect(store.state.stateModel.summaryMode).toBe(false)
  })

  it('displays the confirm dialog when selecting Remove action', async () => {
    // verify that popup is not yet displayed
    expect(wrapper.find('.confirm-dialog').exists()).toBe(false)

    // Select the remove action
    const removeAction = wrapper.find('#btn-delete-alteration')
    removeAction.trigger('click')

    await Vue.nextTick()

    expect(wrapper.find('.confirm-dialog').exists()).toBe(true)
  })

  it('does not render the summary sections when no changes have been made', async () => {
    expect(wrapper.find('.business-name-summary').exists()).toBe(false)
    expect(wrapper.find('.business-type-summary').exists()).toBe(false)
  })

  it('renders the name summary section when changes have been made', async () => {
    store.state.stateModel.nameRequest.legalName = 'Mock New Name'
    await Vue.nextTick()

    expect(wrapper.find('.business-name-summary').exists()).toBe(true)
    expect(wrapper.find('.business-name-summary').text()).toContain('Company Name Mock New Name')
  })

  it('renders the type summary section when changes have been made', async () => {
    store.state.stateModel.tombstone.entityType = 'BEN'
    await Vue.nextTick()

    expect(wrapper.find('.business-type-summary').exists()).toBe(true)
    expect(wrapper.find('.business-type-summary').text()).toContain(
      'Changing from a BC Limited Company to a BC Benefit Company'
    )
  })
})
