// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import { ShareStructures } from '@/components/ShareStructure'

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
        isEditMode: false
      }
    })
  })

  afterEach(async () => {
    await wrapper.destroy()
  })

  it('displays share-structures component', () => {
    expect(wrapper.findComponent(ShareStructures).exists()).toBe(true)
  })

  it('is invalid when the minimum share class requirements are not met', async () => {
    // Verify validations default value before prompt
    expect(wrapper.vm.invalidShareSection).toBe(false)

    // Promp the validations
    store.state.stateModel.newAlteration.componentValidate = true
    await Vue.nextTick()

    // Verify invalid share section
    expect(wrapper.vm.invalidShareSection).toBe(true)
  })

  it('is valid when the minimum share class requirements are met', async () => {
    // Assign store values
    store.state.stateModel.shareStructureStep.shareClasses = shareClasses

    // Promp the validations
    store.state.stateModel.newAlteration.componentValidate = true
    await Vue.nextTick()

    // Verify valid share section
    expect(wrapper.vm.invalidShareSection).toBe(false)
  })
})
