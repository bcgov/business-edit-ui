/* eslint-disable no-console */

import { axios } from '@/utils'

/**
 * Fetches config from environment and API.
 * Also identifies Business ID from initial route.
 * @returns A promise to get & set session storage keys with appropriate values.
 */
export async function fetchConfig (): Promise<any> {
  // get config from environment
  const origin: string = window.location.origin
  const processEnvVueAppPath: string = process.env.VUE_APP_PATH
  const processEnvBaseUrl = process.env.BASE_URL
  const windowLocationPathname = window.location.pathname // eg, /basePath/BC1218875/correction/
  const windowLocationOrigin = window.location.origin // eg, http://localhost:8080

  if (!origin || !processEnvVueAppPath || !processEnvBaseUrl || !windowLocationPathname || !windowLocationOrigin) {
    return Promise.reject(new Error('Missing environment variables'))
  }

  // fetch config from API
  // eg, http://localhost:8080/basePath/config/configuration.json
  // eg, https://business-create-dev.pathfinder.gov.bc.ca/businesses/edit/config/configuration.json
  const url = `${origin}/${processEnvVueAppPath}/config/configuration.json`
  const headers = {
    'Accept': 'application/json',
    'ResponseType': 'application/json',
    'Cache-Control': 'no-cache'
  }

  const response = await axios.get(url, { headers }).catch(() => {
    return Promise.reject(new Error('Could not fetch configuration.json'))
  })

  /**
   * authConfig is a workaround to fix the user settings call as it expects a URL with no trailing slash.
   * This will be removed when a fix is made to sbc-common-components to handle this
   */
  const authConfig = {
    'VUE_APP_AUTH_ROOT_API': response.data['SBC_CONFIG_AUTH_API_URL']
  }
  const authConfigString = JSON.stringify(authConfig)
  sessionStorage.setItem('AUTH_API_CONFIG', authConfigString)
  console.log('AUTH_API_CONFIG: ' + authConfigString)

  const businessesUrl: string = response.data['BUSINESSES_URL']
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)
  console.log('Set Businesses URL to: ' + businessesUrl)

  const authUrl: string = response.data['AUTH_URL']
  sessionStorage.setItem('AUTH_URL', authUrl)
  console.log('Set Auth URL to: ' + authUrl)

  const dashboardUrl: string = response.data['DASHBOARD_URL']
  sessionStorage.setItem('DASHBOARD_URL', dashboardUrl)
  console.log('Set Dashboard URL to: ' + dashboardUrl)

  const legalApiUrl: string = response.data['LEGAL_API_URL']
  // set base URL for axios calls
  axios.defaults.baseURL = legalApiUrl
  console.log('Set Legal API URL to: ' + legalApiUrl)

  const authApiUrl: string = response.data['AUTH_API_URL']
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)
  console.log('Set Auth API URL to: ' + authApiUrl)

  const payApiUrl: string = response.data['PAY_API_URL']
  sessionStorage.setItem('PAY_API_URL', payApiUrl)
  console.log('Set Pay API URL to: ' + payApiUrl)

  const keycloakConfigPath: string = response.data['KEYCLOAK_CONFIG_PATH']
  sessionStorage.setItem('KEYCLOAK_CONFIG_PATH', keycloakConfigPath)
  console.info('Set Keycloak Config Path to: ' + keycloakConfigPath)

  const addressCompleteKey: string = response.data['ADDRESS_COMPLETE_KEY']
  if (addressCompleteKey) {
    (<any>window).addressCompleteKey = addressCompleteKey
    console.info('Set Address Complete Key.')
  }

  const ldClientId: string = response.data['LD_CLIENT_ID']
  if (ldClientId) {
    (<any>window).ldClientId = ldClientId
    console.info('Set Launch Darkly Client ID.')
  }

  const sentryDsn = response.data['SENTRY_DSN']
  if (sentryDsn) {
    (<any>window).sentryDsn = sentryDsn
    console.log('Set Sentry DSN.')
  }

  // get Business ID and validate that it looks OK
  // it should be first token after Base URL in Pathname
  // FUTURE: improve Business ID validation
  const id = windowLocationPathname.replace(processEnvBaseUrl, '').split('/', 1)[0]
  // if (id?.startsWith('CP') || id?.startsWith('BC')) { // FUTURE
  if (id?.startsWith('BC')) {
    sessionStorage.setItem('BUSINESS_ID', id)
  } else {
    return Promise.reject(new Error('Missing or invalid Business ID.'))
  }

  // set Base for Vue Router
  // eg, "/businesses/edit/BCxxx/"
  const vueRouterBase = processEnvBaseUrl + id + '/'
  sessionStorage.setItem('VUE_ROUTER_BASE', vueRouterBase)
  console.info('Set Vue Router Base to: ' + vueRouterBase)

  // set Base URL for returning from redirects
  // eg, http://localhost:8080/businesses/edit/BCxxx/
  const baseUrl = windowLocationOrigin + vueRouterBase
  sessionStorage.setItem('BASE_URL', baseUrl)
  console.info('Set Base URL to: ' + baseUrl)
}
