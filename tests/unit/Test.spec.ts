import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
import mockRouter from './MockRouter'
import { mount, createLocalVue, createWrapper } from '@vue/test-utils'
import CompletingParty from '@/components/Correction/CompletingParty.vue'

Vue.use(Vuetify)

const router = mockRouter.mock()
const vuetify = new Vuetify({})
const localVue = createLocalVue()
localVue.use(Vuex)

describe('Completing Party', () => {
  let store
  let mockGetters
  let mockActions
  
  const completingCp = {
    firstName: 'Molly',
    lastName: 'Mop',
    mailingAddress: {
      addressCity: 'Victoria',
      addressCountry: 'Canada',
      addressRegion: 'BC',
      postalCode: 'H0H0H0',
      streetAddress: '12 Awesome view rd',
    }
  }

  const originalPersonCp = {
    officer: {
      id: '1',
      partyType: 'person',
      firstName: 'Original',
      lastName: 'Person',
      organizationName: ''
    },
    roles: [
      { roleType: 'Completing Party' },
      { roleType: 'Incorporator' },
      { roleType: 'Director' }
    ],
    mailingAddress: {},
    isLookupBusiness: undefined
  }

  /** Original person without CP role. */
  const originalPersonNotCp = {
    officer: {
      id: '1',
      partyType: 'person',
      firstName: 'Original',
      lastName: 'Person',
      organizationName: ''
    },
    roles: [
      { roleType: 'Incorporator' },
      { roleType: 'Director' }
    ],
    mailingAddress: {},
    action: 'edited'
  }


  const newPersonCp = {
    officer: {
      id: '3',
      partyType: 'person',
      firstName: 'New',
      lastName: 'Person',
      organizationName: ''
    },
    roles: [
      { roleType: 'Completing Party' }
    ],
    mailingAddress: {},
    action: 'added'
  }

  const buisnessCp = {
    identifier: 'Cool buisness',
    legalType: 'SP'
  }

  const authCp = {
    contact: { email: 'test@test.ca', phone: '123' },
    folioNumber: '11111'
  }

  /** Original organization. */
  const originalOrg = {
    officer: {
      id: '2',
      partyType: 'organization',
      firstName: '',
      lastName: '',
      organizationName: 'Original Org Ltd'
    },
    roles: [
      { roleType: 'Incorporator' }
    ],
    mailingAddress: {}
  }

  beforeEach( () => {
    let mockActions = {
      setCompletingParty: jest.fn( (party) => party ),
      setCompletingPartyValidity: jest.fn( (valid) => valid ),
      onValid: jest.fn( (valid) => valid ),
      onUpdate: jest.fn( (cp) => cp )
    }

    let mockGetters = {
      getCompletingParty: () => { completingCp },

      getIsRoleStaff: () => true, // () => (arg: boolean) => arg

      getPeopleAndRoles : () => { 
        originalPersonCp 
        originalOrg
      },

      getEntitySnapshot: () => {  
        businessInfo: buisnessCp
        authInfo: authCp
        orgPersons: originalPersonCp
        addresses: {}
      },

      getCorrectedFiling: () => {
        incorporationApplication: {
          parties: [
            originalPersonCp,
            originalOrg
          ]
        }
      }
    }
  })

  it('Completing Party renders correctly from getters', () => {
    store = getVuexStore()

    const wrapper = mount(CompletingParty, { store, vuetify, localVue, router })

    expect(wrapper.find('h2').text()).toBe('Original Completing Party')
    expect(wrapper.findAll('.flex').at(0).find('label').text()).toBe('Legal Name')
    expect(wrapper.findAll('.flex').at(0).find('.v-chip').exists()).toBe(false)
    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('Unknown')

    wrapper.destroy()
  })

  it('displays new person and Corrected badge if CP has changed', () => {
    store = getVuexStore()
    store.state.stateModel.peopleAndRoles = {
      orgPeople: [
        originalPersonCp,
        originalOrg
      ]
    }
    const wrapper = mount(CompletingParty, { store, vuetify, localVue, router })

    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('Original  Person')

    // cleanup
    wrapper.destroy()
  })

  it('displays new person and Corrected badge if CP has changed', () => {
    store = getVuexStore()

    store.state.stateModel.peopleAndRoles = {
      orgPeople: [
        originalPersonNotCp,
        originalOrg,
        newPersonCp
      ]
    }

    const wrapper = mount(CompletingParty, { store, vuetify, localVue, router })

    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('New  Person')
    
    // cleanup
    wrapper.destroy()
  })

  it.only('emits correct valid flags', async () => {
    store = getVuexStore()
    store.hotUpdate({
      getters: mockGetters,
      setters: mockActions
    })

    const wrapper = mount(CompletingParty, { store, vuetify, localVue, router })
    const mock = jest.spyOn(wrapper.vm., 'setCompletingPartyValidity')

    expect(mockActions.setCompletingPartyValidity()).toBeCalledWith(true)
  })
})