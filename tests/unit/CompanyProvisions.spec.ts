import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import { CompanyProvisions } from '@/components/Articles'
import mockRouter from './MockRouter'

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueRouter)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('company provisions', () => {
  beforeAll(() => {
    // init entity type
    //   store.state.stateModel.tombstone.entityType = 'BEN'
  })

  it('displays the correct sections', () => {
    const router = mockRouter.mock()
    router.push({ name: 'alteration' })
    const wrapper = mount(CompanyProvisions, { router, vuetify })

    expect(wrapper.find('#company-provisions').exists()).toBe(true)

    wrapper.destroy()
  })
})
