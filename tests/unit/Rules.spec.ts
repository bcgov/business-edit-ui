import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { mount } from '@vue/test-utils'
import Rules from '@/components/SpecialResolution/Rules.vue'
import UploadRules from '@/components/SpecialResolution/UploadRules.vue'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Rules', () => {
  let wrapper: any

  beforeEach(async () => {
    store.stateModel.rules = {}
    store.stateModel.entitySnapshot = null
    wrapper = mount(Rules, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('saveRules - valid - rules in resolution', async () => {
    await wrapper.find('#btn-change-rules').trigger('click')
    await wrapper.find('#btn-describe-rules').trigger('click')
    await wrapper.find('#chk-rules-describe').trigger('click')
    await wrapper.find('#btn-rules-done').trigger('click')
    expect(wrapper.vm.isEditing).toBe(false)
    expect(wrapper.vm.hasChanged).toBe(true)
    expect(store.stateModel.rules.includedInResolution).toBe(true)
  })

  it('saveRules - valid - rules in upload', async () => {
    await wrapper.find('#btn-change-rules').trigger('click')
    await wrapper.find('#btn-upload-rules').trigger('click')
    await wrapper.find('#chk-rules-upload').trigger('click')
    const uploadRules = wrapper.findComponent(UploadRules)
    expect(uploadRules.exists()).toBe(true)
    uploadRules.vm.file = {
      name: 'test-new-file'
    }
    uploadRules.vm.fileKey = 'test-new-file'
    // Mock out the PDF file upload validation. There are unit tests in business-filings-ui.
    jest.spyOn(uploadRules.vm, 'validate').mockImplementation(() => true)
    await wrapper.find('#btn-rules-done').trigger('click')
    expect(wrapper.vm.isEditing).toBe(false)
    expect(wrapper.vm.hasChanged).toBe(true)
    expect(store.stateModel.rules.includedInResolution).toBe(false)
    expect(store.stateModel.rules.key).toBe('test-new-file')
    expect(store.stateModel.rules.name).toBe('test-new-file')
  })

  it('resetRules - restore rules state', async () => {
    // Setup entity snapshot, as resetRules restores this state.
    store.stateModel.entitySnapshot = {
      ...store.stateModel.entitySnapshot,
      businessDocuments: {
        documents: {
          certifiedRules: 'url'
        },
        documentsInfo: {
          certifiedRules: {
            key: 'key',
            name: 'name',
            includedInResolution: true,
            uploaded: '2022-01-01T08:00:00.000000+00:00'
          }
        }
      }
    }
    await wrapper.find('#btn-change-rules').trigger('click')
    await wrapper.find('#btn-rules-cancel').trigger('click')
    expect(wrapper.vm.hasChanged).toBe(false)
    expect(wrapper.vm.isEditing).toBe(false)
    expect(store.stateModel.rules.key).toBe('key')
    expect(store.stateModel.rules.name).toBe('name')
    expect(store.stateModel.rules.previouslyInResolution).toBe(true)
    expect(store.stateModel.rules.url).toBe('url')
    expect(store.stateModel.rules.uploaded).toBe('2022-01-01T08:00:00.000000+00:00')
  })

  it('rules on paper only - changed - included in SR', async () => {
    store.stateModel.rules.key = null
    store.stateModel.entitySnapshot = {
      ...store.stateModel.entitySnapshot,
      businessDocuments: {
        documents: {
          certifiedRules: 'url'
        },
        documentsInfo: {
          certifiedRules: {
            key: null,
            name: 'name',
            includedInResolution: true,
            uploaded: '2022-01-01T08:00:00.000000+00:00'
          }
        }
      }
    }
    await Vue.nextTick()
    expect(wrapper.find('#rules-paper-not-changed').text()).toContain('Available on paper only')

    await wrapper.find('#btn-change-rules').trigger('click')
    await wrapper.find('#btn-describe-rules').trigger('click')
    await wrapper.find('#chk-rules-describe').trigger('click')
    await wrapper.find('#btn-rules-done').trigger('click')

    store.stateModel.rules = { previouslyInResolution: false, includedInResolution: true }
    await Vue.nextTick()
    expect(wrapper.find('#rules-paper-changed').text()).toContain('Available on paper only')
    expect(wrapper.find('#rules-changes-included-resolution').text()).not.toContain('new')
    expect(wrapper.find('#rules-changes-included-resolution').text()).toContain('changes will be described')
    store.stateModel.rules = { previouslyInResolution: true, includedInResolution: true }
    await Vue.nextTick()
    expect(wrapper.find('#rules-changes-included-resolution').text()).toContain('new')
  })

  it('rules on paper only - changed - new Rules File', async () => {
    store.stateModel.entitySnapshot = {
      ...store.stateModel.entitySnapshot,
      businessDocuments: {
        documents: {
          certifiedRules: 'url'
        },
        documentsInfo: {
          certifiedRules: {
            key: null,
            name: 'name',
            includedInResolution: false,
            uploaded: '2022-01-01T08:00:00.000000+00:00'
          }
        }
      }
    }
    wrapper.vm.hasChanged = true
    wrapper.vm.isEditing = false
    await Vue.nextTick()
    expect(wrapper.find('#rules-paper-changed').text()).toContain('Available on paper only')
    store.stateModel.rules = { previouslyInResolution: false, key: '12345', name: '12345' }
    await Vue.nextTick()
    expect(wrapper.find('#rules-paper-changed').exists()).toBe(false)
    expect(wrapper.find('a').text()).toEqual('12345')
  })

  it('rules on paper only - unchanged - previously included in special resolution', async () => {
    store.stateModel.rules = { previouslyInResolution: true, key: null }
    wrapper.vm.hasChanged = false
    await Vue.nextTick()
    expect(wrapper.find('#rules-paper-not-changed').text()).toContain('Available on paper only')
    expect(wrapper.find('.last-modified-details').text()).toContain('filed previously to view any changes')
  })

  it('rules exists, not previously included in special resolution', async () => {
    store.stateModel.rules = {
      key: 'test',
      name: 'test',
      url: 'test',
      uploaded: '2022-01-01T08:00:00.000000+00:00',
      previouslyInResolution: false
    }
    await Vue.nextTick()
    expect(wrapper.find('a').text()).toEqual('test')
    expect(wrapper.find('.last-modified-details').text()).toEqual('Uploaded January 1, 2022')
    expect(wrapper.find('.last-modified-details').text()).not.toContain('filed previously to view any changes')
    expect(wrapper.find('.last-modified-details').text()).not.toContain('after this date to view')
  })

  it('rules exists, previously included in special resolution', async () => {
    store.stateModel.rules = {
      key: 'test',
      name: 'test',
      url: 'test',
      uploaded: '2022-01-01T08:00:00.000000+00:00',
      previouslyInResolution: true
    }
    await Vue.nextTick()
    expect(wrapper.find('a').text()).toEqual('test')
    expect(wrapper.find('.last-modified-details').text()).toContain('uploaded on January 1, 2022. Please refer')
    expect(wrapper.find('.last-modified-details').text()).toContain('after this date to view')
  })
})
