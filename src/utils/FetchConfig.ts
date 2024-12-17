import { AxiosInstance as axios } from '@/utils/'

/**
 * Fetches config from environment and API.
 * Also identifies Business ID from initial route.
 * @returns A promise to get & set session storage keys with appropriate values.
 */
export async function FetchConfig (): Promise<any> {
  // get config from environment
  const origin = window.location.origin
  const processEnvVueAppPath: string = import.meta.env.VUE_APP_PATH
  const processEnvBaseUrl: string = import.meta.env.BASE_URL
  const windowLocationPathname = window.location.pathname // eg, /basePath/BC1218875/correction/
  const windowLocationOrigin = window.location.origin // eg, http://localhost:8080

  if (!origin || !processEnvVueAppPath || !processEnvBaseUrl || !windowLocationPathname || !windowLocationOrigin) {
    return Promise.reject(new Error('Missing environment variables.'))
  }

  const authWebUrl: string = import.meta.env.VUE_APP_AUTH_WEB_URL
  sessionStorage.setItem('AUTH_WEB_URL', authWebUrl)

  const registryHomeUrl: string = import.meta.env.VUE_APP_REGISTRY_HOME_URL
  sessionStorage.setItem('REGISTRY_HOME_URL', registryHomeUrl)

  const nameRequestUrl: string = import.meta.env.VUE_APP_NAME_REQUEST_URL
  sessionStorage.setItem('NAME_REQUEST_URL', nameRequestUrl)

  const businessesUrl: string = import.meta.env.VUE_APP_BUSINESSES_URL
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)

  const dashboardUrl: string = import.meta.env.VUE_APP_DASHBOARD_URL
  sessionStorage.setItem('DASHBOARD_URL', dashboardUrl)

  const legalApiUrl: string = (import.meta.env.VUE_APP_LEGAL_API_URL +
    import.meta.env.VUE_APP_LEGAL_API_VERSION_2 + '/')
  // set base URL for axios calls
  axios.defaults.baseURL = legalApiUrl

  const naicsUrl: string = (import.meta.env.VUE_APP_NAICS_API_URL + import.meta.env.VUE_APP_NAICS_API_VERSION_2 + '/')
  sessionStorage.setItem('NAICS_URL', naicsUrl)

  const registriesSearchApiUrl: string =
    (import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_URL + import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION + '/')
  sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', registriesSearchApiUrl)

  const registriesSearchApiKey: string = import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_KEY
  sessionStorage.setItem('REGISTRIES_SEARCH_API_KEY', registriesSearchApiKey)

  const authApiUrl: string = (import.meta.env.VUE_APP_AUTH_API_URL + import.meta.env.VUE_APP_AUTH_API_VERSION + '/')
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)

  const payApiUrl: string = (import.meta.env.VUE_APP_PAY_API_URL + import.meta.env.VUE_APP_PAY_API_VERSION + '/')
  sessionStorage.setItem('PAY_API_URL', payApiUrl)

  // for system alert banner (sbc-common-components)
  const statusApiUrl: string = (import.meta.env.VUE_APP_STATUS_API_URL + import.meta.env.VUE_APP_STATUS_API_VERSION)
  sessionStorage.setItem('STATUS_API_URL', statusApiUrl)

  const siteminderLogoutUrl: string = import.meta.env.VUE_APP_SITEMINDER_LOGOUT_URL
  if (siteminderLogoutUrl) {
    sessionStorage.setItem('SITEMINDER_LOGOUT_URL', siteminderLogoutUrl)
  }

  const keycloakAuthUrl: string = import.meta.env.VUE_APP_KEYCLOAK_AUTH_URL;
  (<any>window).keycloakAuthUrl = keycloakAuthUrl

  const keycloakRealm: string = import.meta.env.VUE_APP_KEYCLOAK_REALM;
  (<any>window).keycloakRealm = keycloakRealm

  const keycloakClientId: string = import.meta.env.VUE_APP_KEYCLOAK_CLIENTID;
  (<any>window).keycloakClientId = keycloakClientId

  const hotjarId: string = import.meta.env.VUE_APP_HOTJAR_ID;
  (<any>window).hotjarId = hotjarId

  const addressCompleteKey: string = import.meta.env.VUE_APP_ADDRESS_COMPLETE_KEY;
  (<any>window).addressCompleteKey = addressCompleteKey

  const ldClientId: string = import.meta.env.VUE_APP_BUSINESS_EDIT_LD_CLIENT_ID;
  (<any>window).ldClientId = ldClientId

  const sentryDsn: string = import.meta.env.VUE_APP_SENTRY_DSN;
  (<any>window).sentryDsn = sentryDsn

  // get Business ID and validate that it looks OK
  // it should be first token after Base URL in Pathname
  // FUTURE: improve Business ID validation
  const id = windowLocationPathname.replace(processEnvBaseUrl, '').split('/', 1)[0]
  const businessIdRegex = /^(BC|C|CP|FM)\d{7}$/
  if (businessIdRegex.test(id)) { // Allow corps/firms/coop
    sessionStorage.setItem('BUSINESS_ID', id)
  } else {
    return Promise.reject(new Error('Missing or invalid Business ID.'))
  }

  // set Base for Vue Router
  // eg, "/basePath/BCxxx/"
  const vueRouterBase = processEnvBaseUrl + id + '/'
  sessionStorage.setItem('VUE_ROUTER_BASE', vueRouterBase)

  // set Base URL for returning from redirects
  // eg, http://localhost:8080/basePath/BCxxx/
  const baseUrl = windowLocationOrigin + vueRouterBase
  sessionStorage.setItem('BASE_URL', baseUrl)
}
