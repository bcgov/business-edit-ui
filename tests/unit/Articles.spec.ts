import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import { Articles } from '@/components/Articles'
import mockRouter from './MockRouter'

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueRouter)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('articles', () => {
  beforeAll(() => {
    // init entity type
    //   store.state.stateModel.tombstone.entityType = 'BEN'
  })

  it('displays the correct sections', () => {
    const router = mockRouter.mock()
    router.push({ name: 'alteration' })
    const wrapper = mount(Articles, { router, vuetify })

    //   expect(wrapper.find('#summary-records-address').exists()).toBe(true)

    wrapper.destroy()
  })
})
