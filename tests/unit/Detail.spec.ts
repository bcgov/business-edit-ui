import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { Wrapper, createLocalVue, mount } from '@vue/test-utils'
import { getVuexStore } from '@/store/'
import Detail from '@/components/common/Detail.vue'
import { DetailComment as DetailCommentShared } from '@bcrs-shared-components/detail-comment/'

Vue.use(Vuetify)

let vuetify = new Vuetify({})

const localVue = createLocalVue()

localVue.use(VueRouter)

describe('Detail component', () => {
  let store: any = getVuexStore()
  let wrapper: Wrapper<Detail>

  beforeEach(() => {
    wrapper = mount(Detail, { store, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', () => {
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
    expect(wrapper.findComponent(DetailCommentShared).exists()).toBe(true)
  })
})
