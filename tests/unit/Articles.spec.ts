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
    //
  })

  it('displays the correct sections', () => {
    const router = mockRouter.mock()
    router.push({ name: 'alteration' })
    const wrapper = mount(Articles, { router, store, vuetify })

    wrapper.destroy()
  })
})
