import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { getVuexStore } from '@/store/'
import ChangeBusinessType from '@/components/common/YourCompany/ChangeBusinessType.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Change Business Type component', () => {
  it('renders itself and its sub-component', () => {
    const wrapper = mount(ChangeBusinessType, { vuetify, store })

    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBe(true)

    wrapper.destroy()
  })

  it('defaults Invalid Section prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      store,
      propsData: {}
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(false)

    wrapper.destroy()
  })

  it('accepts Invalid Section prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      store,
      propsData: { invalidSection: true }
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(true)

    wrapper.destroy()
  })

  it('Should have tooltip for Cooperative', () => {
    // init entity type
    store.state.stateModel.tombstone.entityType = 'CP'

    store.state.stateModel.tombstone.filingType = 'specialResolution'
    store.state.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } }

    const wrapper = mount(ChangeBusinessType, { vuetify, store })
    expect(wrapper.find('.v-tooltip').exists()).toBe(true)

    wrapper.destroy()
  })

  it('Should not have tooltip for benefit company', () => {
    // init entity type
    store.state.stateModel.tombstone.entityType = 'BEN'

    store.state.stateModel.tombstone.filingType = 'alteration'
    store.state.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } }

    const wrapper = mount(ChangeBusinessType, { vuetify, store })
    expect(wrapper.find('.v-tooltip').exists()).toBe(false)

    wrapper.destroy()
  })
})
