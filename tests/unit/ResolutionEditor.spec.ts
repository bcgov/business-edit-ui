import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import ResolutionEditor from '@/components/SpecialResolution/ResolutionEditor.vue'
import { useStore } from '@/store/store'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('ResolutionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ResolutionEditor, { vuetify })
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
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.resolutionDateText).toBe(resolutionDate)
  })

  it('validates the form when required fields are filled', async () => {
    wrapper.setData({ resolutionDateText: '2023-05-08', resolution: '<p>Resolution text</p>' })
    wrapper.setData({ getComponentValidate: true })
    await wrapper.vm.$nextTick()
    expect(store.getSpecialResolutionFormValid).toBe(true)
  })

  // NOTE: Leaving out unit tests for Vuetify Tiptap editor, it will be scrapped soon.
})
