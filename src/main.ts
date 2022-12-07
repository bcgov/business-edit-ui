// Core Libraries
import 'core-js/stable' // to polyfill ECMAScript features
import 'regenerator-runtime/runtime' // to use transpiled generator functions

// Other Libraries
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import Vuelidate from 'vuelidate'
import Affix from 'vue-affix'
import Vue2Filters from 'vue2-filters' // needed by SbcFeeSummary
import Hotjar from 'vue-hotjar'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import { getVueRouter } from '@/router/'
import { getVuexStore } from '@/store/'

// Styles
// NB: order matters - do not change
import '@mdi/font/css/materialdesignicons.min.css' // ensure you are using css-loader
import '@/assets/styles/base.scss'
import '@/assets/styles/layout.scss'
import '@/assets/styles/overrides.scss'

// Base App
import App from './App.vue'

// Helpers
import { InitLdClient, FetchConfig, Navigate } from '@/utils/'
import KeycloakService from 'sbc-common-components/src/services/keycloak.services'

// get rid of "element implicitly has an 'any' type..."
declare const window: any

// get rid of "You are running Vue in development mode" console message
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Affix)
Vue.use(Vuelidate)
Vue.use(Vue2Filters)

// main code
async function start () {
  // fetch config from environment and API
  // must come first as inits below depend on config
  await FetchConfig()

  if (window['sentryEnable'] === 'true') {
    // initialize Sentry
    console.info('Initializing Sentry...') // eslint-disable-line no-console
    Sentry.init({
      dsn: window['sentryDsn'],
      integrations: [new Integrations.Vue({ Vue, attachProps: true })]
    })
  }

  // initialize Hotjar
  const hotjarId: string = window['hotjarId']
  if (hotjarId) {
    console.info('Initializing Hotjar...') // eslint-disable-line no-console
    Vue.use(Hotjar, { id: hotjarId })
  }

  // initialize Launch Darkly
  if (window['ldClientId']) {
    console.info('Initializing Launch Darkly...') // eslint-disable-line no-console
    await InitLdClient()
  }

  // configure KeyCloak Service
  console.info('Starting Keycloak service...') // eslint-disable-line no-console
  await KeycloakService.setKeycloakConfigUrl(sessionStorage.getItem('KEYCLOAK_CONFIG_PATH'))

  // initialize token service which will do a check-sso to initiate session
  // don't start during Jest tests as it messes up the test JWT
  if (process.env.JEST_WORKER_ID === undefined) {
    console.info('Starting token refresh service...') // eslint-disable-line no-console
    await KeycloakService.initializeToken()
  }

  // start Vue application
  console.info('Starting app...') // eslint-disable-line no-console
  new Vue({
    vuetify: new Vuetify({
      iconfont: 'mdi',
      theme: {
        themes: {
          light: {
            primary: '#1669bb', // same as $app-blue
            appDkBlue: '#38598a', // same as $app-dk-blue
            error: '#d3272c', // same as $app-red
            success: '#1a9031', // same as $app-green
            gray7: '#495057', // same as $gray7
            gray9: '#212529' // Same as $gray9
          }
        }
      }
    }),
    router: getVueRouter(),
    store: getVuexStore(),
    render: h => h(App)
  }).$mount('#app')
}

// execution and error handling
start().catch(error => {
  console.error(error) // eslint-disable-line no-console
  window.alert('There was an error starting this page. (See console for details.)\n' +
    'Please try again later.')
  // try to navigate to Business Registry home page
  Navigate(sessionStorage.getItem('BUSINESSES_URL'))
})
