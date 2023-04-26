import { shallowMount } from '@vue/test-utils'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, FilingTypes } from '@/enums'

setActivePinia(createPinia())
const store = useStore()

// FUTURE
describe('Correction Filing', () => {
})

// FUTURE
describe('Alteration Filing', () => {
})

describe('Change of Registration Filing', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(MixinTester)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('correctly builds a change of registration filing', () => {
    store.stateModel.tombstone.businessId = 'BC1234567'
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.completingParty = {
      firstName: 'First',
      lastName: 'Last',
      middleName: 'Middle',
      mailingAddress: {
        streetAddress: '123 Completing Ave',
        addressCity: 'Party',
        addressRegion: 'BC',
        postalCode: 'V0V 0V0',
        addressCountry: 'CA'
      }
    }
    store.stateModel.nameRequest.legalName = 'SomeMockBusiness'
    store.stateModel.entitySnapshot = {
      businessInfo: {
        foundingDate: 'Jan 01, 2000',
        legalType: CorpTypeCd.SOLE_PROP,
        identifier: 'BC1234567',
        legalName: 'SomeMockBusiness',
        naicsCode: '',
        naicsDescription: ''
      },
      addresses: {
        businessOffice: {
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
    } as any
    store.stateModel.officeAddresses = {
      businessOffice: {
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
    store.stateModel.businessInformation.naicsCode = '123456'
    store.stateModel.businessInformation.naicsDescription = 'Mock Description'

    const filing = wrapper.vm.buildChangeRegFiling(true)

    // FUTURE: check filing data...
    expect(filing).toEqual(
      expect.objectContaining({
        business: {
          foundingDate: 'Jan 01, 2000',
          identifier: 'BC1234567',
          legalName: 'SomeMockBusiness',
          legalType: 'SP'
        },
        changeOfRegistration: {
          business: {
            identifier: 'BC1234567',
            naics: {
              naicsCode: '123456',
              naicsDescription: 'Mock Description'
            }
          },
          contactPoint: {
            email: '',
            phone: ''
          },
          offices: {
            businessOffice: {
              deliveryAddress: {
                addressCity: 'Alpha',
                addressCountry: 'CA',
                addressRegion: 'BC',
                deliveryInstructions: 'Delivery address',
                postalCode: 'V1V 1V1',
                streetAddress: '111 First St',
                streetAddressAdditional: 'Suite 1'
              },
              mailingAddress: {
                addressCity: 'Bravo',
                addressCountry: 'CA',
                addressRegion: 'BC',
                deliveryInstructions: 'Mailing address',
                postalCode: 'V2V 2V2',
                streetAddress: '222 Second St',
                streetAddressAdditional: 'Suite 2'
              }
            }
          },
          parties: [
            {
              mailingAddress: {
                addressCity: 'Party',
                addressCountry: 'CA',
                addressRegion: 'BC',
                postalCode: 'V0V 0V0',
                streetAddress: '123 Completing Ave'
              },
              officer: {
                firstName: 'First',
                lastName: 'Last',
                middleName: 'Middle',
                partyType: 'person'
              },
              roles: [
                {
                  appointmentDate: '', // no date in this test
                  roleType: 'Completing Party'
                }
              ]
            }
          ]
        },
        header: {
          certifiedBy: '',
          date: '',
          folioNumber: '',
          name: 'changeOfRegistration'
        }
      })
    )
  })
})

// FUTURE
describe('Conversion Filing', () => {
})
