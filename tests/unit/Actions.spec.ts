import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue, createWrapper } from '@vue/test-utils'
import sinon from 'sinon'
import { axios } from '@/utils'
import { Actions } from '@/components/common'
import mockRouter from './MockRouter'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Mock NR data
const nrData = {
  applicants: {
    addrLine1: 'address line 1',
    addrLine2: 'address line 2',
    addrLine3: 'address line 3',
    city: 'Victoria',
    countryTypeCd: 'CA',
    emailAddress: 'tester@test.com',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Joe',
    phoneNumber: '250-111-2222',
    postalCd: 'V1V 1A2',
    stateProvinceCd: 'BC'
  },
  consentFlag: 'R',
  corpNum: null as string,
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  requestTypeCd: 'BC',
  names: [
    {
      choice: 1,
      consumptionDate: null as string,
      corpNum: null as string,
      name: 'ABC 1234',
      state: 'APPROVED'
    },
    {
      choice: 2,
      consumptionDate: null,
      corpNum: null,
      name: 'CDE 1234',
      state: 'NE'
    }
  ],
  nrNum: 'NR 1234567',
  state: 'APPROVED'
}

describe('Action button states', () => {
  let wrapper: any
  let setEntityType: Function
  let setChanged: Function
  let setValidity: Function
  let setEditing: Function

  beforeAll(async () => {
    wrapper = shallowMount(Actions, { store, vuetify })
    await Vue.nextTick()

    setEntityType = async (val: string) => {
      await wrapper.vm.$store.commit('mutateEntityType', val)
    }

    setChanged = async (val: boolean) => {
      // set any changed flag
      await wrapper.vm.$store.commit('mutatePeopleAndRolesChanged', val)
    }

    setValidity = async (val: boolean) => {
      // set all validity flags
      await wrapper.vm.$store.commit('mutatePeopleAndRolesValidity', val)
      await wrapper.vm.$store.commit('mutateDetailValidity', val)
      await wrapper.vm.$store.commit('mutateCertifyStateValidity', val)
      await wrapper.vm.$store.commit('mutateStaffPaymentValidity', val)
    }

    setEditing = async (val: boolean) => {
      // set any editing flag
      await wrapper.vm.$store.commit('mutateEditingCompanyName', val)
    }
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('renders an empty container before Entity Type is known', () => {
    // empty container
    expect(wrapper.find('#action-buttons-container').exists()).toBe(true)
    expect(wrapper.find('#save-btn').exists()).toBe(false)
    expect(wrapper.find('#save-resume-btn').exists()).toBe(false)
    expect(wrapper.find('#file-pay-btn').exists()).toBe(false)
    expect(wrapper.find('#app-cancel-btn').exists()).toBe(false)
  })

  it('renders buttons once Entity Type is known', async () => {
    await setEntityType('BEN')
    // all buttons are rendered
    expect(wrapper.find('#action-buttons-container').exists()).toBe(true)
    expect(wrapper.find('#save-btn').exists()).toBe(true)
    expect(wrapper.find('#save-resume-btn').exists()).toBe(true)
    expect(wrapper.find('#file-pay-btn').exists()).toBe(true)
    expect(wrapper.find('#app-cancel-btn').exists()).toBe(true)
  })

  it('shows initial enabled buttons', async () => {
    await setEntityType('BEN')
    // only the File and Pay button should be disabled
    // (because the filing has not changed and is invalid)
    expect(wrapper.find('#save-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)
  })

  it('disables buttons while saving', async () => {
    await setEntityType('BEN')
    await setChanged(true)
    await setValidity(true)
    await wrapper.vm.setIsSaving(true)
    // all buttons should be disabled
    // Save button should be loading
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-btn').props('loading')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(true)
    // reset
    await setChanged(false)
    await setValidity(false)
    await wrapper.vm.setIsSaving(false)
  })

  it('disables buttons while saving and resuming', async () => {
    await setEntityType('BEN')
    await setChanged(true)
    await setValidity(true)
    await wrapper.vm.setIsSavingResuming(true)
    // all buttons should be disabled
    // Save and Resume button should be loading
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('loading')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(true)
    // reset
    await setChanged(false)
    await setValidity(false)
    await wrapper.vm.setIsSavingResuming(false)
  })

  it('disables buttons while filing and paying', async () => {
    await setEntityType('BEN')
    await setChanged(true)
    await setValidity(true)
    await wrapper.vm.setIsFilingPaying(true)
    // all buttons should be disabled
    // File and Pay button should be loading
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('loading')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(true)
    // reset
    await setChanged(false)
    await setValidity(false)
    await wrapper.vm.setIsFilingPaying(false)
  })

  it('disables buttons while editing', async () => {
    await setEntityType('BEN')
    await setChanged(true)
    await setValidity(true)
    await setEditing(true)
    // all buttons should be disabled except Cancel
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)
    // reset
    await setChanged(false)
    await setValidity(false)
    await setEditing(false)
  })

  it('disables File and Pay button when filing is changed but not valid', async () => {
    await setEntityType('BEN')
    await setChanged(true)
    // only the File and Pay button should be disabled
    expect(wrapper.find('#save-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)
    // reset
    await setChanged(false)
  })

  it('enables File and Pay button when filing is changed and valid', async () => {
    await setEntityType('BEN')
    await setChanged(true)
    await setValidity(true)
    // all buttons should be enabled
    expect(wrapper.find('#save-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)
    // reset
    await setChanged(false)
    await setValidity(false)
  })
})

describe.skip('Emits error event if NR validation fails in file and pay', () => {
  let wrapper: any
  const { assign } = window.location

  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/business/`)

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    let expiredNR = { ...nrData }
    expiredNR['expirationDate'] = 'Thu, 31 Dec 2019 23:59:59 GMT'

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise(resolve => resolve({
        data: expiredNR
      })))

    // init store
    store.state.stateModel.tombstone.currentDate = '2020/01/29'
    store.state.stateModel.nameRequest = {
      entityType: 'BEN',
      nrNumber: 'NR 1234567',
      details: { approvedName: 'My Name Request Inc.' }
    }
    store.state.stateModel.tombstone = {
      keycloakRoles: [],
      authRoles: [],
      userEmail: 'completing-party@example.com'
    }
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.defineCompanyStep = { valid: true }
    store.state.stateModel.peopleAndRolesStep = { valid: true }
    store.state.stateModel.shareStructureStep = { valid: true }
    store.state.stateModel.incorporationAgreementStep = { valid: true }
    store.state.stateModel.effectiveDateTime = { valid: true }

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'review-confirm', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('Emits the error event for an expired NR', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildIaFiling')

    await wrapper.vm.onClickFilePay()

    const rootWrapper = createWrapper(wrapper.vm.$root)

    expect(rootWrapper.emitted('name-request-invalid-error')).toEqual([['EXPIRED']])
    expect(mockBuildFiling).not.toHaveBeenCalled()
    expect(window.location.assign).not.toHaveBeenCalled()
    expect(wrapper.vm.$route.name).toBe('review-confirm')
  })
})

describe.skip('Actions component - Filing Functionality', () => {
  let wrapper: any
  const { assign } = window.location
  const effectiveDate = new Date(new Date().setDate(new Date().getDate() + 5))
  const formattedEffectiveDate = effectiveDate.toISOString().replace('Z', '+00:00')

  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/business/`)

  // the filing body that would get sent to the API
  const filing = {
    filing: {
      header: {
        name: 'incorporationApplication',
        certifiedBy: 'Certified By',
        date: '2020/01/29',
        effectiveDate: formattedEffectiveDate,
        folioNumber: null as string,
        isFutureEffective: false
      },
      business: {
        identifier: 'T1234567',
        legalType: 'BEN'
      },
      incorporationApplication: {
        nameRequest: {
          nrNumber: 'NR 1234567',
          legalType: 'BEN',
          legalName: 'My Name Request Inc.'
        },
        nameTranslations: {
          new: [] as string[]
        },
        offices: {
          registeredOffice: {
            deliveryAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            },
            mailingAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            }
          },
          recordsOffice: {
            deliveryAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            },
            mailingAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            }
          }
        },
        contactPoint: {
          email: 'registered-office@example.com',
          phone: '111-222-3333',
          extension: '444'
        },
        parties: [
          {
            officer: {
              id: 1,
              firstName: 'Joe',
              lastName: 'Swanson',
              middleName: 'P',
              orgName: '',
              partyType: 'person',
              email: 'completing-party@example.com'
            },
            mailingAddress: {
              streetAddress: 'mailing_address-addresslineone',
              streetAddressAdditional: '',
              addressCity: 'mailing_addresscity',
              addressCountry: 'CA',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            },
            deliveryAddress: {
              streetAddress: 'delivery_address-addresslineone',
              streetAddressAdditional: '',
              addressCity: 'delivery_addresscity',
              addressCountry: 'CA',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            },
            appointmentDate: '2018-01-01',
            roles: [
              {
                roleType: 'CompletingParty',
                appointmentDate: '2018-01-01'
              },
              {
                roleType: 'Director',
                appointmentDate: '2018-01-01'
              }
            ]
          },
          {
            officer: {
              id: 2,
              firstName: '',
              lastName: '',
              middleName: '',
              orgName: 'XyzInc.',
              partyType: 'org'
            },
            mailingAddress: {
              streetAddress: 'mailing_address-addresslineone',
              streetAddressAdditional: '',
              addressCity: 'mailing_addresscity',
              addressCountry: 'CA',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            },
            appointmentDate: '2018-01-01',
            roles: [
              {
                roleType: 'Incorporator',
                appointmentDate: '2018-01-01'
              }
            ]
          }
        ],
        shareClasses: [
          {
            id: 1,
            name: 'ShareClass1',
            priority: 1,
            hasMaximumShares: true,
            maxNumberOfShares: 100,
            hasParValue: true,
            parValue: 10,
            currency: 'CAD',
            hasRightsOrRestrictions: false,
            series: [
              {
                id: 1,
                name: 'ShareSeries1',
                priority: 1,
                hasMaximumShares: true,
                maxNumberOfShares: 50,
                hasRightsOrRestrictions: false
              },
              {
                id: 2,
                name: 'ShareSeries2',
                priority: 2,
                hasMaximumShares: true,
                maxNumberOfShares: 100,
                hasRightsOrRestrictions: false
              }
            ]
          },
          {
            id: 2,
            name: 'ShareClass2',
            priority: 1,
            hasMaximumShares: false,
            maxNumberOfShares: null,
            hasParValue: false,
            parValue: null,
            currency: null,
            hasRightsOrRestrictions: true,
            series: [

            ]
          }
        ],
        incorporationAgreement: {
          agreementType: 'sample'
        }
      }
    }
  }

  beforeEach(() => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any
    const get = sinon.stub(axios, 'get')

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise(resolve => resolve({
        data:
        {
          ...nrData
        }
      })))

    // init store
    store.state.stateModel.tombstone.currentDate = '2020/01/29'
    store.state.stateModel.nameRequest = {
      entityType: 'BEN',
      nrNumber: 'NR 1234567',
      details: { approvedName: 'My Name Request Inc.' }
    }
    store.state.stateModel.nameTranslations = []
    store.state.stateModel.tombstone = {
      keycloakRoles: [],
      authRoles: [],
      userEmail: 'completing-party@example.com'
    }
    store.state.stateModel.certifyState.certifiedBy = filing.filing.header.certifiedBy
    store.state.stateModel.defineCompanyStep.businessContact = {
      email: filing.filing.incorporationApplication.contactPoint.email,
      phone: filing.filing.incorporationApplication.contactPoint.phone,
      extension: filing.filing.incorporationApplication.contactPoint.extension
    }
    store.state.stateModel.effectiveDateTime.dateTimeString = effectiveDate.toISOString()
    store.state.stateModel.defineCompanyStep.businessContact = {
      email: 'registered-office@example.com',
      confirmEmail: 'registered-office@example.com',
      phone: '111-222-3333',
      extension: '444'
    }
    store.state.stateModel.defineCompanyStep.officeAddresses = filing.filing.incorporationApplication.offices
    store.state.stateModel.defineCompanyStep.folioNumber = filing.filing.header.folioNumber
    store.state.stateModel.peopleAndRolesStep.orgPeople = filing.filing.incorporationApplication.parties
    store.state.stateModel.shareStructureStep.shareClasses = filing.filing.incorporationApplication.shareClasses
    store.state.stateModel.tombstone.filingId = 1234
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.businessId = 'T1234567'
    store.state.stateModel.effectiveDateTime.isFutureEffective = filing.filing.header.isFutureEffective
    store.state.stateModel.incorporationAgreementStep.agreementType =
      filing.filing.incorporationApplication.incorporationAgreement.agreementType

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })

    // Mock the function calls that may used by updateFiling below
    jest.spyOn(wrapper.vm, 'updateFiling').mockImplementation()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('Calls the buildIaFiling method when onClickSave is called', async () => {
    // Mock the function call
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildIaFiling')

    // Work-around to interact with the stubbed vuetify button component in ShallowMount
    await wrapper.vm.onClickSave()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBe('define-company')
  })

  it('Calls the updateFiling method with the correct filing structure when onClickSave is called', async () => {
    const mockUpdateFiling = jest.spyOn(wrapper.vm, 'updateFiling')

    await wrapper.vm.onClickSave()

    expect(mockUpdateFiling).toHaveBeenCalledWith(filing, true)
    expect(mockUpdateFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBe('define-company')
  })

  it('Calls the buildIaFiling method when onClickSaveResume is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildIaFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // also verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })

  it('Calls the updateFiling method with the correct filing structure when onClickSaveResume is called', async () => {
    const mockUpdateFiling = jest.spyOn(wrapper.vm, 'updateFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockUpdateFiling).toHaveBeenCalledWith(filing, true)
    expect(mockUpdateFiling).toHaveReturned()

    // also verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })

  it('Emits the error event for a PAD error', async () => {
    const padErrorFiling = {
      'errors': [
        {
          'message': 'Your account is in the 3 day PAD confirmation period. You will be able to do transactions only ' +
            'after the period is over.',
          'payment_error_type': 'ACCOUNT_IN_PAD_CONFIRMATION_PERIOD'
        }
      ],
      'filing': filing
    }
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')
    const mockUpdateFiling = jest.spyOn(wrapper.vm, 'updateFiling')
      .mockImplementation(() => {
        return Promise.reject(padErrorFiling)
      })

    await wrapper.vm.onClickFilePay()
    await Vue.nextTick()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockUpdateFiling).toHaveBeenCalledWith(filing, false)
    expect(mockUpdateFiling).toHaveReturned()

    const rootWrapper = createWrapper(wrapper.vm.$root)
    const events = rootWrapper.emitted('save-error-event')
    expect(events.length).toBe(1)
    expect(events[0][0].errors[0].message).toBe('Your account is in the 3 day PAD confirmation period. You ' +
      'will be able to do transactions only after the period is over.')

    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('Calls the buildIaFiling and updateFiling methods when onClickFilePay is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildIaFiling')
    const mockUpdateFiling = jest.spyOn(wrapper.vm, 'updateFiling')
      .mockImplementation(() => Promise.resolve({
        header: {
          paymentToken: 789,
          isPaymentActionRequired: true
        }
      }))

    await wrapper.vm.onClickFilePay()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockUpdateFiling).toHaveBeenCalledWith(filing, false)
    expect(mockUpdateFiling).toHaveReturned()

    // verify redirection
    const baseUrl = 'myhost/basePath/auth/makepayment/789/myhost%2Fbusiness%2FT1234567'

    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })

  it('Emits "Go To Dashboard" event when onClickCancel is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildIaFiling')
    const mockUpdateFiling = jest.spyOn(wrapper.vm, 'updateFiling')

    await wrapper.vm.onClickCancel()

    expect(mockBuildFiling).not.toHaveBeenCalled()
    expect(mockUpdateFiling).not.toHaveBeenCalled()

    // verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })
})
