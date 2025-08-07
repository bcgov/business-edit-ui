import { AxiosInstance as axios, GetFeatureFlag } from '@/utils/'

/**
 * Fetches config from environment and sets items in session storage or window object.
 */
export function FetchConfig (): void {
  // get config from environment
  const origin = window.location.origin
  const processEnvVueAppPath: string = import.meta.env.VUE_APP_PATH
  const processEnvBaseUrl: string = import.meta.env.BASE_URL
  const windowLocationPathname = window.location.pathname // eg, /basePath/BC1218875/correction/
  const windowLocationOrigin = window.location.origin // eg, http://localhost:8080

  if (!origin || !processEnvVueAppPath || !processEnvBaseUrl || !windowLocationPathname || !windowLocationOrigin) {
    throw new Error('Missing environment variables.')
  }

  const authWebUrl: string = import.meta.env.VUE_APP_AUTH_WEB_URL
  sessionStorage.setItem('AUTH_WEB_URL', authWebUrl)

  const registryHomeUrl: string = import.meta.env.VUE_APP_REGISTRY_HOME_URL
  sessionStorage.setItem('REGISTRY_HOME_URL', registryHomeUrl)

  const nameRequestUrl: string = import.meta.env.VUE_APP_NAME_REQUEST_URL
  sessionStorage.setItem('NAME_REQUEST_URL', nameRequestUrl)

  const businessesUrl: string = import.meta.env.VUE_APP_BUSINESSES_URL
  sessionStorage.setItem('BUSINESSES_URL', businessesUrl)

  const businessDashUrl: string = import.meta.env.VUE_APP_BUSINESS_DASH_URL
  sessionStorage.setItem('BUSINESS_DASH_URL', businessDashUrl)

  // set Legal API URL or Business API GW URL depending on FF
  if (GetFeatureFlag('use-business-api-gw-url')) {
    const businessApiGwUrl: string =
      (import.meta.env.VUE_APP_BUSINESS_API_GW_URL + import.meta.env.VUE_APP_BUSINESS_API_VERSION_2 + '/')
    sessionStorage.setItem('BUSINESS_API_GW_URL', businessApiGwUrl)
    // set base URL for axios calls
    axios.defaults.baseURL = businessApiGwUrl
  } else {
    const legalApiUrl: string =
      (import.meta.env.VUE_APP_LEGAL_API_URL + import.meta.env.VUE_APP_LEGAL_API_VERSION_2 + '/')
    sessionStorage.setItem('LEGAL_API_URL', legalApiUrl)
    // set base URL for axios calls
    axios.defaults.baseURL = legalApiUrl
  }

  const naicsUrl: string = (import.meta.env.VUE_APP_NAICS_API_URL + import.meta.env.VUE_APP_NAICS_API_VERSION_2 + '/')
  sessionStorage.setItem('NAICS_URL', naicsUrl)

  const registriesSearchApiUrl: string =
    (import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_URL + import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION + '/')
  sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', registriesSearchApiUrl)

  // WARNING: AUTH_API_URL is needed for SbcHeader common component to load CURRENT_ACCOUNT object into session storage
  // FUTURE: SBC Header component should use Auth API GW URL
  const authApiUrl: string = (import.meta.env.VUE_APP_AUTH_API_URL + import.meta.env.VUE_APP_AUTH_API_VERSION + '/')
  sessionStorage.setItem('AUTH_API_URL', authApiUrl)

  const authApiGwUrl: string =
    (import.meta.env.VUE_APP_AUTH_API_GW_URL + import.meta.env.VUE_APP_AUTH_API_VERSION + '/')
  sessionStorage.setItem('AUTH_API_GW_URL', authApiGwUrl)

  // WARNING: PAY_API_URL is needed for SbcFeeSummary common component to fetch fees
  // FUTURE: Fee Summary component should use Pay API GW URL
  const payApiUrl: string = (import.meta.env.VUE_APP_PAY_API_URL + import.meta.env.VUE_APP_PAY_API_VERSION + '/')
  sessionStorage.setItem('PAY_API_URL', payApiUrl)

  const payApiGwUrl: string = (import.meta.env.VUE_APP_PAY_API_GW_URL + import.meta.env.VUE_APP_PAY_API_VERSION + '/')
  sessionStorage.setItem('PAY_API_GW_URL', payApiGwUrl)

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
    throw new Error('Missing or invalid Business ID.')
  }

  // set Base for Vue Router
  // eg, "/basePath/BCxxx/"
  const vueRouterBase = processEnvBaseUrl + id + '/'
  sessionStorage.setItem('VUE_ROUTER_BASE', vueRouterBase)

  // set Base URL for fetching local documents and for returning from redirects
  // eg, http://localhost:8080/basePath/BCxxx/
  const baseUrl = windowLocationOrigin + vueRouterBase
  sessionStorage.setItem('BASE_URL', baseUrl)
}
