import sinon from 'sinon'
import { axios } from '@/utils/'
import LegalServices from '@/services/legal-services'

describe('Legal Services', () => {
  let del: any
  let get: any
  let post: any
  let put: any

  beforeEach(async () => {
    del = sinon.stub(axios, 'delete')
    get = sinon.stub(axios, 'get')
    post = sinon.stub(axios, 'post')
    put = sinon.stub(axios, 'put')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('fetches filing by id correctly', async () => {
    const FILING = {
      foo: 'bar'
    }

    // mock endpoint
    get.withArgs('businesses/CP1234567/filings/1234')
      .returns(Promise.resolve({ data: { filing: FILING } }))

    // call method
    const response = await LegalServices.fetchFilingById('CP1234567', 1234)

    // verify data
    expect(response).toEqual(FILING)
  })

  it('deletes filing by id correctly', async () => {
    const FILING = {
      foo: 'bar'
    }

    // mock endpoint
    del.withArgs('businesses/CP1234567/filings/1234')
      .returns(Promise.resolve(true))

    // call method
    const response = await LegalServices.deleteFilingById('CP1234567', 1234)

    // verify data
    expect(response).toBe(true)
  })

  it('updates a filing correctly', async () => {
    const FILING: any = {
      header: { filingId: 1234 },
      foo: 'bar'
    }

    // mock endpoint
    put.withArgs('businesses/CP1234567/filings/1234?draft=true')
      .returns(Promise.resolve({ data: { filing: FILING } }))

    // call method
    const response = await LegalServices.updateFiling('CP1234567', 1234, FILING, true)

    // verify data
    expect(response).toEqual(FILING)
  })

  it('creates an alteration correctly', async () => {
    const ALTERATION: any = {
      header: { filingId: 1234 },
      foo: 'bar'
    }

    // mock endpoint
    post.withArgs('businesses/CP1234567/filings?draft=true')
      .returns(Promise.resolve({ data: { filing: ALTERATION } }))

    // call method
    const response = await LegalServices.createFiling('CP1234567', ALTERATION, true)

    // verify data
    expect(response).toEqual(ALTERATION)
  })

  it('fetches business info correctly', async () => {
    const BUSINESS_INFO = {
      business: {
        identifier: 'CP1234567',
        legalType: 'CP'
      }
    }

    // mock endpoint
    get.withArgs('businesses/CP1234567')
      .returns(Promise.resolve({ data: BUSINESS_INFO }))

    // call method
    const response = await LegalServices.fetchBusinessInfo('CP1234567')

    // verify data
    expect(response).toEqual(BUSINESS_INFO.business)
  })

  it('fetches name translations correctly', async () => {
    const TRANSLATIONS = [
      { name: 'one' },
      { name: 'two' }
    ]

    // mock endpoint
    get.withArgs('businesses/CP1234567/aliases')
      .returns(Promise.resolve({ data: { aliases: TRANSLATIONS } }))

    // call method
    const response = await LegalServices.fetchNameTranslations('CP1234567')

    // verify data
    expect(response).toEqual(TRANSLATIONS)
  })

  it('fetches incorporation address correctly', async () => {
    const ADDRESSES = {
      address1: {},
      address2: {}
    }

    // mock endpoint
    get.withArgs('businesses/CP1234567/addresses')
      .returns(Promise.resolve({ data: ADDRESSES }))

    // call method
    const response = await LegalServices.fetchAddresses('CP1234567')

    // verify data
    expect(response).toEqual(ADDRESSES)
  })

  it('fetches directors correctly', async () => {
    const DIRECTORS = [
      { appointmentDate: '2022-04-01' },
      { appointmentDate: '2022-05-01' }
    ]
    const ORGPERSONS = [
      { roles: [{ appointmentDate: '2022-04-01', roleType: 'Director' }] },
      { roles: [{ appointmentDate: '2022-05-01', roleType: 'Director' }] }
    ]

    // mock endpoint
    get.withArgs('businesses/CP1234567/directors')
      .returns(Promise.resolve({ data: { directors: DIRECTORS } }))

    // call method
    const response = await LegalServices.fetchDirectors('CP1234567')

    // verify data
    expect(response[0]).toEqual(expect.objectContaining(ORGPERSONS[0]))
    expect(response[1]).toEqual(expect.objectContaining(ORGPERSONS[1]))
  })

  it('fetches parties correctly', async () => {
    const PARTIES = [
      { roles: [{ appointmentDate: '2022-04-01', roleType: 'Director' }] },
      { roles: [{ appointmentDate: '2022-05-01', roleType: 'Director' }] }
    ]

    // mock endpoint
    get.withArgs('businesses/CP1234567/parties')
      .returns(Promise.resolve({ data: { parties: PARTIES } }))

    // call method
    const response = await LegalServices.fetchParties('CP1234567')

    // verify data
    expect(response[0]).toEqual(expect.objectContaining(PARTIES[0]))
    expect(response[1]).toEqual(expect.objectContaining(PARTIES[1]))
  })

  it('fetches share structure correctly', async () => {
    const CLASSES = {
      shareClasses: [
        { id: 'Class A', series: [{ id: 'Series A1' }] },
        { id: 'Class B', series: [{ id: 'Series B1' }] }
      ]
    }

    // mock endpoint
    get.withArgs('businesses/CP1234567/share-classes')
      .returns(Promise.resolve({ data: CLASSES }))

    // call method
    const response = await LegalServices.fetchShareStructure('CP1234567')

    // verify data
    expect(response).toEqual(CLASSES)
    expect(response.shareClasses[0].type).toBe('Class')
    expect(response.shareClasses[0].series[0].type).toBe('Series')
    expect(response.shareClasses[1].type).toBe('Class')
    expect(response.shareClasses[1].series[0].type).toBe('Series')
  })

  it('fetches resolutions correctly', async () => {
    const RESOLUTIONS = [
      { resolution: 'one' },
      { resolution: 'two' }
    ]

    // mock endpoint
    get.withArgs('businesses/CP1234567/resolutions')
      .returns(Promise.resolve({ data: { resolutions: RESOLUTIONS } }))

    // call method
    const response = await LegalServices.fetchResolutions('CP1234567')

    // verify data
    expect(response).toEqual(RESOLUTIONS)
  })

  it('fetches name request correctly', async () => {
    const NR = {
      foo: 'bar'
    }

    // mock endpoint
    get.withArgs('nameRequests/NR1234567')
      .returns(Promise.resolve({ data: NR }))

    // call method
    const nr = await LegalServices.fetchNameRequest('NR1234567')

    // verify data
    expect(nr).toEqual(NR)
  })

  it('handles errors as expected', async () => {
    // mock the console.log function to suppress messages
    const log = console.log
    console.log = jest.fn()

    // verify fetchFilingById with no response.data
    get.withArgs('businesses/CP1234567/filings/1234').returns(Promise.resolve({}))
    await expect(LegalServices.fetchFilingById('CP1234567', 1234)).rejects.toThrow('Invalid API response')

    // verify deleteFilingById with axios error
    del.withArgs('businesses/CP1234567/filings/1234').returns(Promise.reject(new Error()))
    await expect(LegalServices.deleteFilingById('CP1234567', 1234)).rejects.toThrow('Invalid API response')

    // verify updateFiling with no response.data.filing.filingId
    put.withArgs('businesses/CP1234567/filings/1234?draft=true')
      .returns(Promise.resolve({ data: { filing: {} } }))
    await expect(LegalServices.updateFiling('CP1234567', 1234, {} as any, true)).rejects.toThrow('Invalid API response')

    // verify createFiling with no response.data.filing.header.filingId
    post.withArgs('businesses/CP1234567/filings?draft=true')
      .returns(Promise.resolve({ data: { filing: { header: {} } } }))
    await expect(LegalServices.createFiling('CP1234567', {} as any, true)).rejects.toThrow('Invalid API response')

    // verify fetchBusinessInfo with no response.data
    get.withArgs('businesses/CP1234567').returns(Promise.resolve({}))
    await expect(LegalServices.fetchBusinessInfo('CP1234567')).rejects.toThrow('Invalid API response')

    // verify fetchNameTranslations with no response.data
    get.withArgs('businesses/CP1234567/aliases').returns(Promise.resolve({}))
    await expect(LegalServices.fetchNameTranslations('CP1234567')).rejects.toThrow('Invalid API response')

    // verify fetchAddresses with no response.data
    get.withArgs('businesses/CP1234567/addresses').returns(Promise.resolve({}))
    await expect(LegalServices.fetchAddresses('CP1234567')).rejects.toThrow('Invalid API response')

    // verify directors with no response.data
    get.withArgs('businesses/CP1234567/directors').returns(Promise.resolve({}))
    await expect(LegalServices.fetchDirectors('CP1234567')).rejects.toThrow('Invalid API response')

    // verify parties with no response.data
    get.withArgs('businesses/CP1234567/parties').returns(Promise.resolve({}))
    await expect(LegalServices.fetchParties('CP1234567')).rejects.toThrow('Invalid API response')

    // verify fetchShareStructure with no response.data
    get.withArgs('businesses/CP1234567/share-classes').returns(Promise.resolve({}))
    await expect(LegalServices.fetchShareStructure('CP1234567')).rejects.toThrow('Invalid API response')

    // verify fetchResolutions with no response.data
    get.withArgs('businesses/CP1234567/resolutions').returns(Promise.resolve({}))
    await expect(LegalServices.fetchResolutions('CP1234567')).rejects.toThrow('Invalid API response')

    // verify fetchNameRequest with no response.data
    get.withArgs('nameRequests/NR1234567').returns(Promise.resolve({}))
    await expect(LegalServices.fetchNameRequest('NR1234567')).rejects.toThrow('Invalid API response')

    // restore console.log
    console.log = log
  })
})
