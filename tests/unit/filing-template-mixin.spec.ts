import { shallowMount } from '@vue/test-utils'
import MixinTester from './mixin-tester.vue'
import { getVuexStore } from '@/store'

const store = getVuexStore()

describe('Change of Registration Filing', () => {
  let wrapper: any
  let store: any = getVuexStore()

  beforeEach(() => {
    wrapper = shallowMount(MixinTester, { store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('correctly builds a registration filing', () => {
    store.state.stateModel.tombstone.businessId = 'BC1234567'
    store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
    store.state.stateModel.entitySnapshot = {
      businessInfo: {
        foundingDate: 'Jan 01, 2000',
        legalType: '',
        identifier: 'BC1234567',
        legalName: 'SomeMockBusiness',
        naicsCode: '',
        naicsDescription: ''
      },
      addresses: {
        registeredOffice: {
          mailingAddress: {
            addressCity: 'Charlie',
            addressCountry: 'CA',
            addressRegion: 'BC',
            deliveryInstructions: 'Mailing address',
            postalCode: 'V2V 2V2',
            streetAddress: '222 Second St',
            streetAddressAdditional: 'Suite 2'
          },
          deliveryAddress: {
            addressCity: 'Alpha',
            addressCountry: 'CA',
            addressRegion: 'BC',
            deliveryInstructions: 'Delivery address',
            postalCode: 'V1V 1V1',
            streetAddress: '111 First St',
            streetAddressAdditional: 'Suite 1'
          }
        }
      }
    }
    store.state.stateModel.officeAddresses = {
      registeredOffice: {
        mailingAddress: {
          addressCity: 'Bravo',
          addressCountry: 'CA',
          addressRegion: 'BC',
          deliveryInstructions: 'Mailing address',
          postalCode: 'V2V 2V2',
          streetAddress: '222 Second St',
          streetAddressAdditional: 'Suite 2'
        },
        deliveryAddress: {
          addressCity: 'Alpha',
          addressCountry: 'CA',
          addressRegion: 'BC',
          deliveryInstructions: 'Delivery address',
          postalCode: 'V1V 1V1',
          streetAddress: '111 First St',
          streetAddressAdditional: 'Suite 1'
        }
      }
    }
    store.state.stateModel.businessInformation.naicsCode = '123456'
    store.state.stateModel.businessInformation.naicsDescription = 'Mock Description'

    const filing = wrapper.vm.buildChangeFiling(true)

    // FUTURE: check filing data...
    expect(filing).toEqual(
      expect.objectContaining({
        'business': {
          'foundingDate': 'Jan 01, 2000',
          'identifier': 'BC1234567',
          'legalName': 'SomeMockBusiness',
          'legalType': ''
        },
        'changeOfRegistration': {
          'business': {
            'identifier': 'BC1234567',
            'naics': {
              'naicsCode': '123456',
              'naicsDescription': 'Mock Description'
            },
            'natureOfBusiness': ''
          },
          'businessAddress': {
            'mailingAddress': {
              'addressCity': 'Bravo',
              'addressCountry': 'CA',
              'addressRegion': 'BC',
              'deliveryInstructions': 'Mailing address',
              'postalCode': 'V2V 2V2',
              'streetAddress': '222 Second St',
              'streetAddressAdditional': 'Suite 2'
            },
            'deliveryAddress': {
              'addressCity': 'Alpha',
              'addressCountry': 'CA',
              'addressRegion': 'BC',
              'deliveryInstructions': 'Delivery address',
              'postalCode': 'V1V 1V1',
              'streetAddress': '111 First St',
              'streetAddressAdditional': 'Suite 1'
            }
          },
          'contactPoint': {
            'email': '',
            'phone': ''
          }
        },
        'header': {
          'certifiedBy': '',
          'date': '',
          'folioNumber': '',
          'name': 'changeOfRegistration'
        }
      })
    )
  })
})
