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
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'

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
  sessionStorage.setItem('KEYCLOAK_TOKEN', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJUbWdtZUk0MnVsdUZ0N3' +
    'FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiIzZDQ3YjgwYy01MTAzLTRjMTYtOGNhZC0yMjU4NDMwZGYwZTciLCJle' +
    'HAiOjE1Njg0ODk1NTksIm5iZiI6MCwiaWF0IjoxNTY4NDAzMTYwLCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2' +
    'EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwicmVhbG0tbWFuYWdlbWVudCIsImJyb2tlciIsImFjY291bnQ' +
    'iXSwic3ViIjoiZDRjNTBiZTAtYWM2OC00MDIyLTkxMGQtMzE2NzQ4NGFkOWU0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2JjLWF1dGgtd2Vi' +
    'Iiwibm9uY2UiOiJkMjljZTZlNS0xNzZhLTRkMTUtODUzZS05NWUzZmUwZmYwZjgiLCJhdXRoX3RpbWUiOjE1Njg0MDMxNTksInNlc3Npb25fc' +
    '3RhdGUiOiJiOTEwMzQxZi0xNzVjLTRkMTktYWI1Yy1iM2QxNTBiYjk0NjYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly' +
    '8xOTIuMTY4LjAuMTM6ODA4MC8iLCIxOTIuMTY4LjAuMTMiLCIqIiwiaHR0cDovLzE5Mi4xNjguMC4xMzo4MDgwIl0sInJlYWxtX2FjY2VzcyI' +
    '6eyJyb2xlcyI6WyJ2aWV3IiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwic3RhZmYiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImJhc2ljIl19LCJy' +
    'ZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsInZpZXctcmVhb' +
    'G0iLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsInJlYWxtLWFkbWluIiwiY3JlYXRlLWNsaWVudCIsIm1hbm' +
    'FnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmF' +
    'nZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9y' +
    'aXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJicm9rZXIiOnsicm9sZXMiOlsicmVhZC10b2tlbiJdfSwiYWNjb' +
    '3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOi' +
    'JvcGVuaWQiLCJmaXJzdG5hbWUiOiJTdW1lc2giLCJyb2xlcyI6WyJ2aWV3IiwiZWRpdCIsIm9mZmxpbmVfYWNjZXNzIiwic3RhZmYiLCJ1bWF' +
    'fYXV0aG9yaXphdGlvbiIsImJhc2ljIl0sIm5hbWUiOiJTdW1lc2ggS2FyaXlpbCIsInByZWZlcnJlZF91c2VybmFtZSI6InNrYXJpeWlsQGlk' +
    'aXIiLCJlbWFpbCI6InN1bWVzaC5wLmthcml5aWxAZ292LmJjLmNhIiwibGFzdG5hbWUiOiJLYXJpeWlsIiwidXNlcm5hbWUiOiJza2FyaXlpb' +
    'EBpZGlyIn0.MSPSakOnCUia4qd-fUpvP2PB3k977Eyhjxn-ykjadsUTEK4f2R3c8vozxaIIMH0-qUwduyQmdZCl3tQnXYQ9Ttf1PE9eMLS4sX' +
    'JiIUlDmKZ2ow7GmmDabic8igHnEDYD6sI7OFYnCJhRdgVEHN-_4KUk2YsAVl5XUr6blJKMuYDPeMyNreGTXU7foE4AT-93FwlyTyFzQGddrDv' +
    'c6kkQr7mgJNTtgg87DdYbVGbEtIetyVfvwEF0rU8JH2N-j36XIebo33FU3-gJ5Y5S69EHPqQ37R9H4d8WUrHO-4QzJQih3Yaea820XBplJeo0' +
    'DO3hQoVtPD42j0p3aIy10cnW2g')
  store.state.stateModel.tombstone.entityType = 'SP'
  store.state.stateModel.tombstone.businessId = 'FM1234567'

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET payment fee for immediate correction
    get.withArgs('https://pay.api.url/fees/SP/CORRECTION')
      .returns(Promise.resolve({
        data: {
          filingFees: 100.0,
          filingType: 'Correction',
          filingTypeCode: 'CORRECTION',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 1.5,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 101.5
        }
      }))

    // GET payment fee for future correction
    get.withArgs('https://pay.api.url/fees/SP/CORRECTION?futureEffective=true')
      .returns(Promise.resolve({
        data: {
          filingFees: 100.0,
          filingType: 'Correction',
          filingTypeCode: 'CORRECTION',
          futureEffectiveFees: 100.0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 1.5,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 201.5
        }
      }))

    // GET corrected filing
    get.withArgs('businesses/FM1234567/filings/123')
      .returns(Promise.resolve({
        data: {
          filing: {
            business: {},
            header: {},
            registration: {}
          }
        }
      }))

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
    expect(store.state.stateModel.staffPaymentStep.staffPayment.option).toBe(0)
  })

  // FUTURE
  xit('loads the business snapshot into the store', async () => {
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

    expect(store.state.stateModel.currentFees.filingFees).toBe(100)
    expect(store.state.stateModel.currentFees.futureEffectiveFees).toBe(0)
  })

  // FUTURE
  xit('fetches the fee prices after loading', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    expect(store.state.stateModel.feePrices.filingFees).toBe(100)
    expect(store.state.stateModel.feePrices.futureEffectiveFees).toBe(100)
  })

  // FUTURE
  xit('display the fee prices properly', async () => {
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

    store.state.stateModel.feePrices = {
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
    }
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
    expect(store.state.stateModel.currentFees.filingFees).toBe(100)
    expect(store.state.stateModel.currentFees.futureEffectiveFees).toBe(100)
  })

  // FUTURE
  xit('loads a draft correction into the store', async () => {
    // Validate Effective Date-Time
    expect(store.state.stateModel.effectiveDateTime.isFutureEffective).toBe(true)
    expect(store.state.stateModel.effectiveDateTime.dateTimeString).toBe('2021-03-22T18:00:00.000Z')
    expect(store.state.stateModel.validationFlags.flagsReviewCertify.isValidEffectiveDate).toBe(true)
  })
})
