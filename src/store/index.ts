// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// Store modules
import * as States from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

/**
 * Configures and returns Vuex Store.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  return new Vuex.Store<any>({
    state: { ...States },
    getters,
    mutations,
    actions
  })
}
