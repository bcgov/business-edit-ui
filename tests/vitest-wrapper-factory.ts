import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './unit/MockRouter'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const vuetify = new Vuetify({})
const localVue = createLocalVue()
const router = mockRouter.mock()

Vue.use(Vuetify)
Vue.use(Vuelidate)
localVue.use(VueRouter)

export const shallowWrapperFactory = (
  component,
  propsData = null,
  stateValues = null,
  routeName = null,
  resource = null
) => {
  setActivePinia(createPinia())
  const store = useStore()
  if (routeName) router.push({ name: routeName }).catch(() => {})
  if (stateValues) applyStoreValues(store, stateValues, resource)
  return shallowMount(component, {
    propsData: {
      ...propsData
    },
    localVue,
    router,
    vuetify
  })
}

export const wrapperFactory = (
  component,
  propsData = null,
  stateValues = null,
  routeName = null,
  resource = null,
  computed = null
) => {
  setActivePinia(createPinia())
  const store = useStore()
  if (routeName) router.push({ name: routeName }).catch(() => {})
  if (stateValues) applyStoreValues(store, stateValues, resource)
  return mount(component, {
    propsData: {
      ...propsData
    },
    localVue,
    router,
    vuetify,
    computed
  })
}

const applyStoreValues = (store, stateValues, resource) => {
  // Set Company Resources
  if (resource) store.resourceModel = resource

  // Set individual state properties
  const stateKeys = Object.keys(stateValues)
  stateKeys.forEach((key) => {
    console.log('*** setting key-val =', key, stateValues[key])
    store.stateModel[key] = stateValues[key]
  })
}
