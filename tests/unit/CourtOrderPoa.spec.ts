import Vue from 'vue'
import Vuetify from 'vuetify'
import { Wrapper, mount } from '@vue/test-utils'
import CourtOrderPoa from '@/components/common/CourtOrderPoa.vue'
import { CourtOrderPoa as CourtOrderPoaShared } from '@bcrs-shared-components/court-order-poa/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('CourtOrderPoa component', () => {
  let wrapper: Wrapper<CourtOrderPoa>

  beforeEach(() => {
    wrapper = mount(CourtOrderPoa, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(CourtOrderPoa).exists()).toBe(true)
    expect(wrapper.findComponent(CourtOrderPoaShared).exists()).toBe(true)
  })
})
