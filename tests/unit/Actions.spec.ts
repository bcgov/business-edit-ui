import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue, createWrapper } from '@vue/test-utils'
import sinon from 'sinon'
import { AxiosInstance as axios } from '@/utils/'
import Actions from '@/components/common/Actions.vue'
import mockRouter from './MockRouter'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, CorrectionErrorTypes, FilingTypes } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

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
  corpNum: null,
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  requestTypeCd: 'BC',
  names: [
    {
      choice: 1,
      consumptionDate: null,
      corpNum: null,
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

  beforeAll(async () => {
    // initialize store
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.correctionInformation.type = CorrectionErrorTypes.CLIENT

    wrapper = shallowMount(Actions, { vuetify })
    await Vue.nextTick()
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
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)

    await Vue.nextTick()

    // all buttons are rendered
    expect(wrapper.find('#action-buttons-container').exists()).toBe(true)
    expect(wrapper.find('#save-btn').exists()).toBe(true)
    expect(wrapper.find('#save-resume-btn').exists()).toBe(true)
    expect(wrapper.find('#file-pay-btn').exists()).toBe(true)
    expect(wrapper.find('#app-cancel-btn').exists()).toBe(true)
  })

  it('shows initial enabled buttons', async () => {
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)

    // only the File and Pay button should be disabled
    // (because the filing has not changed and is initially invalid due to certify)
    expect(wrapper.find('#save-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)
  })

  it('disables buttons while saving', async () => {
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
    store.setPeopleAndRolesChanged(true)
    store.setCertifyStateValidity(true)
    await wrapper.vm.setIsSaving(true)

    // all buttons should be disabled
    // Save button should be loading
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-btn').props('loading')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(true)

    // reset
    store.setPeopleAndRolesChanged(false)
    store.setCertifyStateValidity(false)
    await wrapper.vm.setIsSaving(false)
  })

  it('disables buttons while saving and resuming', async () => {
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
    store.setPeopleAndRolesChanged(true)
    store.setCertifyStateValidity(true)
    await wrapper.vm.setIsSavingResuming(true)

    // all buttons should be disabled
    // Save and Resume button should be loading
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('loading')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(true)

    // reset
    store.setPeopleAndRolesChanged(false)
    store.setCertifyStateValidity(false)
    await wrapper.vm.setIsSavingResuming(false)
  })

  it('disables buttons while filing and paying', async () => {
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
    store.setPeopleAndRolesChanged(true)
    store.setCertifyStateValidity(true)
    await wrapper.vm.setIsFilingPaying(true)

    // all buttons should be disabled
    // File and Pay button should be loading
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('loading')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(true)

    // reset
    store.setPeopleAndRolesChanged(false)
    store.setCertifyStateValidity(false)
    await wrapper.vm.setIsFilingPaying(false)
  })

  it('disables buttons while editing', async () => {
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
    store.setPeopleAndRolesChanged(true)
    store.setCertifyStateValidity(true)
    store.setEditingCompanyName(true)

    await Vue.nextTick()

    // all buttons should be disabled except Cancel
    expect(wrapper.find('#save-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)

    // reset
    store.setPeopleAndRolesChanged(false)
    store.setCertifyStateValidity(false)
    store.setEditingCompanyName(false)
  })

  it('disables File and Pay button when filing is changed but not valid', async () => {
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
    store.setPeopleAndRolesChanged(true)

    // only the File and Pay button should be disabled
    expect(wrapper.find('#save-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)

    // reset
    store.setPeopleAndRolesChanged(false)
  })

  it('enables File and Pay button when filing is changed and valid', async () => {
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
    store.setPeopleAndRolesChanged(true)
    store.setCertifyStateValidity(true)

    await Vue.nextTick()

    // all buttons should be enabled
    expect(wrapper.find('#save-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#save-resume-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#file-pay-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#app-cancel-btn').props('disabled')).toBe(false)

    // reset
    store.setPeopleAndRolesChanged(false)
    store.setCertifyStateValidity(false)
  })
})

describe.skip('Emits error event if NR validation fails in file and pay', () => {
  let wrapper: any
  const { assign } = window.location

  sessionStorage.setItem('AUTH_WEB_URL', 'https://auth.web.url/')
  sessionStorage.setItem('DASHBOARD_URL', 'https://dashboard.url/')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    const expiredNR = { ...nrData }
    expiredNR['expirationDate'] = 'Thu, 31 Dec 2019 23:59:59 GMT'

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data: expiredNR
      }))

    // init store
    store.stateModel.tombstone.currentDate = '2020/01/29'
    store.stateModel.nameRequest = {
      entityType: 'BEN',
      nrNumber: 'NR 1234567',
      details: { approvedName: 'My Name Request Inc.' }
    } as any
    store.stateModel.tombstone = {
      keycloakRoles: [],
      authRoles: [],
      userEmail: 'completing-party@example.com'
    } as any
    store.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.validationFlags = {
      flagsCompanyInfo: {
        isValidOrgPersons: true,
        isValidShareStructure: true
      },
      flagsReviewCertify: {
        isValidEffectiveDate: true
      }
    } as any

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'review-confirm', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, router, vuetify })
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

  sessionStorage.setItem('AUTH_WEB_URL', 'https://auth.web.url/')
  sessionStorage.setItem('DASHBOARD_URL', 'https://dashboard.url/')

  // the filing body that would get sent to the API
  const filing = {
    filing: {
      header: {
        name: 'incorporationApplication',
        certifiedBy: 'Certified By',
        date: '2020/01/29',
        effectiveDate: formattedEffectiveDate,
        folioNumber: null,
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
          new: []
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
              organizationName: '',
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
              organizationName: 'XyzInc.',
              partyType: 'organization'
            },
            mailingAddress: {
              streetAddress: 'mailing_address-addresslineone',
              streetAddressAdditional: '',
              addressCity: 'mailing_addresscity',
              addressCountry: 'CA',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            },
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
        ]
      }
    }
  }

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any
    const get = sinon.stub(axios, 'get')

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(Promise.resolve({
        data:
        {
          ...nrData
        }
      }))

    // init store
    store.stateModel.tombstone.currentDate = '2020/01/29'
    store.stateModel.nameRequest = {
      entityType: CorpTypeCd.BENEFIT_COMPANY,
      nrNumber: 'NR 1234567',
      details: { approvedName: 'My Name Request Inc.' }
    } as any
    store.stateModel.nameTranslations = []
    store.stateModel.tombstone = {
      keycloakRoles: [],
      authRoles: [],
      userEmail: 'completing-party@example.com'
    } as any
    store.stateModel.certifyState.certifiedBy = filing.filing.header.certifiedBy
    store.stateModel.effectiveDateTime.dateTimeString = effectiveDate.toISOString()
    store.stateModel.businessContact = {
      email: 'registered-office@example.com',
      confirmEmail: 'registered-office@example.com',
      phone: '111-222-3333',
      extension: '444'
    } as any
    store.stateModel.officeAddresses = filing.filing.incorporationApplication.offices
    store.stateModel.tombstone.folioNumber = filing.filing.header.folioNumber
    store.stateModel.peopleAndRoles.orgPeople = filing.filing.incorporationApplication.parties as any
    store.stateModel.shareStructureStep.shareClasses = filing.filing.incorporationApplication.shareClasses as any
    store.stateModel.tombstone.filingId = 1234
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.businessId = 'T1234567'
    store.stateModel.effectiveDateTime.isFutureEffective = filing.filing.header.isFutureEffective

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'define-company', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, router, vuetify })

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
