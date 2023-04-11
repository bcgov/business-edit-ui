import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AssociationType } from '@/components/common'
import flushPromises from 'flush-promises'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('AssociationType component', () => {
  let wrapper: any

  // Define Session
  store.stateModel.tombstone.entityType = CorpTypeCd.COOP
  store.stateModel.tombstone.businessId = 'CP1234567'

  beforeEach(async () => {
    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    wrapper = shallowMount(AssociationType,
      {
        localVue,
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
    expect(store.stateModel.businessInformation.associationType).toBe('AAAA')

    store.stateModel.entitySnapshot = { businessInfo: { associationType: 'NO' } } as any
    wrapper.vm.resetAssociationType()
    expect(store.stateModel.businessInformation.associationType).toBe('NO')
  })
})
