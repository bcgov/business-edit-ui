import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils/'
import Conversion from '@/views/Conversion.vue'
import ViewWrapper from '@/components/ViewWrapper.vue'
import mockRouter from './MockRouter'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { ActionTypes, FilingTypes } from '@bcrs-shared-components/enums'
import { BusinessStartDate, BusinessType, EntityName, FolioInformation, OfficeAddresses,
  YourCompanyWrapper } from '@/components/common'
import { ConversionNOB } from '@/components/Conversion'
import { AccountTypes } from '@/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Conversion component', () => {
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

  store.stateModel.tombstone.businessId = 'BC1234567'
  store.stateModel.accountInformation.accountType = AccountTypes.PREMIUM

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET payment fee for immediate alteration
    get.withArgs('https://pay.api.url/fees/FM/CONVERSION')
      .returns(Promise.resolve({
        data: {
          'filingFees': 100.0,
          'filingType': 'Conversion',
          'filingTypeCode': 'CONVERSION',
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

    // GET payment fee for future conversion
    get.withArgs('https://pay.api.url/fees/FM/CONVERSION?futureEffective=true')
      .returns(Promise.resolve({
        data: {
          'filingFees': 100.0,
          'filingType': 'Conversion',
          'filingTypeCode': 'CONVERION',
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
    get.withArgs('businesses/BC1234567')
      .returns(Promise.resolve({
        data: {
          business: {
            legalName: 'Mock Business Ltd.',
            legalType: 'BEN',
            identifier: 'BC1234567'
          }
        }
      }))

    // GET business name translations
    get.withArgs('businesses/BC1234567/aliases')
      .returns(Promise.resolve({
        data: {
          aliases: [{
            name: 'Mock Business French Ltd.',
            id: '12'
          }]
        }
      }))

    // GET business addresses
    get.withArgs('businesses/BC1234567/addresses')
      .returns(Promise.resolve({
        data: {
          registeredOffice: {
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
          },
          recordsOffice: {
            deliveryAddress: {
              streetAddress: 'rec delivery_address - address line one',
              addressCity: 'delivery_address city',
              addressCountry: 'delivery_address country',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            },
            mailingAddress: {
              streetAddress: 'rec mailing_address - address line two',
              addressCity: 'mailing_address city',
              addressCountry: 'mailing_address country',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            }
          }
        }
      }))

    // GET business share classes
    get.withArgs('businesses/BC1234567/share-classes')
      .returns(Promise.resolve({
        data: {
          shareClasses: [
            {
              currency: 'CAD',
              hasMaximumShares: true,
              hasParValue: true,
              hasRightsOrRestrictions: true,
              id: '605',
              maxNumberOfShares: 300,
              name: 'Class A Shares',
              parValue: 1,
              priority: 1,
              series: [
                {
                  hasMaximumShares: true,
                  hasRightsOrRestrictions: false,
                  id: '100',
                  maxNumberOfShares: 150,
                  name: 'Series A Shares',
                  priority: 1
                },
                {
                  hasMaximumShares: true,
                  hasRightsOrRestrictions: false,
                  id: 101,
                  maxNumberOfShares: 10,
                  name: 'Series 2 Shares',
                  priority: 2
                }
              ]
            }
          ]
        }
      }))

    // GET auth info
    get.withArgs('https://auth.api.url/entities/BC1234567')
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

    // GET resolutions
    get.withArgs('businesses/BC1234567/resolutions')
      .returns(Promise.resolve({
        data: {
          resolutions: [
            {
              date: '2021-05-05'
            },
            {
              date: '2021-07-05'
            }
          ]
        }
      }))

    // FUTURE: mock GET conversion filing

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'conversion' })

    wrapper = shallowMount(Conversion, { localVue, router, vuetify })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders Conversion view and sub-components', () => {
    expect(wrapper.findComponent(Conversion).exists()).toBe(true)
    expect(wrapper.findComponent(ViewWrapper).exists()).toBe(true)
    expect(wrapper.findComponent(YourCompanyWrapper).exists()).toBe(true)
    expect(wrapper.findComponent(EntityName).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessType).exists()).toBe(true)
    expect(wrapper.findComponent(BusinessStartDate).exists()).toBe(true)
    expect(wrapper.findComponent(ConversionNOB).exists()).toBe(true)
    expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
    expect(wrapper.findComponent(FolioInformation).exists()).toBe(true)
  })

  // FUTURE
  xit('loads the entity snapshot into the store', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    const state = store.stateModel

    // Validate business identifier
    expect(state.tombstone.businessId).toBe('BC1234567')

    // Validate Business
    expect(state.businessInformation.legalType).toBe('BEN')
    expect(state.businessInformation.legalName).toBe('Mock Business Ltd.')
    expect(state.businessInformation.identifier).toBe('BC1234567')

    // Validate Name Translations
    expect(state.nameTranslations[0].name).toBe('Mock Business French Ltd.')

    // Validate Office Addresses
    expect(state.officeAddresses.registeredOffice.deliveryAddress.streetAddress)
      .toBe('reg delivery_address - address line one')
    expect(state.officeAddresses.recordsOffice.mailingAddress.streetAddress)
      .toBe('rec mailing_address - address line two')

    // Validate People And Roles
    expect(store.stateModel.peopleAndRoles.orgPeople[0].officer.firstName).toBe('CAMERON')
    expect(store.stateModel.peopleAndRoles.orgPeople[0].officer.lastName).toBe('BOWLER')
    expect(store.stateModel.peopleAndRoles.orgPeople[0].roles[0].roleType).toBe('Director')

    // Validate Share Structure
    expect(store.stateModel.shareStructureStep.shareClasses[0].name).toBe('Class A Shares')
    expect(store.stateModel.shareStructureStep.shareClasses[0].series[0].name)
      .toBe('Series A Shares')
    expect(store.stateModel.shareStructureStep.shareClasses[0].series[1].name)
      .toBe('Series 2 Shares')

    // Validate Contact Info
    expect(store.stateModel.businessContact.email).toBe('mock@example.com')
    expect(store.stateModel.businessContact.phone).toBe('123-456-7890')

    expect(store.stateModel.currentFees[0].filingFees).toBe(100)
    expect(store.stateModel.currentFees[0].futureEffectiveFees).toBe(0)
  })

  // FUTURE
  xit('fetches the fee prices after loading', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    expect(store.stateModel.feePrices[0].filingFees).toBe(100)
    expect(store.stateModel.feePrices[0].futureEffectiveFees).toBe(100)
  })

  // FUTURE
  xit('display the fee prices properly', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    store.stateModel.summaryMode = true
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.nameTranslations = [{ action: ActionTypes.ADDED, name: 'test' }]
    await Vue.nextTick()

    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Certain changes require an Alteration Notice which will incur a $100.00 fee.')
    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Choosing an alteration date and time in the future will incur an additional $100.00 fee.')

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

    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Certain changes require an Alteration Notice which will incur a fee.')
    expect(
      wrapper.find('#intro-text').text().replace(/\s+/g, ' ')
    ).toContain('Choosing an alteration date and time in the future will incur an additional fee.')
  })

  // FUTURE
  xit('updates the current fees when AlterationSummary changes', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    const state = store.stateModel
    state.effectiveDateTime.isFutureEffective = true

    await wrapper.vm.onAlterationSummaryChanges()
    expect(store.stateModel.currentFees[0].filingFees).toBe(100)
    expect(store.stateModel.currentFees[0].futureEffectiveFees).toBe(100)
  })

  // FUTURE
  xit('loads a draft alteration into the store', async () => {
    // Validate Effective Date-Time
    expect(store.stateModel.effectiveDateTime.isFutureEffective).toBe(true)
    expect(store.stateModel.effectiveDateTime.dateTimeString).toBe('2021-03-22T18:00:00.000Z')
    expect(store.stateModel.validationFlags.flagsReviewCertify.isValidEffectiveDate).toBe(true)
  })
})
