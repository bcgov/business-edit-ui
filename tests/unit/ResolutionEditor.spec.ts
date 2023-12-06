import Vue from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import ResolutionEditor from '@/components/SpecialResolution/ResolutionEditor.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { useStore } from '@/store/store'
import Vuetify from 'vuetify/lib'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()
const firstResolution = '<b>Resolution text</b>'
const firstResolutionDateText = '2025-01-01'

describe('ResolutionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ResolutionEditor, { vuetify })
    store.stateModel.specialResolution = ({ resolution: firstResolution, resolutionDate: firstResolutionDateText })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('sets the resolution date', async () => {
    // This shows datepicker component
    await wrapper.setProps({ isEditing: true })
    const resolutionDatePickerRef = wrapper.vm.$refs.resolutionDatePickerRef
    const resolutionDate = '2023-05-08'
    resolutionDatePickerRef.$emit('emitDate', resolutionDate)
    await Vue.nextTick()
    expect(wrapper.vm.resolutionDateText).toBe(resolutionDate)
  })

  it('validates the form when required fields are filled', async () => {
    // This shows datepicker component
    await wrapper.setProps({ isEditing: true })
    store.stateModel.tombstone.currentDate = '2020-05-07'
    store.stateModel.businessInformation.foundingDate = '2020-01-01'
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(true)
    await wrapper.findComponent(DatePickerShared).setData({ dateText: '2023-05-08' })
    await wrapper.setData({ resolutionDateText: '2023-05-08', resolution: '<p></p>' })
    await wrapper.setProps({ isEditing: false })
    store.setComponentValidate(true)
    await Vue.nextTick()
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(false)
    await wrapper.findComponent(DatePickerShared).setData({ dateText: '' })
    await wrapper.setData({ resolutionDateText: '', resolution: '<p>Resolution text</p>' })
    await wrapper.setProps({ isEditing: false })
    store.setComponentValidate(true)
    await Vue.nextTick()
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(false)
    await wrapper.findComponent(DatePickerShared).setData({ dateText: '2020-03-01' })
    await wrapper.setData({ resolutionDateText: '2020-03-01', resolution: '<p> Resolution tex </p>' })
    await wrapper.setProps({ isEditing: false })
    await Vue.nextTick()
    store.setComponentValidate(true)
    await Vue.nextTick()
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(true)
  })

  it('undo and save to store works as expected', async () => {
    await wrapper.setProps({ isEditing: true })

    const secondResolution = '<b> Second resolution text </b>'
    const secondResolutionDateText = '2022-01-01'

    wrapper.setData({ resolution: secondResolution, resolutionDateText: secondResolutionDateText })

    await Vue.nextTick()

    // Called by parent component via ref
    await wrapper.vm.saveToStore()
    expect(store.getSpecialResolution.resolution).toEqual(secondResolution)
    expect(store.getSpecialResolution.resolutionDate).toEqual(secondResolutionDateText)

    // Called by parent component via ref
    await wrapper.vm.undoToStore()
    expect(store.getSpecialResolution.resolution).toEqual(firstResolution)
    expect(store.getSpecialResolution.resolutionDate).toEqual(firstResolutionDateText)
  })
  // No unit test for Vuetify Tiptap editor, it will be scrapped soon. Not our job to test external components.
})
