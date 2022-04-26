import Vue from 'vue'
import Vuex from 'vuex'
import * as Actions from './actions'
import * as Getters from './getters'
import * as Mutations from './mutations'
import * as States from './state'

/**
 * Configures and returns Vuex Store.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  const store = new Vuex.Store<any>({
    actions: { ...Actions },
    getters: { ...Getters },
    mutations: { ...Mutations },
    state: { ...States }
  })

  return store
}
