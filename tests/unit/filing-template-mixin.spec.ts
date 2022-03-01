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
    store.state.stateModel.entitySnapshot = {
      businessInfo: {
        foundingDate: 'Jan 01, 2000',
        legalType: '',
        identifier: 'BC1234567',
        legalName: 'SomeMockBusiness'
      }
    }
    const filing = wrapper.vm.buildChangeFiling(true)

    // FUTURE: check filing data...
    // FUTURE: compare to "changeOfRegistration.json" (see below)
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
              'naicsCode': '',
              'naicsDescription': ''
            },
            'natureOfBusiness': ''
          },
          'contactPoint': {
            'email': '',
            'extension': '',
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
