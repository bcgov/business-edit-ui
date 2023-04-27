import { AxiosInstance, FetchConfig } from '@/utils'

// mock the console.info function to hide the output
console.info = jest.fn()

describe('Fetch Config', () => {
  // init environment variable
  process.env.BASE_URL = '/businesses/edit/'
  process.env.VUE_APP_PATH = '/businesses/edit'
  process.env.VUE_APP_ADDRESS_COMPLETE_KEY = 'address complete key'
  process.env.VUE_APP_AUTH_API_URL = 'auth api url'
  process.env.VUE_APP_AUTH_API_VERSION = '/auth api version'
  process.env.VUE_APP_AUTH_WEB_URL = 'auth web url'
  process.env.VUE_APP_BUSINESSES_URL = 'businesses url'
  process.env.VUE_APP_BUSINESS_EDIT_LD_CLIENT_ID = 'business edit ld client id'
  process.env.VUE_APP_DASHBOARD_URL = 'dashboard url'
  process.env.VUE_APP_LEGAL_API_URL = 'legal api url'
  process.env.VUE_APP_LEGAL_API_VERSION_2 = '/legal api version 2'
  process.env.VUE_APP_NAICS_API_URL = 'naics api url'
  process.env.VUE_APP_NAICS_API_VERSION_2 = '/naics api version'
  process.env.VUE_APP_PAY_API_URL = 'pay api url'
  process.env.VUE_APP_PAY_API_VERSION = '/pay api version'
  process.env.VUE_APP_REGISTRY_HOME_URL = 'registry home url'
  process.env.VUE_APP_REGISTRIES_SEARCH_API_URL = 'registries search api url'
  process.env.VUE_APP_REGISTRIES_SEARCH_API_VERSION = '/registries search api version'
  process.env.VUE_APP_REGISTRIES_SEARCH_API_KEY = 'business api key'
  process.env.VUE_APP_SENTRY_DSN = 'sentry dsn'
  process.env.VUE_APP_SITEMINDER_LOGOUT_URL = 'siteminder logout url'
  process.env.VUE_APP_STATUS_API_URL = 'status api url'
  process.env.VUE_APP_STATUS_API_VERSION = '/status api version'
  process.env.VUE_APP_KEYCLOAK_AUTH_URL = 'keycloak url'
  process.env.VUE_APP_KEYCLOAK_REALM = 'keycloak realm'
  process.env.VUE_APP_KEYCLOAK_CLIENTID = 'keycloak clientid'

  it('fetches and loads the configuration correctly', async () => {
    // mock window.location getters
    delete window.location
    window.location = {
      origin: 'http://localhost',
      pathname: '/businesses/edit/BC1234567/correction',
      search: '?accountid=2288'
    } as any

    // call method
    await FetchConfig()

    // verify data
    expect(sessionStorage.getItem('AUTH_API_URL')).toBe('auth api url/auth api version/')
    expect(sessionStorage.getItem('AUTH_WEB_URL')).toBe('auth web url')
    expect(sessionStorage.getItem('BUSINESS_API_KEY')).toBe('business api key')
    expect(sessionStorage.getItem('BUSINESSES_URL')).toBe('businesses url')
    expect(sessionStorage.getItem('DASHBOARD_URL')).toBe('dashboard url')
    expect(sessionStorage.getItem('NAICS_URL')).toBe('naics api url/naics api version/')
    expect(sessionStorage.getItem('PAY_API_URL')).toBe('pay api url/pay api version/')
    expect(sessionStorage.getItem('REGISTRY_HOME_URL')).toBe('registry home url')
    expect(sessionStorage.getItem('SITEMINDER_LOGOUT_URL')).toBe('siteminder logout url')
    expect(sessionStorage.getItem('STATUS_API_URL')).toBe('status api url/status api version')
    expect(AxiosInstance.defaults.baseURL).toBe('legal api url/legal api version 2/')
    expect(window.addressCompleteKey).toBe('address complete key')
    expect(window.ldClientId).toBe('business edit ld client id')
    expect(window.sentryDsn).toBe('sentry dsn')
    expect(window.keycloakAuthUrl).toBe('keycloak url')
    expect(window.keycloakRealm).toBe('keycloak realm')
    expect(window.keycloakClientId).toBe('keycloak clientid')

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
      await FetchConfig()

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
    const error = await FetchConfig().catch(error => error)

    // verify error
    expect(error.message).toBe('Missing or invalid Business ID.')
  })
})
