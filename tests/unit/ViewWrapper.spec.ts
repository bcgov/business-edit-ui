import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
import { shallowMount } from '@vue/test-utils'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import Actions from '@/components/common/Actions.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('View Wrapper component', () => {
  let wrapper: any

  beforeEach(() => {
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.filingData = [{ filingTypeCode: 'CRCTN', entityType: 'BEN' }]

    wrapper = shallowMount(ViewWrapper, {
      mocks: { $route: {} },
      store,
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
