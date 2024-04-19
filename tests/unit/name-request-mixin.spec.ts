import Vue from 'vue'
import sinon from 'sinon'
import { shallowMount, Wrapper } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils/'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { NrRequestActionCodes } from '@bcrs-shared-components/enums'

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
        nameRequestTypes: [NrRequestActionCodes.CHANGE_NAME, NrRequestActionCodes.CONVERSION],
        correctNameOptions: []
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
    console.log = vi.fn()

    // mock fetchNameRequest to throw an error
    get.withArgs('nameRequests/NR 1234567/validate?phone=phone&email=email').returns(Promise.resolve(null))

    try {
      await vm.fetchValidateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toContain('Fetch Name Request error:')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['NOT_FOUND']])
    }

    // restore console.log
    console.log = log
  })

  it('handles invalid name requests', async () => {
    // mock fetchNameRequest to return invalid NR
    get.withArgs('nameRequests/NR 1234567/validate?phone=phone&email=email')
      .returns(Promise.resolve({ data: {
        applicants: { emailAddress: 'email', phoneNumber: 'phone' }
      } }))

    try {
      await vm.fetchValidateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Invalid Name Request')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['INVALID']])
    }
  })

  it('handles invalid name request states', async () => {
    // mock fetchNameRequest to return invalid NR state
    get.withArgs('nameRequests/NR 1234567/validate?phone=phone&email=email')
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
      await vm.fetchValidateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Invalid Name request state: NOT_APPROVED')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['NOT_APPROVED']])
    }
  })

  it('handles conditional state with consent required', async () => {
    // mock fetchNameRequest to return invalid NR state
    get.withArgs('nameRequests/NR 1234567/validate?phone=phone&email=email')
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
      await vm.fetchValidateNameRequest('NR 1234567', 'phone', 'email')
    } catch (err) {
      // verify thrown error
      expect((err as any).message).toBe('Invalid Name request state: NEED_CONSENT')
      // FUTURE: figure out how to verify emitted error (invalid-name-request)
      // expect(wrapper.emitted('invalid-name-request')).toEqual([['NEED_CONSENT']])
    }
  })

  it('handles conditional state with consent received', async () => {
    // mock fetchNameRequest to return valid NR state
    get.withArgs('nameRequests/NR 1234567/validate?phone=phone&email=email')
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

    const nr = await vm.fetchValidateNameRequest('NR 1234567', 'phone', 'email')
    expect(nr).not.toBeUndefined()
  })

  it('identifies valid and invalid NRs - default types', () => {
    store.resourceModel.changeData.nameRequestTypes = null

    let nr = null
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr = {}
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.state = 'APPROVED'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.expirationDate = '2021-11-05T07:01:00+00:00'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.names = [{ state: 'APPROVED', name: 'name' }]
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.nrNum = 'NR 1234567'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.requestTypeCd = 'CR'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.request_action_cd = 'NEW'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.request_action_cd = 'CHG'
    expect(vm.isNrInvalid(nr)).toBe(false) // valid

    nr.request_action_cd = 'CNV'
    expect(vm.isNrInvalid(nr)).toBe(false) // valid

    nr.request_action_cd = 'REH'
    expect(vm.isNrInvalid(nr)).toBe(false) // valid
  })

  it('identifies valid and invalid NRs - specified type', async () => {
    store.resourceModel.changeData.nameRequestTypes = [NrRequestActionCodes.RESTORE]

    let nr = null
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr = {}
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.state = 'APPROVED'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.expirationDate = '2021-11-05T07:01:00+00:00'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.names = [{ state: 'APPROVED', name: 'name' }]
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.nrNum = 'NR 1234567'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.requestTypeCd = 'CR'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.request_action_cd = 'NEW'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.request_action_cd = 'CNV'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.request_action_cd = 'CHG'
    expect(vm.isNrInvalid(nr)).toBe(true)

    nr.request_action_cd = 'REH'
    expect(vm.isNrInvalid(nr)).toBe(false) // valid
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
