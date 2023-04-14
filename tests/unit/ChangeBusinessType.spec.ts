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
  it('renders itself', () => {
    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBe(true)

    wrapper.destroy()
  })

  it('defaults invalidSection prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      propsData: {}
    })
    const vm = wrapper.vm as any

    expect(vm.invalidSection).toBe(false)

    wrapper.destroy()
  })

  it('accepts invalidSection prop', () => {
    const wrapper = mount(ChangeBusinessType, {
      vuetify,
      propsData: { invalidSection: true }
    })
    const vm = wrapper.vm as any

    expect(vm.invalidSection).toBe(true)

    wrapper.destroy()
  })

  it('should have tooltip and no correct button for Coop Special Resolution filing', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
    store.resourceModel.changeData = { typeChangeInfo: 'tooltip' } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.v-tooltip').exists()).toBe(true)
    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(false)

    wrapper.destroy()
  })

  it('should have tooltip and no correct button for GP Change filing', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.PARTNERSHIP
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_NAME
    store.resourceModel.changeData = { typeChangeInfo: 'tooltip' } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.v-tooltip').exists()).toBe(true)

    wrapper.destroy()
  })

  it('should have tooltip and no correct button for GP Conversion filing', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.PARTNERSHIP
    store.stateModel.tombstone.filingType = FilingTypes.CONVERSION
    store.resourceModel.changeData = { typeChangeInfo: 'tooltip' } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.v-tooltip').exists()).toBe(true)
    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(false)

    wrapper.destroy()
  })

  it('should have correct button and no tooltip for BC Alteration filing', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.entitySnapshot = { businessInfo: { legalType: 'BC' } } as any
    store.resourceModel.changeData = { typeChangeInfo: null } as any

    const wrapper = mount(ChangeBusinessType, { vuetify })

    expect(wrapper.find('.v-tooltip').exists()).toBe(false)
    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(true)

    wrapper.destroy()
  })
})
