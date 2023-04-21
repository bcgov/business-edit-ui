import Vue from 'vue'
import Vuetify from 'vuetify'
import { Wrapper, mount } from '@vue/test-utils'
import Detail from '@/components/common/Detail.vue'
import { DetailComment as DetailCommentShared } from '@bcrs-shared-components/detail-comment/'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore() // eslint-disable-line @typescript-eslint/no-unused-vars

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
