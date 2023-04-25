// Libraries
import { createPinia, PiniaVuePlugin } from 'pinia'
import { Vue } from 'vue-facing-decorator'
import Vuex from 'vuex'

import * as States from './state'

/**
 * Configures and returns Vuex Store. - We still need this for sbc-common-components.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  return new Vuex.Store<any>({
    state: { ...States }
  })
}

/**
 * Configures and returns Pinia Store.
 */
export function getPiniaStore () {
  Vue.use(PiniaVuePlugin)

  return createPinia()
}
