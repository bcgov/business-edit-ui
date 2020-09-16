import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'

import { AgreementType } from '@/components/IncorporationAgreement'

// Store
import { getVuexStore } from '@/store'

Vue.use(Vuetify)

let vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const sampleTypeSelector: string = '#agreement-type-sample'
const customTypeSelector: string = '#agreement-type-custom' 
const summaryTextSelector: string = '.summary-desc'

/**
 * Utility method to get around with the timing issues
 */
async function waitForUpdate (wrapper: Wrapper<Vue>) {
  await Vue.nextTick()
  await flushPromises()
  await Vue.nextTick()
}

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @returns a Wrapper<AgreementType> object with the given parameters.
 */
function createComponent (): Wrapper<AgreementType> {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = mockRouter.mock()
  localVue.use(Vuetify)
  document.body.setAttribute('data-app', 'true')
  return mount(AgreementType, {
    localVue,    
    router,
    store,
    vuetify
  })
}

store.state.stateModel.nameRequest.entityType = 'BC'
store.state.stateModel.tombstone.currentDate = '2020-03-30'
store.state.stateModel.incorporationAgreementStep.agreementType='sample'
store.state.stateModel.originalIA={
  incorporationApplication: {
    incorporationAgreement: {
      agreementType: 'sample'
    }
  }
}

describe('Share Structure component', () => {

  it('Displays the summary text for sample agreement type', async () => {     
    const wrapper: Wrapper<AgreementType> = createComponent()
    await waitForUpdate(wrapper)
    expect(wrapper.find(summaryTextSelector).text()).toContain(
      'The sample Incorporation Agreement and Benefit Company Articles containing a benefit ' +
      'provision have been completed and a copy added to the company\'s record book.')
    wrapper.destroy()
  })

  it('Displays the summary text for custom agreement type', async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
    const wrapper: Wrapper<AgreementType> = createComponent()
    await waitForUpdate(wrapper)
    expect(wrapper.find(summaryTextSelector).text()).toContain(
      'A custom Incorporation Agreement and custom Benefit Company Articles containing ' +
      'a benefit provision have been completed and a copy added to the company\'s record book.')
    wrapper.destroy()
  })

  it('Displays the correct button if the store and original IA filing agreement types are the same',
   async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
    const wrapper: Wrapper<AgreementType> = createComponent()
    await waitForUpdate(wrapper)
    expect(wrapper.find('#btn-correct-agreement-type').exists()).toBe(true)
    wrapper.destroy()
  })
  
  it('Displays the undo button if the store and original IA filing agreement types are different',
   async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
    const wrapper: Wrapper<AgreementType> = createComponent()
    await waitForUpdate(wrapper)
    expect(wrapper.find('#btn-correct-agreement-type').exists()).toBe(false)
    expect(wrapper.find('#btn-undo-agreement-type').exists()).toBe(true)
    wrapper.destroy()
  })  

  it('Clicking the correct button displays the agreement options list and shows the selection',
   async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
    const wrapper: Wrapper<AgreementType> = createComponent()
    await waitForUpdate(wrapper)
    expect(wrapper.find('#btn-correct-agreement-type').exists()).toBe(true)
    wrapper.find('#btn-correct-agreement-type').trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find('.agreement-option-list').exists()).toBe(true)
    expect(wrapper.find(sampleTypeSelector).attributes('aria-checked')).toBe('true')
    expect(wrapper.find(customTypeSelector).attributes('aria-checked')).toBe('false')
    wrapper.destroy()
  })  

  it('Clicking the undo button cancels changes and resets the agreement type in store to that of original IA filing',
   async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
    const wrapper: Wrapper<AgreementType> = createComponent()
    await waitForUpdate(wrapper)
    expect(wrapper.find('#btn-undo-agreement-type').exists()).toBe(true)
    wrapper.find('#btn-undo-agreement-type').trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find('.agreement-option-list').exists()).toBe(false)
    expect(wrapper.find(summaryTextSelector).text()).toContain(
      'The sample Incorporation Agreement and Benefit Company Articles containing a benefit ' +
      'provision have been completed and a copy added to the company\'s record book.')
    expect(store.state.stateModel.incorporationAgreementStep.agreementType).toEqual('sample')
    wrapper.destroy()
  })  
})
