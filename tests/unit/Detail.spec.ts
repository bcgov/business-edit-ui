import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { Wrapper, createLocalVue, mount } from '@vue/test-utils'
import Detail from '@/components/common/Detail.vue'
import { DetailComment as DetailCommentShared } from '@bcrs-shared-components/detail-comment/'
import { createPinia, setActivePinia } from 'pinia'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

const localVue = createLocalVue()
setActivePinia(createPinia())
localVue.use(VueRouter)

describe('Detail component', () => {
  let wrapper: Wrapper<Detail>

  beforeEach(() => {
    wrapper = mount(Detail, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', () => {
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
    expect(wrapper.findComponent(DetailCommentShared).exists()).toBe(true)
  })
})
