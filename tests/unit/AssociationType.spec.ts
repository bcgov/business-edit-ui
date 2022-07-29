import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store/'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AssociationType } from '@/components/common'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('AssociationType component', () => {
  let wrapper: any

  // Define Session
  store.state.stateModel.tombstone.entityType = 'CP'
  store.state.stateModel.tombstone.businessId = 'CP1234567'

  beforeEach(async () => {
    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    wrapper = shallowMount(AssociationType,
      {
        localVue,
        store,
        vuetify,
        propsData: { invalidSection: false }
      })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders Association Type component', () => {
    expect(wrapper.findComponent(AssociationType).exists()).toBe(true)
  })

  it('accepts Invalid Section prop', async () => {
    wrapper.setProps({ invalidSection: true })
    await flushPromises()
    expect(wrapper.vm.invalidSection).toBe(true)
  })

  it('updates business information, also tests submit and reset', () => {
    wrapper.vm.selectedAssociationType = 'AAAA'
    wrapper.vm.submitAssociationTypeChange()
    expect(store.state.stateModel.businessInformation.associationType).toBe('AAAA')

    store.state.stateModel.entitySnapshot = { businessInfo: { associationType: 'NO' } }
    wrapper.vm.resetAssociationType()
    expect(store.state.stateModel.businessInformation.associationType).toBe('NO')
  })
})
