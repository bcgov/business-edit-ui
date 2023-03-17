import sinon from 'sinon'
import { AxiosInstance as axios } from '@/utils/'
import { getVuexStore } from '@/store'

// mock the console.info function to hide the output
console.info = jest.fn()

describe('Test Filing Actions', () => {
  const store = getVuexStore() as any // remove typings for unit tests
  store.state.stateModel.tombstone.businessId = 'CP1234567'

  afterEach(() => {
    sinon.restore()
  })

  it('it fetches the business info by business id', async () => {
    sinon.stub(axios, 'get')
      .withArgs('businesses/CP1234567')
      .returns(Promise.resolve({ data: {
        business: {
          identifier: 'CP1234567',
          legalType: 'CP'
        }
      } }))
    await store.dispatch('fetchBusinessInfo', 'CP1234567')
      .then(() => {
        expect(store.getters.getBusinessInfo).toEqual({ identifier: 'CP1234567', legalType: 'CP' })
      })
  })

  it('it action returns promise reject when fetchBusinessInfo() returns the bad data', async () => {
    sinon.stub(axios, 'get')
      .withArgs('businesses/CP1234567')
      .returns(Promise.resolve({ bad: 'data' }))
    await expect(store.dispatch('fetchBusinessInfo', 'CP1234567')).rejects.toThrow(Error)
  })

  it('it fetches the business addresses by business id', async () => {
    sinon.stub(axios, 'get')
      .withArgs('businesses/CP1234567/addresses')
      .returns(Promise.resolve({ data: {
        address1: {},
        address2: {}
      } }))
    await store.dispatch('fetchAddresses', 'CP1234567')
      .then(() => {
        expect(store.getters.getAddresses).toEqual({ address1: {}, address2: {} })
      })
  })

  it('it fetches the filing by business id and filling id', async () => {
    sinon.stub(axios, 'get')
      .withArgs('businesses/CP1234567/filings/1234')
      .returns(Promise.resolve({ data: { filing: {
        foo: 'bar'
      } } }))
    await store.dispatch('fetchFilingByIds', { businessId: 'CP1234567', filingId: '1234' })
      .then((response) => {
        expect(response).toEqual({ foo: 'bar' })
      })
  })

  it('it fetches name translations by business id', async () => {
    sinon.stub(axios, 'get')
      .withArgs('businesses/CP1234567/aliases')
      .returns(Promise.resolve({ data: { aliases: [
        { name: 'one' },
        { name: 'two' }
      ] } }))
    await store.dispatch('fetchNameTranslations', 'CP1234567')
      .then(() => {
        expect(store.getters.getAliases).toEqual([{ name: 'one' }, { name: 'two' }])
      })
  })

  it('it fetches the directors by business id', async () => {
    sinon.stub(axios, 'get')
      .withArgs('businesses/CP1234567/directors')
      .returns(Promise.resolve({ data: { directors: [{ officer: 'director one' }, { officer: 'director two' }] } }))
    await store.dispatch('fetchDirectors', 'CP1234567')
      .then(() => {
        expect(store.getters.getDirectors).toHaveLength(2)
        expect(store.getters.getDirectors)
          .toEqual(expect.arrayContaining([
            expect.objectContaining({
              officer: 'director one'
            })
          ],
          [
            expect.objectContaining({
              officer: 'director two'
            })
          ]
          ))
      })
  })

  it('it fetches authentication info by business id', async () => {
    sessionStorage.setItem('AUTH_API_URL', 'http://localhost/')
    sinon.stub(axios, 'get')
      .withArgs('http://localhost/entities/CP1234567')
      .returns(Promise.resolve({ data: {
        folioNumber: '334444',
        contacts: [
          {
            email: 'user@domain.net',
            phone: '250-555-1212',
            phoneExtension: '123'
          }
        ] } }))
    await store.dispatch('fetchAuthentication', 'CP1234567')
      .then(() => {
        expect(store.getters.getAuthData).toEqual({
          folioNumber: '334444',
          contact: {
            email: 'user@domain.net',
            phone: '250-555-1212',
            extension: '123'
          } })
      })
  })

  it('it fetches state filing by URL', async () => {
    const url = 'http://localhost/some/filing/url'
    store.commit('setBusinessInfo', { stateFiling: url })
    sinon.stub(axios, 'get')
      .withArgs(url)
      .returns(Promise.resolve({ data: {
        filing: {
          header: 'some header'
        }
      }
      }))
    await store.dispatch('fetchStateFiling')
      .then(() => {
        expect(store.getters.getStateFilingData).toEqual({
          header: 'some header'
        })
      })
  })
})
