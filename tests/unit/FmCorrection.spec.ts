import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store/'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { axios } from '@/utils/'
import FmCorrection from '@/views/Correction/FmCorrection.vue'
import mockRouter from './MockRouter'
import { CertifySection, CompletingParty, Detail, PeopleAndRoles, StaffPayment, YourCompany } from '@/components/common'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Firm Correction component', () => {
  let wrapper: any
  const { assign } = window.location

  // Define Session
  sessionStorage.setItem('PAY_API_URL', 'https://pay.api.url/')
  sessionStorage.setItem('AUTH_API_URL', 'https://auth.api.url/')
  sessionStorage.setItem('AUTH_WEB_URL', 'https://auth.web.url/')
  sessionStorage.setItem('DASHBOARD_URL', 'https://dashboard.url/')
  store.state.stateModel.tombstone.entityType = 'SP'
  store.state.stateModel.tombstone.businessId = 'FM1234567'

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // FUTURE
    // GET payment fee for immediate correction
    // get.withArgs('https://pay.api.url/fees/SP/CORRECTION')
    //   .returns(Promise.resolve({
    //     data: {
    //       filingFees: 100.0,
    //       filingType: 'Correction',
    //       filingTypeCode: 'CORRECTION',
    //       futureEffectiveFees: 0,
    //       priorityFees: 0,
    //       processingFees: 0,
    //       serviceFees: 1.5,
    //       tax: {
    //         gst: 0,
    //         pst: 0
    //       },
    //       total: 101.5
    //     }
    //   }))

    // FUTURE
    // GET payment fee for future correction
    // get.withArgs('https://pay.api.url/fees/SP/CORRECTION?futureEffective=true')
    //   .returns(Promise.resolve({
    //     data: {
    //       filingFees: 100.0,
    //       filingType: 'Correction',
    //       filingTypeCode: 'CORRECTION',
    //       futureEffectiveFees: 100.0,
    //       priorityFees: 0,
    //       processingFees: 0,
    //       serviceFees: 1.5,
    //       tax: {
    //         gst: 0,
    //         pst: 0
    //       },
    //       total: 201.5
    //     }
    //   }))

    // GET business info
    get.withArgs('businesses/FM1234567')
      .returns(Promise.resolve({
        data: { business: { legalType: 'SP' } }
      }))

    // GET auth info
    get.withArgs('https://auth.api.url/entities/FM1234567')
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

    // GET addresses
    get.withArgs('businesses/FM1234567/addresses')
      .returns(Promise.resolve({
        data: {}
      }))

    // GET parties
    get.withArgs('businesses/FM1234567/parties')
      .returns(Promise.resolve({
        data: { parties: [] }
      }))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'correction' })
    wrapper = shallowMount(
      FmCorrection,
      {
        localVue,
        store,
        router,
        vuetify,
        propsData: {
          correctionFiling: {
            business: {},
            correction: { correctedFilingId: 123 },
            header: {}
          }
        },
        data: () => ({
          clientError: false
        }),
        computed: {
          isClientErrorCorrection: {
            get (): boolean {
              return this.$data.clientError
            },
            set (val: boolean) {
              this.$data.clientError = val
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

  it('renders Firm Correction view and default components', () => {
    expect(wrapper.findComponent(FmCorrection).exists()).toBe(true)

    // Default components
    expect(wrapper.findComponent(YourCompany).exists()).toBe(true)
    expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(true)
    expect(wrapper.findComponent(Detail).exists()).toBe(true)
    expect(wrapper.findComponent(StaffPayment).exists()).toBe(true)

    // Components that are only visable for client Error Corrections
    expect(wrapper.findComponent(CompletingParty).exists()).toBe(false)
    expect(wrapper.findComponent(CertifySection).exists()).toBe(false)
  })

  it('renders Firm Correction view and client error components', async () => {
    wrapper.vm.clientError = true
    // a wait needed as change to computed value triggers a re-rendering
    await Vue.nextTick()

    expect(wrapper.findComponent(CertifySection).exists()).toBe(true)
    expect(wrapper.findComponent(CompletingParty).exists()).toBe(true)
    wrapper.vm.clientError = false
  })

  it('staff payment is defaulted to no fee', () => {
    // Staff payment No Fee button needs option to be set to NO_FEE enum for the no fee button
    // to be selected in staff payment component
    expect(store.state.stateModel.staffPayment.option).toBe(0)
  })

  // FUTURE
  xit('loads the entity snapshot into the store', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    const state = store.state.stateModel

    // Validate business identifier
    expect(state.tombstone.businessId).toBe('FM1234567')

    // Validate Business
    expect(state.businessInformation.legalType).toBe('SP')
    expect(state.businessInformation.legalName).toBe('Mock Sole Prop')
    expect(state.businessInformation.identifier).toBe('FM1234567')

    // Validate Name Translations
    expect(state.nameTranslations[0].name).toBe('Mock Sole Prop French')

    // Validate Business Office Addresses
    expect(state.officeAddresses.registeredOffice.deliveryAddress.streetAddress)
      .toBe('delivery_address - address line one')
    expect(state.officeAddresses.recordsOffice.mailingAddress.streetAddress)
      .toBe('mailing_address - address line two')

    // Validate Proprietor
    expect(store.state.stateModel.peopleAndRoles.orgPeople[0].officer.firstName).toBe('CAMERON')
    expect(store.state.stateModel.peopleAndRoles.orgPeople[0].officer.lastName).toBe('BOWLER')
    expect(store.state.stateModel.peopleAndRoles.orgPeople[0].roles[0].roleType).toBe('Proprietor')

    // Validate Contact Info
    expect(store.state.stateModel.businessContact.email).toBe('mock@example.com')
    expect(store.state.stateModel.businessContact.phone).toBe('123-456-7890')

    expect(store.state.stateModel.currentFees[0].filingFees).toBe(100)
    expect(store.state.stateModel.currentFees[0].futureEffectiveFees).toBe(0)
  })

  // FUTURE
  xit('fetches the fee prices after loading', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    expect(store.state.stateModel.feePrices.filingFees).toBe(100)
    expect(store.state.stateModel.feePrices.futureEffectiveFees).toBe(100)
  })

  // FUTURE
  xit('displays the fee prices properly', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    store.state.stateModel.summaryMode = true
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.nameTranslations = [{ action: 'ACTION' }]
    await Vue.nextTick()

    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Certain changes require a Correction Notice which will incur a $100.00 fee.')
    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Choosing a correction date and time in the future will incur an additional $100.00 fee.')

    store.state.stateModel.feePrices = [{
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

    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Certain changes require a Correction Notice which will incur a fee.')
    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Choosing a correction date and time in the future will incur an additional fee.')
  })

  // FUTURE
  xit('updates the current fees when CorrectionSummary changes', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    const state = store.state.stateModel
    state.effectiveDateTime.isFutureEffective = true

    await wrapper.vm.onAlterationSummaryChanges()
    expect(store.state.stateModel.currentFees[0].filingFees).toBe(100)
    expect(store.state.stateModel.currentFees[0].futureEffectiveFees).toBe(100)
  })

  // FUTURE
  xit('loads a draft correction into the store', async () => {
    // Validate Effective Date-Time
    expect(store.state.stateModel.effectiveDateTime.isFutureEffective).toBe(true)
    expect(store.state.stateModel.effectiveDateTime.dateTimeString).toBe('2021-03-22T18:00:00.000Z')
    expect(store.state.stateModel.validationFlags.flagsReviewCertify.isValidEffectiveDate).toBe(true)
  })
})
