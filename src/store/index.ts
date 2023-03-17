// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

import * as States from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import Filings from './Filings'

/**
 * Configures and returns Vuex Store.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  return new Vuex.Store<any>({
    state: { ...States },
    getters,
    mutations,
    actions,
    modules: {
      filings: Filings
    }
  })
}
