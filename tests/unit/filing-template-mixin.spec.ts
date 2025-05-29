import { shallowMount } from '@vue/test-utils'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import * as utils from '@/utils'

setActivePinia(createPinia())
const store = useStore()

describe('Filing Template Mixin', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(MixinTester)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('correctly builds a Special Resolution filing', () => {
    store.stateModel.tombstone.businessId = 'CP1234567'
    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    store.stateModel.specialResolution.resolution = '<p>xxxx</p>'
    store.stateModel.specialResolution.resolutionConfirmed = true
    store.stateModel.rules = store.stateModel.rules || {}
    store.stateModel.memorandum = store.stateModel.memorandum || {}
    store.stateModel.rules.includedInResolution = true
    store.stateModel.memorandum.includedInResolution = true
    store.stateModel.specialResolution.signatory = {
      familyName: 'SGSG',
      givenName: 'GSG'
    }
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
    store.stateModel.entitySnapshot = {
      businessInfo: {
        foundingDate: 'Jan 01, 2000',
        legalType: CorpTypeCd.COOP,
        identifier: 'CP1234567',
        legalName: 'SomeMockBusiness'
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

    const filing = wrapper.vm.buildSpecialResolutionFiling(true)

    // FUTURE: check filing data...
    expect(filing).toEqual(
      expect.objectContaining({
        business: {
          foundingDate: 'Jan 01, 2000',
          identifier: 'CP1234567',
          legalName: 'SomeMockBusiness',
          legalType: 'CP',
          nrNumber: undefined
        },
        specialResolution: {
          resolution: '<p>xxxx</p>',
          resolutionConfirmed: true,
          signatory: {
            familyName: 'SGSG',
            givenName: 'GSG'
          }
        },
        alteration: {
          business: {
            identifier: 'CP1234567',
            legalType: 'CP'
          },
          contactPoint: {
            email: '',
            extension: undefined,
            phone: ''
          },
          cooperativeAssociationType: null,
          memorandumInResolution: true,
          rulesInResolution: true
        },
        changeOfName: {
          legalName: null,
          nameRequest: {
            applicants: {},
            consentFlag: null,
            expirationDate: null,
            furnished: null,
            legalName: undefined,
            legalType: null,
            names: [],
            nrNum: '',
            nrNumber: '',
            priorityCd: null,
            requestTypeCd: null,
            request_action_cd: null,
            state: null
          }
        },
        header: {
          certifiedBy: '',
          date: '',
          folioNumber: '',
          name: 'specialResolution'
        }
      })
    )
  })
})

// FUTURE
describe.skip('Alteration Filing', () => {
})

describe('Change of Registration Filing', () => {
  let wrapper: any

  beforeEach(() => {
    vi.spyOn(utils, 'GetFeatureFlag').mockImplementation(flag => {
      if (flag === 'enable-legal-name-fix') return true
      return null
    })
    wrapper = shallowMount(MixinTester)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('correctly builds a change of registration filing', () => {
    store.stateModel.tombstone.businessId = 'FM1234567'
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
    store.stateModel.nameRequestLegalName = 'My Alternate Name'
    store.stateModel.entitySnapshot = {
      businessInfo: {
        foundingDate: 'Jan 01, 2000',
        legalType: CorpTypeCd.SOLE_PROP,
        identifier: 'FM1234567',
        legalName: 'SomeMockBusiness',
        naicsCode: '',
        naicsDescription: '',
        alternateNames: [
          {
            identifier: 'FM1234567',
            name: 'My Alternate Name'
          }
        ]
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
          identifier: 'FM1234567',
          legalName: 'SomeMockBusiness',
          legalType: 'SP'
        },
        changeOfRegistration: {
          business: {
            identifier: 'FM1234567',
            naics: {
              naicsCode: '123456',
              naicsDescription: 'Mock Description'
            }
          },
          contactPoint: {
            email: '',
            extension: undefined,
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

  // FUTURE
  it.skip('correctly builds an Alteration filing', () => {
  })

  // FUTURE
  it.skip('correctly builds a Conversion filing', () => {
  })
})
