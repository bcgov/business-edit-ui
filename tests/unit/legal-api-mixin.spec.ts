import Vue from 'vue'
import sinon from 'sinon'
import { shallowMount, Wrapper } from '@vue/test-utils'
import { axios } from '@/utils/'
import MixinTester from './mixin-tester.vue'
import { getVuexStore } from '@/store/'

const store = getVuexStore()

describe('Legal API Mixin', () => {
  let del: any
  let get: any
  let post: any
  let put: any
  let wrapper: Wrapper<Vue>
  let vm: any

  beforeEach(async () => {
    store.state.stateModel.tombstone.filingId = 1234
    store.state.stateModel.tombstone.businessId = 'CP1234567'
    del = sinon.stub(axios, 'delete')
    get = sinon.stub(axios, 'get')
    post = sinon.stub(axios, 'post')
    put = sinon.stub(axios, 'put')
    wrapper = shallowMount(MixinTester, { store })
    vm = wrapper.vm
    await Vue.nextTick()
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('fetches filing by id correctly', async () => {
    const FILING = {
      foo: 'bar'
    }

    // mock endpoint
    get.withArgs('businesses/CP1234567/filings/1234')
      .returns(Promise.resolve({ data: { filing: FILING } }))

    // call method
    const response = await vm.fetchFilingById(1234)

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
    const response = await vm.deleteFilingById(1234)

    // verify data
    expect(response).toBe(true)
  })

  it('updates a filing correctly', async () => {
    const FILING = {
      header: { filingId: 1234 },
      foo: 'bar'
    }

    // mock endpoint
    put.withArgs('businesses/CP1234567/filings/1234?draft=true')
      .returns(Promise.resolve({ data: { filing: FILING } }))

    // call method
    const response = await vm.updateFiling('CP1234567', FILING, 1234, true)

    // verify data
    expect(response).toEqual(FILING)
  })

  it('creates an alteration correctly', async () => {
    const ALTERATION = {
      header: { filingId: 1234 },
      foo: 'bar'
    }

    // mock endpoint
    post.withArgs('businesses/CP1234567/filings?draft=true')
      .returns(Promise.resolve({ data: { filing: ALTERATION } }))

    // call method
    const response = await vm.createFiling('CP1234567', ALTERATION, true)

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
    const response = await vm.fetchBusinessInfo('CP1234567')

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
    const response = await vm.fetchNameTranslations()

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
    const response = await vm.fetchAddresses()

    // verify data
    expect(response).toEqual(ADDRESSES)
  })

  it('fetches org persons correctly', async () => {
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
    const response = await vm.fetchDirectors()

    // verify data
    expect(response).toEqual(ORGPERSONS)
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
    const response = await vm.fetchShareStructure()

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
    const response = await vm.fetchResolutions()

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
    const nr = await vm.fetchNameRequest('NR1234567')

    // verify data
    expect(nr).toEqual(NR)
  })

  it('handles errors as expected', async () => {
    // mock the console.log function to suppress messages
    const log = console.log
    console.log = jest.fn()

    // verify fetchFilingById with no response.data
    get.withArgs('businesses/CP1234567/filings/1234').returns(Promise.resolve({}))
    await expect(vm.fetchFilingById(1234)).rejects.toThrow('Invalid API response')

    // verify deleteFilingById with axios error
    del.withArgs('businesses/CP1234567/filings/1234').returns(Promise.reject(new Error()))
    await expect(vm.deleteFilingById(1234)).rejects.toThrow('Invalid API response')

    // verify updateFiling with no response.data.filing.filingId
    put.withArgs('businesses/CP1234567/filings/1234?draft=true')
      .returns(Promise.resolve({ data: { filing: {} } }))
    await expect(vm.updateFiling('CP1234567', {}, 1234, true)).rejects.toThrow('Invalid API response')

    // verify createFiling with no response.data.filing.header.filingId
    post.withArgs('businesses/CP1234567/filings?draft=true')
      .returns(Promise.resolve({ data: { filing: { header: {} } } }))
    await expect(vm.createFiling('CP1234567', {}, true)).rejects.toThrow('Invalid API response')

    // verify fetchBusinessInfo with no response.data
    get.withArgs('businesses/CP1234567').returns(Promise.resolve({}))
    await expect(vm.fetchBusinessInfo('CP1234567')).rejects.toThrow('Invalid API response')

    // verify fetchNameTranslations with no response.data
    get.withArgs('businesses/CP1234567/aliases').returns(Promise.resolve({}))
    await expect(vm.fetchNameTranslations()).rejects.toThrow('Invalid API response')

    // verify fetchAddresses with no response.data
    get.withArgs('businesses/CP1234567/addresses').returns(Promise.resolve({}))
    await expect(vm.fetchAddresses()).rejects.toThrow('Invalid API response')

    // verify fetchOrgPersons with no response.data
    get.withArgs('businesses/CP1234567/directors').returns(Promise.resolve({}))
    await expect(vm.fetchDirectors()).rejects.toThrow('Invalid API response')

    // verify fetchShareStructure with no response.data
    get.withArgs('businesses/CP1234567/share-classes').returns(Promise.resolve({}))
    await expect(vm.fetchShareStructure()).rejects.toThrow('Invalid API response')

    // verify fetchResolutions with no response.data
    get.withArgs('businesses/CP1234567/resolutions').returns(Promise.resolve({}))
    await expect(vm.fetchResolutions()).rejects.toThrow('Invalid API response')

    // verify fetchNameRequest with no response.data
    get.withArgs('nameRequests/NR1234567').returns(Promise.resolve({}))
    await expect(vm.fetchNameRequest('NR1234567')).rejects.toThrow('Invalid API response')

    // restore console.log
    console.log = log
  })
})
