// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { createLocalVue, mount } from '@vue/test-utils'
import { AlterationSummary } from '@/components/Summary'
import { EffectiveDateTime } from '@/components/common'
import { ConfirmDialog } from '@/components/dialogs'
import { NameTranslationIF } from '@/interfaces'
import { NameTranslation } from '@/components/YourCompany/NameTranslations'

Vue.use(Vuetify)
const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('Alteration Summary component', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const originalSnapShot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'BC'
    }
  }

  beforeAll(() => {
    // init store
    store.state.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.state.stateModel.tombstone.currentDate = '2021-03-01'
    store.state.stateModel.originalSnapshot = originalSnapShot
    store.state.stateModel.shareStructureStep.shareClasses = []
    store.state.stateModel.originalSnapshot.shareStructure = { shareClasses: [] }
  })

  beforeEach(() => {
    // Set Original business Data
    store.state.stateModel.nameRequest.legalName = originalSnapShot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = originalSnapShot.businessInfo.legalType
    store.state.stateModel.summaryMode = true
    
    wrapper = mount(AlterationSummary, { vuetify, store, localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.find(AlterationSummary).exists()).toBe(true)
    expect(wrapper.find(EffectiveDateTime).exists()).toBe(true)
    expect(wrapper.find(ConfirmDialog).exists()).toBe(true)
    expect(wrapper.find(NameTranslation).exists()).toBe(true)
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
    expect(wrapper.find('.business-type-summary').text()).toContain('Changing from a BC Limited Company')
    expect(wrapper.find('.business-type-summary').text()).toContain('to a BC Benefit Company')
  })

  it('renders the default alteration date and time section', async () => {
    store.state.stateModel.effectiveDateTime = {
      isFutureEffective: null,
      dateTimeString: ''
    }
    store.state.stateModel.newAlteration.validFlags.isValidEffectiveDate = false
    await Vue.nextTick()

    // verify section
    expect(wrapper.find('.alteration-date-time').exists()).toBe(true)

    // verify info-text paragraph
    expect(wrapper.find('.alteration-date-time .info-text').exists()).toBe(true)
    expect(wrapper.find('.alteration-date-time .info-text').text()).toContain('Select the date and time')

    // verify effective-date-time div only (no the end blurb div)
    expect(wrapper.findAll('.alteration-date-time .v-card').length).toBe(1)
  })

  it('renders the alteration date and time section with end blurb', async () => {
    store.state.stateModel.effectiveDateTime = {
      isFutureEffective: true,
      dateTimeString: '2021-03-05T16:30:00Z'
    }
    store.state.stateModel.newAlteration.validFlags.isValidEffectiveDate = true
    await Vue.nextTick()

    // verify end blurb div
    const divs = wrapper.findAll('.alteration-date-time .v-card')
    expect(divs.length).toBe(2)
    expect(divs.at(1).text()).toContain('The alteration for this business will be effective as of:')
    expect(divs.at(1).text()).toContain('Friday, March 5, 2021 at 8:30 am Pacific time')
  })

})
