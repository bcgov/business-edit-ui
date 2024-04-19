import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import Actions from '@/components/common/Actions.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('View Wrapper component', () => {
  let wrapper: any

  beforeEach(() => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.filingData = [{ filingTypeCode: 'CRCTN', entityType: 'BEN' }] as any

    wrapper = shallowMount(ViewWrapper, {
      mocks: { $route: {} },
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders correctly when there is no data', () => {
    expect(wrapper.findComponent(ConfirmDialogShared).exists()).toBe(true)
    expect(wrapper.find('.view-container').exists()).toBe(true)
    expect(wrapper.find('.left-side').exists()).toBe(true)
    expect(wrapper.find('.right-side').exists()).toBe(true)
    expect(wrapper.findComponent(Actions).exists()).toBe(true)
  })
})
