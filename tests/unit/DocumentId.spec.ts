import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import DocumentId from '@/components/common/DocumentId.vue'
import { DocumentId as DocumentIdShared } from '@bcrs-shared-components/document-id/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

/**
 * Helper to create and mount the component.
 */
function createComponent (): Wrapper<DocumentId> {
  return mount(DocumentId, {
    vuetify,
    propsData: {
      sectionNumber: '1. '
    }
  })
}

describe('DocumentId.vue', () => {
  it('mounts the document ID section and the shared DocumentId component', () => {
    const wrapper: Wrapper<DocumentId> = createComponent()

    expect(wrapper.findComponent(DocumentId).exists()).toBe(true)
    expect(wrapper.findComponent(DocumentIdShared).exists()).toBe(true)

    wrapper.destroy()
  })

  it('initializes docId and isDocIdValid from the store', () => {
    const wrapper: Wrapper<DocumentId> = createComponent()

    expect((wrapper.vm as any).docId).toBe('')
    expect((wrapper.vm as any).isDocIdValid).toBe(false)

    wrapper.destroy()
  })

  it('updates store state when docId or isDocIdValid changes', async () => {
    const wrapper: Wrapper<DocumentId> = createComponent()
    const vm = wrapper.vm as any

    vm.docId = 'new-doc-id'
    vm.isDocIdValid = false
    await wrapper.vm.$nextTick()

    expect(store.stateModel.documentIdState.consumerDocumentId).toBe('new-doc-id')
    expect(store.stateModel.documentIdState.valid).toBe(false)

    wrapper.destroy()
  })
})
