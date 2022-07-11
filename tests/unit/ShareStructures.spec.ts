import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
import { createLocalVue, mount } from '@vue/test-utils'
import ShareStructures from '@/components/common/ShareStructure/ShareStructures.vue'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const localVue = createLocalVue()
const store = getVuexStore()

// Store
document.body.setAttribute('data-app', 'true')

describe('Share Structures component', () => {
  let wrapper: any

  const shareClasses: any = [
    {
      id: '1',
      name: 'Common Shares',
      priority: 0,
      maxNumberOfShares: 10000,
      parValue: 1.58,
      currency: 'CAD',
      hasRightsOrRestrictions: true,
      series: [
        {
          id: '1',
          name: 'Share Series 1',
          priority: 1,
          hasMaximumShares: true,
          maxNumberOfShares: 50,
          hasRightsOrRestrictions: false,
          action: 'removed'
        }
      ]
    },
    {
      id: '2',
      name: 'Non-voting Shares',
      priority: 1,
      maxNumberOfShares: 1000,
      parValue: null,
      currency: '',
      hasRightsOrRestrictions: false,
      series: []
    }]

  beforeEach(() => {
    wrapper = mount(ShareStructures, {
      localVue,
      vuetify,
      store,
      propsData: {
        isEditMode: true
      }
    })
  })

  afterEach(async () => {
    await wrapper.destroy()
  })

  it('displays share-structures component', () => {
    expect(wrapper.findComponent(ShareStructures).exists()).toBe(true)
  })

  it('is invalid when the minimum share class requirements are not met', () => {
    // Assign empty share classes
    store.state.stateModel.shareStructureStep.shareClasses = []
    expect(wrapper.vm.invalidShareSection).toBe(false)

    // Prompt the validations
    store.state.stateModel.validationFlags.componentValidate = true
    wrapper.vm.setShareStructureValidity()

    // Verify invalid share section
    expect(wrapper.vm.invalidShareSection).toBe(true)
  })

  it('is valid when the minimum share class requirements are met', () => {
    // Assign valid share classes
    store.state.stateModel.shareStructureStep.shareClasses = shareClasses
    expect(wrapper.vm.hasMinimumShareClass).toBe(true)

    // Prompt the validations
    store.state.stateModel.validationFlags.componentValidate = true
    wrapper.vm.setShareStructureValidity()

    // Verify valid share section
    expect(wrapper.vm.invalidShareSection).toBe(false)
  })

  it('stores shareClasses types as number', async () => {
    store.state.stateModel.shareStructureStep.shareClasses = shareClasses
    await Vue.nextTick()

    // Click on the button to add class
    await wrapper.find('#btn-add-person').trigger('click')

    const textNameInput = wrapper.find('#txt-name')
    const maxNumberOfSharesInput = wrapper.find('#txt-max-shares')
    const parValueInput = wrapper.find('#class-par-value')

    // Add new class
    await textNameInput.setValue('Test new class')
    await maxNumberOfSharesInput.setValue('1')
    await parValueInput.setValue('2')
    await wrapper.find('#done-btn').trigger('click')

    // maxNumberOfShares and parValue should be number
    expect(store.state.stateModel.shareStructureStep.shareClasses[2].maxNumberOfShares).toBe(1)
    expect(store.state.stateModel.shareStructureStep.shareClasses[2].parValue).toBe(2)
  })
})
