import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import { CompletingParty } from '@/components/common'
// import { IncorporationFilingIF, OrgPersonIF } from '@/interfaces'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

/** Original person with CP role. */
const original_person_cp = {
  officer: {
    id: 1,
    partyType: 'Person',
    firstName: 'Original',
    lastName: 'Person',
    orgName: ''
  },
  roles: [
    { roleType: 'Completing Party' },
    { roleType: 'Incorporator' },
    { roleType: 'Director' }
  ],
  mailingAddress: {}
}
 
/** Original person without CP role. */
const original_person_not_cp = {
  officer: {
    id: 1,
    partyType: 'Person',
    firstName: 'Original',
    lastName: 'Person',
    orgName: ''
  },
  roles: [
    { roleType: 'Incorporator' },
    { roleType: 'Director' }
  ],
  mailingAddress: {},
  action: 'edited'
}

/** Original organization. */
const original_org = {
  officer: {
    id: 2,
    partyType: 'Org',
    firstName: '',
    lastName: '',
    orgName: 'Original Org Ltd'
  },
  roles: [
    { roleType: 'Incorporator' }
  ],
  mailingAddress: {}
}

/** New person with CP role. */
const new_person_cp = {
  officer: {
    id: 3,
    partyType: 'Person',
    firstName: 'New',
    lastName: 'Person',
    orgName: ''
  },
  roles: [
    { roleType: 'Completing Party' },
  ],
  mailingAddress: {},
  action: 'added'
}
  
describe('unit tests', () => {
  it('displays titles and null data correctly', () => {
    const wrapper = mount(CompletingParty, { store, vuetify })

    expect(wrapper.find('h2').text()).toBe('Original Completing Party')
    expect(wrapper.findAll('.flex').at(0).find('label').text()).toBe('Legal Name')
    expect(wrapper.findAll('.flex').at(0).find('.v-chip').exists()).toBe(false)
    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('Unknown')

    wrapper.destroy()
  })

  it('displays original person and no badge if CP is unchanged', () => {
    store.state.stateModel.originalIA = {
      incorporationApplication: {
        parties: [
          original_person_cp,
          original_org
        ]
      }
    }
    store.state.stateModel.peopleAndRoles = {
      orgPeople: [
        original_person_cp,
        original_org
      ]
    }

    const wrapper = mount(CompletingParty, { store, vuetify })

    expect(wrapper.findAll('.flex').at(0).find('.v-chip').exists()).toBe(false)
    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('Original  Person')

    wrapper.destroy()
  })

  it('displays new person and Corrected badge if CP has changed', () => {
    store.state.stateModel.originalIA = {
      incorporationApplication: {
        parties: [
          original_person_cp,
          original_org
        ]
      }
    }
    store.state.stateModel.peopleAndRoles = {
      orgPeople: [
        original_person_not_cp,
        original_org,
        new_person_cp
      ]
    }

    const wrapper = mount(CompletingParty, { store, vuetify })

    expect(wrapper.findAll('.flex').at(0).find('.v-chip').exists()).toBe(true)
    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('New  Person')

    wrapper.destroy()
  })
})
