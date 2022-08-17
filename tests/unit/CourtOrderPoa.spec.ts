import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { Wrapper, createLocalVue, mount } from '@vue/test-utils'
import { getVuexStore } from '@/store/'
import CourtOrderPoa from '@/components/common/CourtOrderPoa.vue'
import { CourtOrderPoa as CourtOrderPoaShared } from '@bcrs-shared-components/court-order-poa/'

Vue.use(Vuetify)

let vuetify = new Vuetify({})

const localVue = createLocalVue()

localVue.use(VueRouter)

describe('CourtOrderPoa component', () => {
  let store: any = getVuexStore()
  let wrapper: Wrapper<CourtOrderPoa>

  beforeEach(() => {
    wrapper = mount(CourtOrderPoa, { store, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(CourtOrderPoa).exists()).toBe(true)
    expect(wrapper.findComponent(CourtOrderPoaShared).exists()).toBe(true)
  })
})
