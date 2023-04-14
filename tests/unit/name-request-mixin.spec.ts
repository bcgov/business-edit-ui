import Vue from 'vue'
import sinon from 'sinon'
import { shallowMount, Wrapper } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils/'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, NameRequestTypes } from '@/enums'

setActivePinia(createPinia())
const store = useStore()

describe('Name Request Mixin', () => {
  let wrapper: Wrapper<Vue>
  let vm: any
  let get: any

  beforeEach(async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.resourceModel = {
      entityReference: '',
      displayName: '',
      addressLabel: '',
      filingData: null,
      changeData: {
        nameRequestTypes: [NameRequestTypes.CHANGE_OF_NAME, NameRequestTypes.CONVERSION],
        nameChangeOptions: []
      },
      certifyClause: ''
    }

    get = sinon.stub(axios, 'get')

    // mount the component and wait for everything to stabilize
    wrapper = shallowMount(MixinTester)
    vm = wrapper.vm
    await Vue.nextTick()
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('handles fetch errors', async () => {
    // mock the console.log function to suppress messages
    const log = console.log
    console.log = jest.fn()

    // mock fetchNameRequest to throw an error
    get.withArgs('nameRequests/NR 1234567').returns(Promise.resolve(null))

    try {
      await vm.validateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toContain('Fetch Name Request error:')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['NOT_FOUND']])
    }

    // restore console.log
    console.log = log
  })

  it('handles incorrect email errors', async () => {
    // mock fetchNameRequest to return different email address
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({ data: {
        applicants: { emailAddress: 'other' }
      } }))

    try {
      await vm.validateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Incorrect Email')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['INCORRECT_EMAIL']])
    }
  })

  it('handles incorrect phone errors', async () => {
    // mock fetchNameRequest to return different phone number
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({ data: {
        applicants: { emailAddress: 'email', phoneNumber: 'other' }
      } }))

    try {
      await vm.validateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Incorrect Phone')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['INCORRECT_PHONE']])
    }
  })

  it('handles invalid name requests', async () => {
    // mock fetchNameRequest to return invalid NR
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({ data: {
        applicants: { emailAddress: 'email', phoneNumber: 'phone' }
      } }))

    try {
      await vm.validateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Invalid Name Request')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['INVALID']])
    }
  })

  it('handles invalid name request states', async () => {
    // mock fetchNameRequest to return invalid NR state
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({ data: {
        applicants: { emailAddress: 'email', phoneNumber: 'phone' },
        state: 'DRAFT',
        expirationDate: '2021-11-05T07:01:00+00:00',
        names: [{ state: 'APPROVED', name: 'name' }],
        nrNum: 'NR 1234567',
        requestTypeCd: 'CR',
        request_action_cd: 'CHG'
      } }))

    try {
      await vm.validateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Invalid Name request state: NOT_APPROVED')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['NOT_APPROVED']])
    }
  })

  it('handles conditional state with consent required', async () => {
    // mock fetchNameRequest to return invalid NR state
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({ data: {
        applicants: { emailAddress: 'email', phoneNumber: 'phone' },
        state: 'CONDITIONAL',
        consentFlag: 'Y',
        expirationDate: '2021-11-05T07:01:00+00:00',
        names: [{ state: 'APPROVED', name: 'name' }],
        nrNum: 'NR 1234567',
        requestTypeCd: 'CR',
        request_action_cd: 'CHG'
      } }))

    try {
      await vm.validateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Invalid Name request state: NEED_CONSENT')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['NEED_CONSENT']])
    }
  })

  it('handles conditional state with consent received', async () => {
    // mock fetchNameRequest to return valid NR state
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({ data: {
        applicants: { emailAddress: 'email', phoneNumber: 'phone' },
        state: 'CONDITIONAL',
        consentFlag: 'R',
        expirationDate: '2021-11-05T07:01:00+00:00',
        names: [{ state: 'APPROVED', name: 'name' }],
        nrNum: 'NR 1234567',
        requestTypeCd: 'CR',
        request_action_cd: 'CHG'
      } }))

    const nr = await vm.validateNameRequest('NR 1234567', 'phone', 'email')
    expect(nr).not.toBeUndefined()
  })

  it('identifies valid and invalid NRs', () => {
    let nr = null
    expect(vm.isNrValid(nr)).toBe(false)

    nr = {}
    expect(vm.isNrValid(nr)).toBe(false)

    nr.state = 'APPROVED'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.expirationDate = '2021-11-05T07:01:00+00:00'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.names = [{ state: 'APPROVED', name: 'name' }]
    expect(vm.isNrValid(nr)).toBe(false)

    nr.nrNum = 'NR 1234567'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.requestTypeCd = 'CR'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.request_action_cd = 'NEW'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.request_action_cd = 'CHG'
    expect(vm.isNrValid(nr)).toBe(true)

    nr.request_action_cd = 'CNV'
    expect(vm.isNrValid(nr)).toBe(true)
  })

  it('identifies valid and invalid NRs for firms', async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.resourceModel.changeData.nameRequestTypes = [NameRequestTypes.CHANGE_OF_NAME]

    let nr = null
    expect(vm.isNrValid(nr)).toBe(false)

    nr = {}
    expect(vm.isNrValid(nr)).toBe(false)

    nr.state = 'APPROVED'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.expirationDate = '2021-11-05T07:01:00+00:00'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.names = [{ state: 'APPROVED', name: 'name' }]
    expect(vm.isNrValid(nr)).toBe(false)

    nr.nrNum = 'NR 1234567'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.requestTypeCd = 'CR'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.request_action_cd = 'NEW'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.request_action_cd = 'CNV'
    expect(vm.isNrValid(nr)).toBe(false)

    nr.request_action_cd = 'CHG'
    expect(vm.isNrValid(nr)).toBe(true)
  })

  it('identifies NRs that consumable and not consumable', () => {
    expect(vm.getNrState({ state: 'CONDITIONAL', consentFlag: 'Y' })).toBe('NEED_CONSENT')

    expect(vm.getNrState({ state: 'DRAFT' })).toBe('NOT_APPROVED')

    expect(vm.getNrState({ state: 'APPROVED' })).toBe('APPROVED')
    expect(vm.getNrState({ state: 'CONDITIONAL', consentFlag: 'R' })).toBe('CONDITIONAL')
    expect(vm.getNrState({ state: 'CONDITIONAL', consentFlag: 'N' })).toBe('CONDITIONAL')
    expect(vm.getNrState({ state: 'CONSUMED' })).toBe('CONSUMED')
    expect(vm.getNrState({ state: 'EXPIRED' })).toBe('EXPIRED')
  })

  it('returns a NR\'s approved name', () => {
    let nr = { names: [
      { state: 'NE', name: 'ne' },
      { state: 'APPROVED', name: 'approved' }
    ] }
    expect(vm.getNrApprovedName(nr)).toBe('approved')

    nr = { names: [
      { state: 'NE', name: 'ne' },
      { state: 'CONDITION', name: 'condition' }
    ] }
    expect(vm.getNrApprovedName(nr)).toBe('condition')

    nr = { names: [
      { state: 'NE', name: 'ne' }
    ] }
    expect(vm.getNrApprovedName(nr)).toBeUndefined()

    nr = { names: [] }
    expect(vm.getNrApprovedName(nr)).toBeNull()
  })

  it('maps a request type to a display description', () => {
    expect(vm.getNrRequestDesc('NEW')).toBe('New Business')
    expect(vm.getNrRequestDesc('CHG')).toBe('Change of Name')
    expect(vm.getNrRequestDesc('CNV')).toBe('Conversion')
  })
})
