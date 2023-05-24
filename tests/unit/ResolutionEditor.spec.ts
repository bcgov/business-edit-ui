import Vue from 'vue'
import Vuetify from 'vuetify'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import ResolutionEditor from '@/components/SpecialResolution/ResolutionEditor.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { useStore } from '@/store/store'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// For Vue 3: remove - consult assets team for a replacement.
Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'mdi'
})

setActivePinia(createPinia())
const store = useStore()

describe('ResolutionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ResolutionEditor, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('sets the resolution date', async () => {
    const resolutionDatePickerRef = wrapper.vm.$refs.resolutionDatePickerRef
    const resolutionDate = '2023-05-08'
    resolutionDatePickerRef.$emit('emitDate', resolutionDate)
    await Vue.nextTick()
    expect(wrapper.vm.resolutionDateText).toBe(resolutionDate)
  })

  it('validates the form when required fields are filled', async () => {
    store.stateModel.tombstone.currentDate = '2020-05-07'
    store.stateModel.businessInformation.foundingDate = '2020-01-01'
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(true)
    await wrapper.findComponent(DatePickerShared).setData({ dateText: '2023-05-08' })
    await wrapper.setData({ resolutionDateText: '2023-05-08', resolution: '<p></p>' })
    store.setComponentValidate(true)
    await Vue.nextTick()
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(false)
    await wrapper.findComponent(DatePickerShared).setData({ dateText: '' })
    await wrapper.setData({ resolutionDateText: '', resolution: '<p>Resolution text</p>' })
    store.setComponentValidate(true)
    await Vue.nextTick()
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(false)
    await wrapper.findComponent(DatePickerShared).setData({ dateText: '2020-03-01' })
    await wrapper.setData({ resolutionDateText: '2020-03-01', resolution: '<p> Resolution tex </p>' })
    store.setComponentValidate(true)
    await Vue.nextTick()
    expect(store.getValidationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(true)
  })

  // No unit test for Vuetify Tiptap editor, it will be scrapped soon. Not our job to test external components.
})
