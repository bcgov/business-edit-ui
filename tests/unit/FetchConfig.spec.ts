/* eslint-disable max-len */

import { AxiosInstance, FetchConfig } from '@/utils'

// mock the console.info function to hide the output
console.info = vi.fn()

describe('Fetch Config', () => {
  // init environment variable
  import.meta.env.BASE_URL = '/businesses/edit/'
  import.meta.env.VUE_APP_PATH = '/businesses/edit'
  import.meta.env.VUE_APP_ADDRESS_COMPLETE_KEY = 'address-complete-key'
  import.meta.env.VUE_APP_AUTH_API_GW_URL = 'https://auth-api-gw.url'
  import.meta.env.VUE_APP_AUTH_API_VERSION = '/auth-api-version'
  import.meta.env.VUE_APP_AUTH_WEB_URL = 'https://auth-web.url'
  import.meta.env.VUE_APP_BUSINESSES_URL = 'https://businesses.url'
  import.meta.env.VUE_APP_BUSINESS_EDIT_LD_CLIENT_ID = 'ld-client-id'
  import.meta.env.VUE_APP_BUSINESS_DASH_URL = 'https://business-dash.url'
  import.meta.env.VUE_APP_LEGAL_API_URL = 'https://legal-api.url'
  import.meta.env.VUE_APP_LEGAL_API_VERSION_2 = '/legal-api-version-2'
  // import.meta.env.VUE_APP_BUSINESS_API_GW_URL = 'https://business-api-gw.url'
  // import.meta.env.VUE_APP_BUSINESS_API_VERSION_2 = '/business-api-version-2'
  import.meta.env.VUE_APP_NAICS_API_URL = 'https://naics-api.url'
  import.meta.env.VUE_APP_NAICS_API_VERSION_2 = '/naics-api-version'
  import.meta.env.VUE_APP_PAY_API_GW_URL = 'https://pay-api-gw.url'
  import.meta.env.VUE_APP_PAY_API_VERSION = '/pay-api-version'
  import.meta.env.VUE_APP_REGISTRY_HOME_URL = 'https://registry-home.url'
  import.meta.env.VUE_APP_NAME_REQUEST_URL = 'https://name-request.url'
  import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_URL = 'https://registries-search-api.url'
  import.meta.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION = '/registries-search-api-version'
  import.meta.env.VUE_APP_SENTRY_DSN = 'sentry-dsn'
  import.meta.env.VUE_APP_SITEMINDER_LOGOUT_URL = 'https://siteminder-logout.url'
  import.meta.env.VUE_APP_STATUS_API_URL = 'https://status-api.url'
  import.meta.env.VUE_APP_STATUS_API_VERSION = '/status-api-version'
  import.meta.env.VUE_APP_KEYCLOAK_AUTH_URL = 'https://keycloak-auth.url'
  import.meta.env.VUE_APP_KEYCLOAK_REALM = 'bcregistry'
  import.meta.env.VUE_APP_KEYCLOAK_CLIENTID = 'entity-web'

  it('fetches and loads the configuration correctly', async () => {
    // mock window.location getters
    delete window.location
    window.location = {
      origin: 'http://localhost',
      pathname: '/businesses/edit/BC1234567/correction',
      search: '?accountid=2288'
    } as any

    // call method
    FetchConfig()

    // verify data
    expect(sessionStorage.getItem('AUTH_API_GW_URL')).toBe('https://auth-api-gw.url/auth-api-version/')
    expect(sessionStorage.getItem('AUTH_WEB_URL')).toBe('https://auth-web.url')
    expect(sessionStorage.getItem('BUSINESSES_URL')).toBe('https://businesses.url')
    expect(sessionStorage.getItem('BUSINESS_DASH_URL')).toBe('https://business-dash.url')
    expect(sessionStorage.getItem('LEGAL_API_URL')).toBe('https://legal-api.url/legal-api-version-2/')
    // expect(sessionStorage.getItem('BUSINESS_API_GW_URL')).toBe('https://business-api-gw.url/business-api-version-2/')
    expect(sessionStorage.getItem('NAICS_URL')).toBe('https://naics-api.url/naics-api-version/')
    expect(sessionStorage.getItem('PAY_API_GW_URL')).toBe('https://pay-api-gw.url/pay-api-version/')
    expect(sessionStorage.getItem('REGISTRY_HOME_URL')).toBe('https://registry-home.url')
    expect(sessionStorage.getItem('NAME_REQUEST_URL')).toBe('https://name-request.url')
    expect(sessionStorage.getItem('REGISTRIES_SEARCH_API_URL')).toBe('https://registries-search-api.url/registries-search-api-version/')
    expect(sessionStorage.getItem('SITEMINDER_LOGOUT_URL')).toBe('https://siteminder-logout.url')
    expect(sessionStorage.getItem('STATUS_API_URL')).toBe('https://status-api.url/status-api-version')
    expect(AxiosInstance.defaults.baseURL).toBe('https://legal-api.url/legal-api-version-2/')
    expect(window['addressCompleteKey']).toBe('address-complete-key')
    expect(window['sentryDsn']).toBe('sentry-dsn')
    expect(window['keycloakAuthUrl']).toBe('https://keycloak-auth.url')
    expect(window['keycloakRealm']).toBe('bcregistry')
    expect(window['keycloakClientId']).toBe('entity-web')

    expect(sessionStorage.getItem('VUE_ROUTER_BASE')).toBe('/businesses/edit/BC1234567/')
    expect(sessionStorage.getItem('BASE_URL')).toBe('http://localhost/businesses/edit/BC1234567/')
  })

  const tests = [
    { pathname: '/businesses/edit/BC1234567/correction', expected: 'BC1234567' },
    { pathname: '/businesses/edit/C1234567/correction', expected: 'C1234567' },
    { pathname: '/businesses/edit/CP1234567/correction', expected: 'CP1234567' },
    { pathname: '/businesses/edit/FM1234567/correction', expected: 'FM1234567' }
  ]

  for (const test of tests) {
    it(`sets business id correctly for ${test.pathname}`, async () => {
      // mock window.location getters
      delete window.location
      window.location = {
        origin: 'http://localhost',
        pathname: test.pathname
      } as any

      // call method
      FetchConfig()

      // verify data
      expect(sessionStorage.getItem('BUSINESS_ID')).toBe(test.expected)
    })
  }

  it('throws error on invalid id', async () => {
    // mock window.location getters
    delete window.location
    window.location = {
      origin: 'http://localhost',
      pathname: '/businesses/edit/ZZ1234567'
    } as any

    // call method
    let error
    try {
      error = FetchConfig()
    } catch (e) {
      error = e
    }

    // verify error
    expect(error.message).toBe('Missing or invalid Business ID.')
  })
})
