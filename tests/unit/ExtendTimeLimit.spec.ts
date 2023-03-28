import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import ExtendTimeLimit from '@/components/Restoration/ExtendTimeLimit.vue'

Vue.use(Vuetify)
let vuetify = new Vuetify({})
const store = getVuexStore()

describe('Time Limit Extension component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.state.stateModel.restoration = {
      expiry: '2024-07-01',
      type: 'limitedRestorationExtension'
    }
    store.state.stateModel.stateFilingRestoration = {
      approvalType: 'courtOrder',
      courtOrder: { fileNumber: 'testtest' },
      expiry: '2024-03-01',
      type: 'limitedRestoration'
    }
    wrapperFactory = () => mount(ExtendTimeLimit, {
      store,
      vuetify
    })
  })

  it('renders the component properly', () => {
    // verify the component is rendered
    const wrapper = wrapperFactory()

    expect(wrapper.find('#extend-time-limit').exists()).toBe(true)
    wrapper.destroy()
  })

  it('get correct approval type when state restoration filing was approved by court order.', () => {
    const wrapper = wrapperFactory()
    const extendTimeLimit = wrapper.vm as any // wrapper.vm type is Vue

    expect(extendTimeLimit.approvalType).toEqual('courtOrder')
    wrapper.destroy()
  })

  it('get correct approval type when state restoration filing was approved by registrar.', () => {
    const wrapper = wrapperFactory()
    const extendTimeLimit = wrapper.vm as any // wrapper.vm type is Vue
    store.state.stateModel.stateFilingRestoration.approvalType = 'registrar'

    expect(extendTimeLimit.approvalType).toEqual('registrar')
    wrapper.destroy()
  })

  it('get correct number of months of previously filed limited restoration.', () => {
    const wrapper = wrapperFactory()
    const extendTimeLimit = wrapper.vm as any // wrapper.vm type is Vue
    store.state.stateModel.tombstone.currentDate = '2023-01-01'

    expect(extendTimeLimit.previousNumberOfMonths).toEqual(14)
    wrapper.destroy()
  })

  it('get correct expiry draft date.', () => {
    const wrapper = wrapperFactory()
    const extendTimeLimit = wrapper.vm as any // wrapper.vm type is Vue
    store.state.stateModel.tombstone.currentDate = '2023-01-01'

    expect(extendTimeLimit.expiry).toEqual('2023-05-01')
    wrapper.destroy()
  })

  it('get correct validity of extension time section.', () => {
    const wrapper = wrapperFactory()

    const extensionTimeValidity = store.state.stateModel.validationFlags.flagsCompanyInfo.isValidExtensionTime
    expect(extensionTimeValidity).toBeTruthy()
    wrapper.destroy()
  })

  it('get correct validity of approval type section.', () => {
    const wrapper = wrapperFactory()

    const approvalTypeValidity = store.state.stateModel.validationFlags.flagsCompanyInfo.isValidApprovalType
    expect(approvalTypeValidity).toBeFalsy()
    wrapper.destroy()
  })

  it('get correct court order file number.', () => {
    const wrapper = wrapperFactory()
    const extendTimeLimit = wrapper.vm as any // wrapper.vm type is Vue

    expect(extendTimeLimit.courtOrderNumberText).toEqual('')
    wrapper.destroy()
  })
})
