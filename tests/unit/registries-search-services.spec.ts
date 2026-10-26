import { AxiosInstance as axios } from '@/utils/'
import sinon from 'sinon'
import RegistriesSearchServices from '@/services/registries-search-services'

describe('Registries Search Services', () => {
  const url = 'https://registries-search-api.url/search/businesses'

  beforeAll(() => {
    sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', 'https://registries-search-api.url/')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('returns a result when the business is found', async () => {
    const result = {
      bn: '701819922',
      identifier: 'FM1000002',
      legalType: 'SP',
      name: 'KK CONSTRUCTION',
      score: 10.642771,
      status: 'ACTIVE'
    }

    // mock successsful search
    sinon.stub(axios, 'post')
      .withArgs(url, {
        query: { value: 'FM1000002' },
        categories: { legalType: ['SP'], status: ['ACTIVE'] },
        start: 0,
        rows: 20
      })
      .resolves({ data: { searchResults: { results: [result] } } })

    // search and look at results
    const results = await RegistriesSearchServices.search('FM1000002', 'ACTIVE', 'SP')
    expect(results.length).toBe(1)
    expect(results[0]).toEqual(result)
  })

  it('does not return a result when the business is not found', async () => {
    // mock unsuccesssful search
    sinon.stub(axios, 'post')
      .withArgs(url, {
        query: { value: 'FM1000003' },
        categories: { legalType: ['SP'], status: ['ACTIVE'] },
        start: 0,
        rows: 20
      })
      .resolves({ data: { searchResults: { results: [] } } })

    // search and look at results
    const results = await RegistriesSearchServices.search('FM1000003', 'ACTIVE', 'SP')
    expect(results.length).toBe(0)
  })

  it('returns active and historical results when status is empty', async () => {
    const result1 = {
      identifier: 'FM1000001',
      legalType: 'GP',
      name: 'INDUSTIRES GP',
      score: 12.966249,
      status: 'ACTIVE'
    }
    const result2 = {
      bn: '701819922',
      identifier: 'FM1000002',
      legalType: 'SP',
      name: 'KK CONSTRUCTION',
      score: 10.642771,
      status: 'HISTORICAL'
    }

    // mock successsful search (no status category)
    sinon.stub(axios, 'post')
      .withArgs(url, {
        query: { value: 'FM100000' },
        categories: { legalType: ['GP', 'SP'] },
        start: 0,
        rows: 20
      })
      .resolves({ data: { searchResults: { results: [result1, result2] } } })

    // search and look at results
    const results = await RegistriesSearchServices.search('FM100000', '', 'GP,SP')
    expect(results.length).toBe(2)
    expect(results[0]).toEqual(result1)
    expect(results[1]).toEqual(result2)
  })

  it('filters out results without a valid identifier', async () => {
    const valid = { identifier: 'BC1234567', legalType: 'BC', name: 'VALID CORP', status: 'ACTIVE' }
    const invalid = { identifier: 'invalid', legalType: 'BC', name: 'INVALID CORP', status: 'ACTIVE' }

    sinon.stub(axios, 'post').resolves({ data: { searchResults: { results: [valid, invalid] } } })

    const results = await RegistriesSearchServices.search('CORP', 'ACTIVE', 'BC')
    expect(results).toEqual([valid])
  })

  it('throws when the API response is invalid', async () => {
    sinon.stub(axios, 'post').resolves({ data: {} })

    await expect(RegistriesSearchServices.search('CORP', 'ACTIVE', 'BC')).rejects.toThrow('Invalid API response')
  })
})
