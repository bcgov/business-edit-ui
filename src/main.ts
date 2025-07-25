// Core Libraries
import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Other Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueSanitize from 'vue-sanitize-directive'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters' // needed by SbcFeeSummary
import Hotjar from 'vue-hotjar'
import * as Sentry from '@sentry/vue'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import { getVueRouter } from '@/router/'
import { getPiniaStore, getVuexStore } from '@/store/'

// Styles
// NB: order matters - do not change
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'

// Base App
import App from './App.vue'

// Helpers
import { GetFeatureFlag, InitLdClient, FetchConfig, Navigate, Sleep } from '@/utils/'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'

// get rid of "element implicitly has an 'any' type..."
declare const window: any

// get rid of "You are running Vue in development mode" console message
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Affix)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)

// Default options - https://github.com/apostrophecms/sanitize-html (under Default options)
Vue.use(VueSanitize)

const vuetify = new Vuetify({
  iconfont: 'mdi',
  theme: {
    themes: {
      light: {
        primary: '#1669bb', // same as $app-blue
        appDkBlue: '#38598a', // same as $app-dk-blue
        error: '#d3272c', // same as $app-red
        success: '#1a9031', // same as $app-green
        gray7: '#495057', // same as $gray7
        gray9: '#212529', // Same as $gray9
        warning: '#fb8c00'
      }
    }
  }
})

// For Vue 3: remove - consult Assets team for a replacement.
Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'mdi'
})

// main code
async function start () {
  // initialize Launch Darkly
  window['ldClientId'] = import.meta.env.VUE_APP_BUSINESS_EDIT_LD_CLIENT_ID
  if (window['ldClientId']) {
    console.info('Initializing Launch Darkly...') // eslint-disable-line no-console
    await InitLdClient()
  }

  // fetch config from environment and set it locally
  FetchConfig()

  if (GetFeatureFlag('sentry-enable')) {
    // initialize Sentry
    console.info('Initializing Sentry...') // eslint-disable-line no-console
    Sentry.init({
      dsn: window['sentryDsn'],
      Vue
    })
  }

  // initialize Hotjar
  const hotjarId: string = window['hotjarId']
  if (hotjarId) {
    console.info('Initializing Hotjar...') // eslint-disable-line no-console
    Vue.use(Hotjar, { id: hotjarId })
  }

  // configure KeyCloak Service
  console.info('Starting Keycloak service...') // eslint-disable-line no-console
  const keycloakConfig: any = {
    url: `${window['keycloakAuthUrl']}`,
    realm: `${window['keycloakRealm']}`,
    clientId: `${window['keycloakClientId']}`
  }

  await KeycloakService.setKeycloakConfigUrl(keycloakConfig)

  // initialize token service which will do a check-sso to initiate session
  // don't start during Vitest tests as it messes up the test JWT
  if (import.meta.env.VITEST === undefined) {
    console.info('Starting token refresh service...') // eslint-disable-line no-console
    await KeycloakService.initializeToken()
  }

  // start Vue application
  const aboutApp = import.meta.env.ABOUT_APP
  console.info(`Starting ${aboutApp}...`) // eslint-disable-line no-console
  new Vue({
    vuetify: vuetify,
    router: getVueRouter(),
    // We still need Vuex for sbc-common-components.
    store: getVuexStore(),
    pinia: getPiniaStore(),
    render: h => h(App)
  }).$mount('#app')
}

// execution and error handling
start().catch(async (error) => {
  console.error(error) // eslint-disable-line no-console
  await Sleep(100) // wait for console error to be shown before alert

  window.alert('There was an error starting this page. (See console for details.)\n' +
    'Please try again later.')

  // try to navigate to Business Registry home page
  Navigate(sessionStorage.getItem('BUSINESSES_URL'))
})
