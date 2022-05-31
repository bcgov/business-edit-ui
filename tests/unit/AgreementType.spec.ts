import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import AgreementType from '@/components/Correction/AgreementType.vue'
import { getVuexStore } from '@/store/'

Vue.use(Vuetify)

let vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const sampleTypeSelector: string = '#agreement-type-sample'
const customTypeSelector: string = '#agreement-type-custom'
const summaryTextSelector: string = '.summary-desc'
const correctButtonSelector: string = '#btn-correct-agreement-type'
const doneButtonSelector: string = '#done-btn'
const agreementTypeSelector: string = '.agreement-option-list'
const correctedLabelSelector: string = '#corrected-lbl'
const cancelBtnSelector: string = '#cancel-btn'
const undoButtonSelector: string = '#btn-undo-agreement-type'
const sampleAgreementText = 'The sample Incorporation Agreement and Benefit Company Articles containing a benefit ' +
  'provision have been completed and a copy added to the company\'s record book.'
const customAgreementText = 'A custom Incorporation Agreement and custom Benefit Company Articles containing ' +
  'a benefit provision have been completed and a copy added to the company\'s record book.'

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

store.state.stateModel.nameRequest.entityType = 'BEN'
store.state.stateModel.tombstone.currentDate = '2020-03-30'
store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
store.state.stateModel.originalIA = {
  incorporationApplication: {
    incorporationAgreement: {
      agreementType: 'sample'
    }
  }
}

describe('Incorporation Agreement component', () => {
  it('Displays the summary text for sample agreement type', async () => {
    const wrapper: Wrapper<AgreementType> = createComponent()
    await Vue.nextTick()
    expect(wrapper.find(summaryTextSelector).text()).toContain(sampleAgreementText)
    wrapper.destroy()
  })

  it('Displays the summary text for custom agreement type', async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
    const wrapper: Wrapper<AgreementType> = createComponent()
    await Vue.nextTick()
    expect(wrapper.find(summaryTextSelector).text()).toContain(customAgreementText)
    wrapper.destroy()
  })

  it('Displays the correct button if the store and original IA filing agreement types are the same',
    async () => {
      store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
      const wrapper: Wrapper<AgreementType> = createComponent()
      await Vue.nextTick()
      expect(wrapper.find(correctButtonSelector).exists()).toBe(true)
      wrapper.destroy()
    })

  it('Displays the undo button if the store and original IA filing agreement types are different',
    async () => {
      store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
      const wrapper: Wrapper<AgreementType> = createComponent()
      await Vue.nextTick()
      expect(wrapper.find(correctButtonSelector).exists()).toBe(false)
      expect(wrapper.find(undoButtonSelector).exists()).toBe(true)
      wrapper.destroy()
    })

  it('Clicking the correct button displays the agreement options list and shows the selection',
    async () => {
      store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
      const wrapper: Wrapper<AgreementType> = createComponent()
      await Vue.nextTick()
      expect(wrapper.find(correctButtonSelector).exists()).toBe(true)
      await wrapper.find(correctButtonSelector).trigger('click')
      expect(wrapper.find(agreementTypeSelector).exists()).toBe(true)
      expect(wrapper.find(sampleTypeSelector).attributes('aria-checked')).toBe('true')
      expect(wrapper.find(customTypeSelector).attributes('aria-checked')).toBe('false')
      wrapper.destroy()
    })

  it('Clicking the undo button cancels changes and resets the agreement type in store to that of original IA filing',
    async () => {
      store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
      const wrapper: Wrapper<AgreementType> = createComponent()
      await Vue.nextTick()
      expect(wrapper.find(undoButtonSelector).exists()).toBe(true)
      await wrapper.find(undoButtonSelector).trigger('click')
      expect(wrapper.find(agreementTypeSelector).exists()).toBe(false)
      expect(wrapper.find(summaryTextSelector).text()).toContain(sampleAgreementText)
      expect(store.state.stateModel.incorporationAgreementStep.agreementType).toEqual('sample')
      wrapper.destroy()
    })

  it('Clicking the done button in the edit mode sets the value to store and shows correct summary description ',
    async () => {
      store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
      const wrapper: Wrapper<AgreementType> = createComponent()
      await Vue.nextTick()
      expect(wrapper.find(correctButtonSelector).exists()).toBe(true)
      await wrapper.find(correctButtonSelector).trigger('click')
      expect(wrapper.find(agreementTypeSelector).exists()).toBe(true)
      expect(wrapper.find(sampleTypeSelector).attributes('aria-checked')).toBe('true')
      expect(wrapper.find(customTypeSelector).attributes('aria-checked')).toBe('false')
      await wrapper.find(customTypeSelector).trigger('click')
      await wrapper.find(doneButtonSelector).trigger('click')
      expect(wrapper.find(agreementTypeSelector).exists()).toBe(false)
      expect(wrapper.find(summaryTextSelector).text()).toContain(customAgreementText)
      expect(store.state.stateModel.incorporationAgreementStep.agreementType).toEqual('custom')
      // Verify that the corrected chip is displayed
      expect(wrapper.find(correctedLabelSelector).exists()).toBe(true)
      wrapper.destroy()
    })

  it('Clicking the cancel button in the edit mode resets agreement type to the original value',
    async () => {
      store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
      const wrapper: Wrapper<AgreementType> = createComponent()
      await Vue.nextTick()
      expect(wrapper.find(correctButtonSelector).exists()).toBe(true)
      await wrapper.find(correctButtonSelector).trigger('click')
      expect(wrapper.find(agreementTypeSelector).exists()).toBe(true)
      expect(wrapper.find(sampleTypeSelector).attributes('aria-checked')).toBe('true')
      expect(wrapper.find(customTypeSelector).attributes('aria-checked')).toBe('false')
      await wrapper.find(customTypeSelector).trigger('click')
      await wrapper.find(cancelBtnSelector).trigger('click')
      expect(wrapper.find(agreementTypeSelector).exists()).toBe(false)
      expect(wrapper.find(summaryTextSelector).text()).toContain(sampleAgreementText)
      expect(store.state.stateModel.incorporationAgreementStep.agreementType).toEqual('sample')
      expect(wrapper.find(correctedLabelSelector).exists()).toBe(false)
      wrapper.destroy()
    })
})
