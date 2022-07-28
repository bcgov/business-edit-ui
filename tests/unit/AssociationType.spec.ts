import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store/'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import mockRouter from './MockRouter'
import { AssociationType } from '@/components/common'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('AssociationType component', () => {
  let wrapper: any
  const { assign } = window.location

  // Define Session
  store.state.stateModel.tombstone.entityType = 'CP'
  store.state.stateModel.tombstone.businessId = 'CP1234567'

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'alteration' })
    wrapper = shallowMount(AssociationType, { localVue, store, router, vuetify })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders Association Type component', () => {
    expect(wrapper.findComponent(AssociationType).exists()).toBe(true)
  })

  it('accepts Invalid Section prop', () => {
    const wrapper = mount(AssociationType, {
      vuetify,
      store,
      propsData: { invalidSection: true }
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(true)

    wrapper.destroy()
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
