import { AxiosInstance, FetchConfig } from '@/utils'
import sinon from 'sinon'

// mock the console.info function to hide the output
console.info = jest.fn()

describe('Fetch Config', () => {
  // init environment variable
  process.env.BASE_URL = '/businesses/edit/'

  beforeEach(() => {
    // stub config endpoint
    sinon.stub(AxiosInstance, 'get')
      .withArgs('http://localhost/businesses/edit/config/configuration.json')
      .returns(Promise.resolve({
        data: {
          ADDRESS_COMPLETE_KEY: 'address complete key',
          AUTH_API_URL: 'auth api url',
          AUTH_API_VERSION: '/auth api version',
          AUTH_WEB_URL: 'auth web url',
          BUSINESS_API_KEY: 'business api key',
          BUSINESSES_URL: 'businesses url',
          BUSINESS_EDIT_LD_CLIENT_ID: 'business edit ld client id',
          DASHBOARD_URL: 'dashboard url',
          KEYCLOAK_CONFIG_PATH: 'keycloak config path',
          LEGAL_API_URL: 'legal api url',
          LEGAL_API_VERSION_2: '/legal api version 2',
          NAICS_API_URL: 'naics api url',
          NAICS_API_VERSION: '/naics api version',
          PAY_API_URL: 'pay api url',
          PAY_API_VERSION: '/pay api version',
          REGISTRY_HOME_URL: 'registry home url',
          REGISTRIES_SEARCH_API_URL: 'registries search api url',
          REGISTRIES_SEARCH_API_VERSION: '/registries search api version',
          SENTRY_DSN: 'sentry dsn',
          SENTRY_ENABLE: 'sentry enable',
          SITEMINDER_LOGOUT_URL: 'siteminder logout url',
          STATUS_API_URL: 'status api url',
          STATUS_API_VERSION: '/status api version'
        }
      }))
  })

  afterEach(() => {
    sinon.restore()
  })

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
    expect(window['addressCompleteKey']).toBe('address complete key')
    expect(sessionStorage.getItem('AUTH_API_URL')).toBe('auth api url/auth api version/')
    expect(sessionStorage.getItem('AUTH_WEB_URL')).toBe('auth web url')
    expect(sessionStorage.getItem('BUSINESS_API_KEY')).toBe('business api key')
    expect(sessionStorage.getItem('BUSINESSES_URL')).toBe('businesses url')
    expect(window['ldClientId']).toBe('business edit ld client id')
    expect(sessionStorage.getItem('DASHBOARD_URL')).toBe('dashboard url')
    expect(sessionStorage.getItem('KEYCLOAK_CONFIG_PATH')).toBe('keycloak config path')
    expect(AxiosInstance.defaults.baseURL).toBe('legal api url/legal api version 2/')
    expect(sessionStorage.getItem('NAICS_URL')).toBe('naics api url/naics api version/')
    expect(sessionStorage.getItem('PAY_API_URL')).toBe('pay api url/pay api version/')
    expect(sessionStorage.getItem('REGISTRY_HOME_URL')).toBe('registry home url')
    expect(window['sentryDsn']).toBe('sentry dsn')
    expect(window['sentryEnable']).toBe('sentry enable')
    expect(sessionStorage.getItem('SITEMINDER_LOGOUT_URL')).toBe('siteminder logout url')
    expect(sessionStorage.getItem('STATUS_API_URL')).toBe('status api url/status api version')

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
