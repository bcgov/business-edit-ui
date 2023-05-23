import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ExtendTimeLimit from '@/components/Restoration/ExtendTimeLimit.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { ApprovalTypes } from '@bcrs-shared-components/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Time Limit Extension component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.stateModel.tombstone.currentDate = '2023-01-01'

    store.stateModel.stateFilingRestoration = {
      approvalType: 'courtOrder',
      courtOrder: { fileNumber: 'testtest' },
      expiry: '2024-01-01', // 12 months remaining from current date above
      type: 'limitedRestoration'
    } as any

    store.stateModel.restoration = {
      expiry: '2025-01-01', // extra 12 months from current date above
      type: 'limitedRestorationExtension'
    } as any

    wrapperFactory = () => mount(ExtendTimeLimit, { vuetify })
  })

  it('renders the component properly', () => {
    // verify the component is rendered
    const wrapper = wrapperFactory()

    expect(wrapper.find('#extend-time-limit').exists()).toBe(true)

    wrapper.destroy()
  })

  it('computes showApprovalType=true when state restoration filing was approved by court order', () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    expect(vm.showApprovalType).toBe(true)

    wrapper.destroy()
  })

  it('computes showApprovalType=false when state restoration filing was approved by registrar', () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    store.stateModel.stateFilingRestoration.approvalType = ApprovalTypes.VIA_REGISTRAR
    expect(ApprovalTypes.VIA_REGISTRAR).toEqual('registrar')
    expect(vm.showApprovalType).toBe(false)

    wrapper.destroy()
  })

  it('computes months remaining from previously filed limited restoration', () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    expect(vm.monthsRemaining).toEqual(12)

    wrapper.destroy()
  })

  it('computes expiry months from curent limited restoration extension', () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    expect(vm.expiryMonths).toEqual(12)

    wrapper.destroy()
  })

  it('get correct validity of extension time section.', () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    expect(vm.getExpiryValid).toBe(true)

    wrapper.destroy()
  })

  it('get correct validity of approval type section.', () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm as any

    expect(vm.getApprovalTypeValid).toBe(false)

    wrapper.destroy()
  })

  it('get correct court order file number.', () => {
    expect(store.getCourtOrderNumberText).toEqual('')
  })
})
