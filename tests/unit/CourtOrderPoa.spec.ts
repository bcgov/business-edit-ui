import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { Wrapper, createLocalVue, mount } from '@vue/test-utils'
import CourtOrderPoa from '@/components/common/CourtOrderPoa.vue'
import { CourtOrderPoa as CourtOrderPoaShared } from '@bcrs-shared-components/court-order-poa/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

const localVue = createLocalVue()
setActivePinia(createPinia())
const store = useStore()
localVue.use(VueRouter)

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
