/* eslint-disable no-console */

import { axios } from '@/utils/'

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
  const windowLocationSearch = window.location.search // eg, ?accountid=2288

  if (!origin || !processEnvVueAppPath || !processEnvBaseUrl || !windowLocationPathname || !windowLocationOrigin) {
    return Promise.reject(new Error('Missing environment variables'))
  }

  // get and store account id, if present
  const accountId = new URLSearchParams(windowLocationSearch).get('accountid')
  if (accountId) {
    sessionStorage.setItem('ACCOUNT_ID', accountId)
    console.log('Set Account ID to: ' + accountId)
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

  const authWebUrl: string = response.data['AUTH_WEB_URL']
  sessionStorage.setItem('AUTH_WEB_URL', authWebUrl)
  console.log('Set Auth Web URL to: ' + authWebUrl)

  const registryHomeUrl = response.data['REGISTRY_HOME_URL']
  sessionStorage.setItem('REGISTRY_HOME_URL', registryHomeUrl)
  console.info('Set Registry Home URL to: ' + registryHomeUrl)

  const businessesUrl: string = response.data['BUSINESSES_URL']
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)
  console.log('Set Businesses URL to: ' + businessesUrl)

  const dashboardUrl: string = response.data['DASHBOARD_URL']
  sessionStorage.setItem('DASHBOARD_URL', dashboardUrl)
  console.log('Set Dashboard URL to: ' + dashboardUrl)

  const legalApiUrl: string = response.data['LEGAL_API_URL'] + response.data['LEGAL_API_VERSION_2'] + '/'
  // set base URL for axios calls
  axios.defaults.baseURL = legalApiUrl
  console.log('Set Legal API URL to: ' + legalApiUrl)

  const naicsUrl: string = response.data['NAICS_API_URL'] + response.data['NAICS_API_VERSION'] + '/'
  sessionStorage.setItem('NAICS_URL', naicsUrl)
  console.log('Set NAICS URL to: ' + naicsUrl)

  const authApiUrl: string = response.data['AUTH_API_URL'] + response.data['AUTH_API_VERSION'] + '/'
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)
  console.log('Set Auth API URL to: ' + authApiUrl)

  const payApiUrl: string = response.data['PAY_API_URL'] + response.data['PAY_API_VERSION'] + '/'
  sessionStorage.setItem('PAY_API_URL', payApiUrl)
  console.log('Set Pay API URL to: ' + payApiUrl)

  // for system alert banner (sbc-common-components)
  const statusApiUrl: string = response.data['STATUS_API_URL'] + response.data['STATUS_API_VERSION']
  sessionStorage.setItem('STATUS_API_URL', statusApiUrl)
  console.log('Set Status API URL to: ' + statusApiUrl)

  const keycloakConfigPath: string = response.data['KEYCLOAK_CONFIG_PATH']
  sessionStorage.setItem('KEYCLOAK_CONFIG_PATH', keycloakConfigPath)
  console.info('Set Keycloak Config Path to: ' + keycloakConfigPath)

  const addressCompleteKey: string = response.data['ADDRESS_COMPLETE_KEY']
  if (addressCompleteKey) {
    (<any>window).addressCompleteKey = addressCompleteKey
    console.info('Set Address Complete Key.')
  }

  const ldClientId: string = response.data['BUSINESS_EDIT_LD_CLIENT_ID']
  if (ldClientId) {
    (<any>window).ldClientId = ldClientId
    console.info('Set Launch Darkly Client ID.')
  }

  const sentryEnable = response.data['SENTRY_ENABLE'];
  (<any>window).sentryEnable = sentryEnable

  const sentryDsn = response.data['SENTRY_DSN']
  if (sentryDsn) {
    (<any>window).sentryDsn = sentryDsn
    console.log('Set Sentry DSN.')
  }

  // get Business ID and validate that it looks OK
  // it should be first token after Base URL in Pathname
  // FUTURE: improve Business ID validation
  const id = windowLocationPathname.replace(processEnvBaseUrl, '').split('/', 1)[0]
  if (id?.startsWith('BC') || id?.startsWith('FM')) { // Allow corps and firms
    sessionStorage.setItem('BUSINESS_ID', id)
  } else {
    return Promise.reject(new Error('Missing or invalid Business ID.'))
  }

  // set Base for Vue Router
  // eg, "/basePath/BCxxx/"
  const vueRouterBase = processEnvBaseUrl + id + '/'
  sessionStorage.setItem('VUE_ROUTER_BASE', vueRouterBase)
  console.info('Set Vue Router Base to: ' + vueRouterBase)

  // set Base URL for returning from redirects
  // eg, http://localhost:8080/basePath/BCxxx/
  const baseUrl = windowLocationOrigin + vueRouterBase
  sessionStorage.setItem('BASE_URL', baseUrl)
  console.info('Set Base URL to: ' + baseUrl)
}
