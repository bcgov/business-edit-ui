import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import CertifySection from '@/components/common/CertifySection.vue'
import { Certify as CertifyShared } from '@bcrs-shared-components/certify/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

const defaultDate = '2019-01-01'
const certifyClause = 'Certify Clause'

const resource = {
  entityType: 'BEN',
  displayName: 'BC Benefit Company',
  certifyClause: certifyClause
}

/**
 * Creates and mounts a component, so that it can be tested.
 */
function createComponent (): Wrapper<CertifySection> {
  return mount(CertifySection, {
    vuetify
  })
}

describe('Certify component', () => {
  beforeAll(() => {
    store.resourceModel = resource as any
    store.stateModel.tombstone.currentDate = defaultDate
    store.stateModel.tombstone.entityType = resource.entityType as CorpTypeCd
  })

  it('mounts the certify section and the imported certify component ', () => {
    const wrapper: Wrapper<CertifySection> = createComponent()

    expect(wrapper.findComponent(CertifySection).exists()).toBe(true)
    expect(wrapper.findComponent(CertifyShared).exists()).toBe(true)
  })

  it('fetches date to pass to Certify and converts to a readable format', () => {
    const wrapper: Wrapper<CertifySection> = createComponent()

    expect((wrapper.vm as any).getCurrentDate).toBe('2019-01-01')
  })

  it('fetches entityType to pass to Certify in a readable format', () => {
    const wrapper: Wrapper<CertifySection> = createComponent()

    expect((wrapper.vm as any).readableEntityType).toBe('BC Benefit Company')
  })

  it('fetches certify resource message to pass to Certify component', () => {
    const wrapper: Wrapper<CertifySection> = createComponent()

    expect((wrapper.vm as any).certifyMessage).toBe('Certify Clause')
  })
})
