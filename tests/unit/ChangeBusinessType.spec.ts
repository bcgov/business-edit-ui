import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ChangeBusinessType from '@/components/common/YourCompany/ChangeBusinessType.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, FilingTypes } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('Change Business Type component', () => {
  it('renders itself and its sub-component', () => {
    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBe(true)

    wrapper.destroy()
  })

  it('defaults Invalid Section prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      propsData: {}
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(false)

    wrapper.destroy()
  })

  it('accepts Invalid Section prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      propsData: { invalidSection: true }
    })
    const vm: any = wrapper.vm

    expect(vm.invalidSection).toBe(true)

    wrapper.destroy()
  })

  it('Should have tooltip for Cooperative', () => {
    // init entity type
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP

    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
    store.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })
    expect(wrapper.find('.v-tooltip').exists()).toBe(true)

    wrapper.destroy()
  })

  it('Should not have tooltip for benefit company', () => {
    // init entity type
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY

    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = { authInfo: { folioNumber: 'A123' } } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })
    expect(wrapper.find('.v-tooltip').exists()).toBe(false)

    wrapper.destroy()
  })
})
