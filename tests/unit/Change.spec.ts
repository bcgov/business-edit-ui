import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils/'
import Change from '@/views/Change.vue'
import ViewWrapper from '@/components/ViewWrapper.vue'
import mockRouter from './MockRouter'
import { BusinessContactInfo, BusinessStartDate, BusinessType, CertifySection, CompletingParty,
  CourtOrderPoa, DocumentsDelivery, EntityName, NatureOfBusiness, OfficeAddresses, PeopleAndRoles,
  StaffPayment, TransactionalFolioNumber } from '@/components/common'
import { ChangeSummary } from '@/components/Change'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { ActionTypes, AuthorizationRoles, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { setAuthRole } from 'tests/set-auth-roles'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Change component', () => {
  let wrapper: any
  const { assign } = window.location

  // Define Session
  sessionStorage.setItem('PAY_API_GW_URL', 'https://pay-api-gw.url/')
  sessionStorage.setItem('AUTH_API_GW_URL', 'https://auth-api-gw.url/')
  sessionStorage.setItem('AUTH_WEB_URL', 'https://auth-web.url/')
  sessionStorage.setItem('BUSINESS_DASH_URL', 'https://business-dash.url/')
  sessionStorage.setItem('KEYCLOAK_TOKEN', 'keycloak-token') // anything non-falsy

  store.stateModel.tombstone.businessId = 'FM1234567'

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: vi.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET payment fee for immediate change
    get.withArgs('https://pay-api-gw.url/fees/FM/CHANGE')
      .returns(Promise.resolve({
        data: {
          'filingFees': 100.0,
          'filingType': 'Change',
          'filingTypeCode': 'CHANGE',
          'futureEffectiveFees': 0,
          'priorityFees': 0,
          'processingFees': 0,
          'serviceFees': 1.5,
          'tax': {
            'gst': 0,
            'pst': 0
          },
          'total': 101.5
        }
      }))

    // GET payment fee for future change
    get.withArgs('https://pay-api-gw.url/fees/FM/CHANGE?futureEffective=true')
      .returns(Promise.resolve({
        data: {
          'filingFees': 100.0,
          'filingType': 'Change',
          'filingTypeCode': 'CHANGE',
          'futureEffectiveFees': 100.0,
          'priorityFees': 0,
          'processingFees': 0,
          'serviceFees': 1.5,
          'tax': {
            'gst': 0,
            'pst': 0
          },
          'total': 201.5
        }
      }))

    // GET business
    get.withArgs('businesses/FM1234567')
      .returns(Promise.resolve({
        data: {
          business: {
            legalName: 'Mock Business Ltd.',
            legalType: 'SP',
            identifier: 'FM1234567'
          }
        }
      }))

    // GET business addresses
    get.withArgs('businesses/FM1234567/addresses')
      .returns(Promise.resolve({
        data: {
          deliveryAddress: {
            streetAddress: 'reg delivery_address - address line one',
            addressCity: 'delivery_address city',
            addressCountry: 'delivery_address country',
            postalCode: 'H0H0H0',
            addressRegion: 'BC'
          },
          mailingAddress: {
            streetAddress: 'reg mailing_address - address line two',
            addressCity: 'mailing_address city',
            addressCountry: 'mailing_address country',
            postalCode: 'H0H0H0',
            addressRegion: 'BC'
          }
        }
      }))

    // GET auth info
    get.withArgs('https://auth-api-gw.url/entities/FM1234567')
      .returns(Promise.resolve({
        data: {
          contacts: [
            {
              email: 'mock@example.com',
              phone: '123-456-7890'
            }
          ]
        }
      }))

    // FUTURE: mock GET change filing

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'change' })

    wrapper = shallowMount(Change, { localVue,
      router,
      vuetify,
      data: () => ({
        showFee: false
      }),
      computed: {
        showFeeSummary: {
          get (): boolean {
            return this.$data.showFee
          },
          set (val: boolean) {
            this.$data.showFee = val
          }
        }
      }
    })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders Change view and sub-components - edit mode', () => {
    expect(wrapper.findComponent(Change).exists()).toBe(true)
    expect(wrapper.findComponent(ViewWrapper).exists()).toBe(true)

    // Business information page components
    expect(wrapper.findComponent(EntityName).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessType).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessStartDate).exists()).toBe(true)
    expect(wrapper.findComponent(NatureOfBusiness).exists()).toBe(true)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(true)

    // Review and confirm page components
    expect(wrapper.findComponent(ChangeSummary).exists()).toBe(false)
    expect(wrapper.findComponent(DocumentsDelivery).exists()).toBe(false)
    expect(wrapper.findComponent(CompletingParty).exists()).toBe(false)
    expect(wrapper.findComponent(CertifySection).exists()).toBe(false)
  })

  it('renders Change view and sub-components - summary mode', async () => {
    expect(wrapper.findComponent(Change).exists()).toBe(true)

    // change to summary mode
    store.stateModel.summaryMode = true
    wrapper.vm.showFee = true
    await Vue.nextTick()

    // Review and confirm page components
    expect(wrapper.findComponent(ChangeSummary).exists()).toBe(true)
    expect(wrapper.findComponent(DocumentsDelivery).exists()).toBe(true)
    expect(wrapper.findComponent(CompletingParty).exists()).toBe(true)
    expect(wrapper.findComponent(CertifySection).exists()).toBe(true)

    // Business information page components
    expect(wrapper.findComponent(EntityName).exists()).toBe(false)
    expect(wrapper.findComponent(BusinessType).exists()).toBe(false)
    expect(wrapper.findComponent(BusinessStartDate).exists()).toBe(false)
    expect(wrapper.findComponent(NatureOfBusiness).exists()).toBe(false)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(false)
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(false)
    expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(false)

    // cleanup
    store.stateModel.summaryMode = false
    wrapper.vm.showFee = false
  })

  it('transactional folio number component renders', async () => {
    // before
    expect(wrapper.findComponent(TransactionalFolioNumber).exists()).toBe(false)

    store.stateModel.summaryMode = true
    wrapper.vm.showFee = true
    await Vue.nextTick() // wait for re-render

    // after
    expect(wrapper.findComponent(TransactionalFolioNumber).exists()).toBe(true)

    // clean up
    store.stateModel.summaryMode = false
    wrapper.vm.showFee = false
  })

  it('Staff Payment, Court Order POA components display only for staff', async () => {
    expect(wrapper.findComponent(StaffPayment).exists()).toBe(false)
    expect(wrapper.findComponent(CourtOrderPoa).exists()).toBe(false)
    setAuthRole(store, AuthorizationRoles.STAFF)
    store.stateModel.summaryMode = true
    wrapper.vm.showFee = true
    // a wait needed as change to computed value triggers a re-rendering
    await Vue.nextTick()

    expect(wrapper.findComponent(StaffPayment).exists()).toBe(true)
    expect(wrapper.findComponent(CourtOrderPoa).exists()).toBe(true)
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)
    store.stateModel.summaryMode = false
    wrapper.vm.showFee = true
  })

  it('resource subtitle states individual sole proprietors can change legal name', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { partyType: 'person' },
        roles: [{ roleType: 'Proprietor' }]
      }
    ] as any
    const wrapper = shallowMount(Change, { vuetify })

    expect((wrapper.vm as any).firmChangeResource.changeData.orgPersonInfo.subtitle)
      .toContain('You can update the proprietor\'s information below. If ownership of the business has changed, ' +
        'a new registration is required.')

    wrapper.destroy()
  })

  it('resource subtitle states organization sole proprietors cannot change legal name', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { partyType: 'organization' },
        roles: [{ roleType: 'Proprietor' }]
      }
    ] as any
    const wrapper = shallowMount(Change, { vuetify })

    expect((wrapper.vm as any).firmChangeResource.changeData.orgPersonInfo.subtitle)
      .toContain('If you need to make changes to the business proprietor information, please')

    wrapper.destroy()
  })

  // FUTURE
  it.skip('loads the entity snapshot into the store', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    const state = store.stateModel

    // Validate business identifier
    expect(state.tombstone.businessId).toBe('FM1234567')

    // Validate Business
    expect(state.businessInformation.legalType).toBe('SP')
    expect(state.businessInformation.legalName).toBe('Mock Business Ltd.')
    expect(state.businessInformation.identifier).toBe('FM1234567')

    // Validate Office Addresses
    expect(state.officeAddresses.registeredOffice.deliveryAddress.streetAddress)
      .toBe('reg delivery_address - address line one')
    expect(state.officeAddresses.registeredOffice.mailingAddress.streetAddress)
      .toBe('rec mailing_address - address line two')

    // Validate People And Roles
    expect(store.stateModel.peopleAndRoles.orgPeople[0].officer.firstName).toBe('CAMERON')
    expect(store.stateModel.peopleAndRoles.orgPeople[0].officer.lastName).toBe('BOWLER')
    expect(store.stateModel.peopleAndRoles.orgPeople[0].roles[0].roleType).toBe('Director')

    // Validate Contact Info
    expect(store.stateModel.businessContact.email).toBe('mock@example.com')
    expect(store.stateModel.businessContact.phone).toBe('123-456-7890')

    expect(store.stateModel.currentFees[0].filingFees).toBe(100)
    expect(store.stateModel.currentFees[0].futureEffectiveFees).toBe(0)
  })

  // FUTURE
  it.skip('fetches the fee prices after loading', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    expect(store.stateModel.feePrices[0].filingFees).toBe(100)
    expect(store.stateModel.feePrices[0].futureEffectiveFees).toBe(100)
  })

  // FUTURE
  it.skip('display the fee prices properly', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    store.stateModel.summaryMode = true
    expect(FilingTypes.ALTERATION).toBe('alteration')
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.nameTranslations = [{ action: ActionTypes.ADDED, name: 'mock name' }]
    await Vue.nextTick()

    expect(wrapper.find('#intro-text').text().replace(/\s+/g, ' '))
      .toContain('Certain changes require an Alteration Notice which will incur a $100.00 fee.')
    expect(wrapper.find('#intro-text').text().replace(/\s+/g, ' '))
      .toContain('Choosing an alteration date and time in the future will incur an additional $100.00 fee.')

    store.stateModel.feePrices = [{
      filingFees: null,
      filingType: null,
      filingTypeCode: null,
      futureEffectiveFees: null,
      priorityFees: null,
      processingFees: null,
      serviceFees: null,
      tax: {
        pst: null,
        gst: null
      },
      total: null
    }]
    await flushPromises()

    expect(wrapper.find('#intro-text').text().replace(/\s+/g, ' '))
      .toContain('Certain changes require an Alteration Notice which will incur a fee.')
    expect(wrapper.find('#intro-text').text().replace(/\s+/g, ' '))
      .toContain('Choosing an alteration date and time in the future will incur an additional fee.')
  })

  // FUTURE
  it.skip('updates the current fees when AlterationSummary changes', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    const state = store.stateModel
    state.effectiveDateTime.isFutureEffective = true

    await wrapper.vm.onAlterationSummaryChanges()
    expect(store.stateModel.currentFees[0].filingFees).toBe(100)
    expect(store.stateModel.currentFees[0].futureEffectiveFees).toBe(100)
  })

  // FUTURE
  it.skip('loads a draft alteration into the store', async () => {
    // Validate Effective Date-Time
    expect(store.stateModel.effectiveDateTime.isFutureEffective).toBe(true)
    expect(store.stateModel.effectiveDateTime.dateTimeString).toBe('2021-03-22T18:00:00.000Z')
    expect(store.stateModel.validationFlags.flagsReviewCertify.isValidEffectiveDate).toBe(true)
  })
})
