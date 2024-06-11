import sinon from 'sinon'
import { AxiosInstance as axios } from '@/utils/'
import BusinessLookupServices from '@/services/business-lookup-services'

describe('Business Lookup Services', () => {
  beforeAll(() => {
    sessionStorage.setItem('REGISTRIES_SEARCH_API_URL', 'https://search.api.url/')
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
    sinon.stub(axios, 'get')
      .withArgs('https://search.api.url/businesses/search/facets?start=0&rows=20&categories=legalType:' +
        'SP::status:ACTIVE&query=value:FM1000002')
      .returns(new Promise(resolve => resolve({ data: { searchResults: { results: [result] } } })))

    // search and look at results
    const results = await BusinessLookupServices.search('FM1000002', 'ACTIVE', 'SP')
    expect(results.length).toBe(1)
    expect(results[0]).toEqual(result)

    sinon.restore()
  })

  it('does not return a result when the business is not found', async () => {
    // mock unsuccesssful search
    sinon.stub(axios, 'get')
      .withArgs('https://search.api.url/businesses/search/facets?start=0&rows=20&categories=legalType' +
        ':SP::status:ACTIVE&query=value:FM1000003')
      .returns(new Promise(resolve => resolve({ data: { searchResults: { results: [] } } })))

    // search and look at results
    const results = await BusinessLookupServices.search('FM1000003', 'ACTIVE', 'SP')
    expect(results.length).toBe(0)

    sinon.restore()
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

    // mock successsful search
    sinon.stub(axios, 'get')
      .withArgs('https://search.api.url/businesses/search/facets?start=0&rows=20&categories=legalType:' +
        'GP,SP&query=value:FM100000')
      .returns(new Promise(resolve => resolve({ data: { searchResults: { results: [result1, result2] } } })))

    // search and look at results
    const results = await BusinessLookupServices.search('FM100000', '', 'GP,SP')
    expect(results.length).toBe(2)
    expect(results[0]).toEqual(result1)
    expect(results[1]).toEqual(result2)

    sinon.restore()
  })
})
