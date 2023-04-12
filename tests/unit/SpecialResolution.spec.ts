import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils/'
import SpecialResolution from '@/views/SpecialResolution.vue'
import mockRouter from './MockRouter'
import ViewWrapper from '@/components/ViewWrapper.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Special Resolution component', () => {
  let wrapper: any
  const { assign } = window.location

  // Define Session
  sessionStorage.setItem('PAY_API_URL', 'https://pay.api.url/')
  sessionStorage.setItem('AUTH_API_URL', 'https://auth.api.url/')
  sessionStorage.setItem('AUTH_WEB_URL', 'https://auth.web.url/')
  sessionStorage.setItem('DASHBOARD_URL', 'https://dashboard.url/')
  sessionStorage.setItem('KEYCLOAK_TOKEN', 'sampletoken')
  store.stateModel.tombstone.businessId = 'CP1234567'

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET payment fees for immediate alteration
    get.withArgs('https://pay.api.url/fees/CP/SPRLN')
      .returns(Promise.resolve({
        data: { 'filingFees': 70.0,
          'filingType': 'Special resolution',
          'filingTypeCode': 'SPRLN',
          'futureEffectiveFees': 0,
          'priorityFees': 0,
          'processingFees': 0,
          'serviceFees': 0,
          'tax': {
            'gst': 0,
            'pst': 0
          },
          'total': 70.0
        }
      }))

    // GET payment fees for future effective alteration
    get.withArgs('https://pay.api.url/fees/CP/SPRLN?futureEffective=true')
      .returns(Promise.resolve({
        data: { 'filingFees': 70.0,
          'filingType': 'Special resolution',
          'filingTypeCode': 'SPRLN',
          'futureEffectiveFees': 100.0,
          'priorityFees': 0,
          'processingFees': 0,
          'serviceFees': 0,
          'tax': {
            'gst': 0,
            'pst': 0
          },
          'total': 170.0
        }
      }))

    // GET business
    get.withArgs('businesses/CP1234567')
      .returns(Promise.resolve({
        data: {
          business: {
            legalName: 'Mock Business Ltd.',
            legalType: 'CP',
            identifier: 'CP1234567'
          }
        }
      }))

    // GET business addresses
    get.withArgs('businesses/CP1234567/addresses')
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

    // GET business directors
    get.withArgs('businesses/CP1234567/directors')
      .returns(Promise.resolve({
        data: {
          directors: [
            {
              appointmentDate: '2020-09-30',
              cessationDate: null,
              deliveryAddress: {
                addressCity: 'Victoria',
                addressCountry: 'CA',
                addressRegion: 'BC',
                deliveryInstructions: '',
                postalCode: 'V8P 1S8',
                streetAddress: '1284 Derby Rd',
                streetAddressAdditional: ''
              },
              mailingAddress: {
                addressCity: 'Victoria',
                addressCountry: 'CA',
                addressRegion: 'BC',
                deliveryInstructions: '',
                postalCode: 'V8P 1S8',
                streetAddress: '1284 Derby Rd',
                streetAddressAdditional: ''
              },
              officer: {
                firstName: 'USER',
                lastName: 'ONE'
              },
              role: 'director'
            }
          ]
        }
      }))

    // GET auth info
    get.withArgs('https://auth.api.url/entities/CP1234567')
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

    // FUTURE: mock GET alteration filing

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    await router.push({ name: 'alteration' })
    wrapper = shallowMount(SpecialResolution, { localVue, router, vuetify })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders Special Resolution view', () => {
    expect(wrapper.findComponent(SpecialResolution).exists()).toBe(true)
    expect(wrapper.findComponent(ViewWrapper).exists()).toBe(true)
  })

  it.only('loads the entity snapshot into the store', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()
    const state = store.stateModel

    // Validate business identifier
    expect(state.tombstone.businessId).toBe('CP1234567')

    // Validate Business
    expect(state.businessInformation.legalType).toBe('CP')
    expect(state.businessInformation.legalName).toBe('Mock Business Ltd.')
    expect(state.businessInformation.identifier).toBe('CP1234567')

    // Validate Name Translations
    // expect(state.nameTranslations[0].name).toBe('Mock Business French Ltd.')

    // Validate Office Addresses
    expect(state.officeAddresses.registeredOffice.deliveryAddress.streetAddress)
      .toBe('reg delivery_address - address line one')
    expect(state.officeAddresses.recordsOffice.mailingAddress.streetAddress)
      .toBe('rec mailing_address - address line two')

    // Validate People And Roles
    expect(store.stateModel.peopleAndRoles.orgPeople[0].officer.firstName).toBe('USER')
    expect(store.stateModel.peopleAndRoles.orgPeople[0].officer.lastName).toBe('ONE')
    expect(store.stateModel.peopleAndRoles.orgPeople[0].roles[0].roleType).toBe('Director')

    // Validate Contact Info
    expect(store.stateModel.businessContact.email).toBe('mock@example.com')
    expect(store.stateModel.businessContact.phone).toBe('123-456-7890')

    expect(store.stateModel.currentFees[0].filingFees).toBe(70)
  })

  it('updates the current fees when SpecialResolutionSummary changes', async () => {
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    expect(store.stateModel.currentFees[0].filingFees).toBe(70)
  })

  it('certify text is not prefilled/editable for staff user', async () => {
    store.stateModel.tombstone.keycloakRoles = ['staff']
    store.stateModel.tombstone.userInfo = {
      firstname: 'Jon',
      lastname: 'Doe'
    }
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    expect(store.stateModel.certifyState.certifiedBy).toBe('undefined undefined')
  })

  it('certify text is prefilled/uneditable for non-staff user', async () => {
    store.stateModel.tombstone.keycloakRoles = []
    store.stateModel.tombstone.userInfo = {
      firstname: 'Jon',
      lastname: 'Doe'
    }
    await wrapper.setProps({ appReady: true })
    await flushPromises()

    expect(store.stateModel.certifyState.certifiedBy).toBe('Jon Doe')
  })
})
