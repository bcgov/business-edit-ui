import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { mount } from '@vue/test-utils'
import Memorandum from '@/components/SpecialResolution/Memorandum.vue'
import UploadRulesOrMemorandum from '@/components/SpecialResolution/UploadRulesOrMemorandum.vue'
import flushPromises from 'flush-promises'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Memorandum', () => {
  let wrapper: any

  beforeEach(async () => {
    store.stateModel.memorandum = {}
    store.stateModel.entitySnapshot = {
      resolutions: [{
        date: '2020-02-02',
        id: 1,
        type: 'text'
      }]
    } as any
    wrapper = mount(Memorandum, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('sets hasChanged to true when saveMemorandum is called', () => {
    wrapper.vm.saveMemorandum()
    expect(wrapper.vm.hasChanged).toBe(true)
    expect(store.stateModel.memorandum.includedInResolution).toBe(true)
  })

  it('resets the component state when resetMemorandum is called', () => {
    wrapper.vm.resetMemorandum()
    expect(wrapper.vm.hasChanged).toBe(false)
    expect(wrapper.vm.isEditing).toBe(false)
    expect(store.stateModel.memorandum.includedInResolution).toBe(false)
  })

  it('memorandum on paper only - changed', async () => {
    store.stateModel.memorandum.key = null
    expect(wrapper.find('#memorandum-paper-not-changed').text()).toContain('Available on paper only')

    await wrapper.find('#btn-change-memorandum').trigger('click')
    await wrapper.find('#chk-memorandum-in-resolution').trigger('click')
    await wrapper.find('#btn-memorandum-done').trigger('click')

    expect(wrapper.find('#memorandum-paper-changed').text()).toContain('Available on paper only')
    expect(wrapper.find('#memorandum-changes-included-resolution').text()).not.toContain('new')
    expect(wrapper.find('#memorandum-changes-included-resolution').text()).toContain('changes will be described')
  })

  it('memorandum on paper only, previously included in special resolution - unchanged', async () => {
    store.stateModel.memorandum = { ...store.stateModel.memorandum, previouslyInResolution: true, key: null }
    await Vue.nextTick()
    expect(wrapper.find('#memorandum-paper-not-changed').text()).toContain('Available on paper only')
    expect(wrapper.find('.last-modified-details').text()).toContain('filed previously to view any changes')
  })

  it('memorandum exists, not previously included', async () => {
    store.stateModel.memorandum = {
      name: 'test',
      key: 'test',
      url: 'test',
      uploaded: '2022-01-01T08:00:00.000000+00:00',
      previouslyInResolution: false
    }
    await Vue.nextTick()
    expect(wrapper.find('a').text()).toEqual('test')
    expect(wrapper.find('.last-modified-details').text()).toEqual('Uploaded January 1, 2022')
  })

  it('memorandum exists, previously included in special resolution', async () => {
    store.stateModel.memorandum = {
      name: 'test',
      key: 'test',
      url: 'test',
      uploaded: '2022-01-01T08:00:00.000000+00:00',
      previouslyInResolution: true
    }
    await Vue.nextTick()
    expect(wrapper.find('a').text()).toEqual('test')
    expect(wrapper.find('.last-modified-details').text()).toContain('uploaded on January 1, 2022. Please refer')
    expect(wrapper.find('.last-modified-details').text()).toContain('after this date to view')
  })

  it('pressing done validation error - vuetify rules validation', async () => {
    await wrapper.find('#btn-change-memorandum').trigger('click')
    await wrapper.find('#btn-memorandum-done').trigger('click')
    await flushPromises()
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidMemorandum).toBe(false)
    expect(wrapper.find('.error--text').exists()).toBe(true)
  })

  it('calling getComponentValidate, should cause section to go red', async () => {
    // Trigger getComponentValidate, while we're in editing mode.
    store.stateModel.validationFlags.componentValidate = true
    await wrapper.find('#btn-change-memorandum').trigger('click')
    expect(wrapper.find('#memorandum-section').classes()).toContain('invalid-section')
    expect(wrapper.find('#memorandum-title').classes()).toContain('error-text')
    expect(wrapper.find('#memorandum-in-resolution-text').classes()).toContain('error-text')
  })

  it('saveMemorandum - valid - memorandum in upload', async () => {
    store.stateModel.entitySnapshot.resolutions = null
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    await wrapper.vm.$nextTick()
    await wrapper.find('#btn-change-memorandum').trigger('click')
    const uploadRules = wrapper.findComponent(UploadRulesOrMemorandum)
    expect(uploadRules.exists()).toBe(true)
    uploadRules.vm.file = {
      name: 'test-new-file'
    }
    uploadRules.vm.fileKey = 'test-new-file'
    // Mock out the PDF file upload validation. There are unit tests in business-filings-ui.
    vi.spyOn(uploadRules.vm, 'validate').mockImplementation(() => true)
    await wrapper.find('#btn-memorandum-done').trigger('click')
    expect(wrapper.vm.isEditing).toBe(false)
    expect(wrapper.vm.hasChanged).toBe(true)
    expect(store.stateModel.memorandum.includedInResolution).toBe(false)
    expect(store.stateModel.memorandum.key).toBe('test-new-file')
    expect(store.stateModel.memorandum.name).toBe('test-new-file')
  })
})
