import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'

import { getVuexStore } from '@/store'
import { CompletingParty } from '@/components/common'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()

/** Original person with CP role. */
const originalPersonCp = {
  officer: {
    id: '1',
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
const originalPersonNotCp = {
  officer: {
    id: '1',
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
const originalOrg = {
  officer: {
    id: '2',
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
const newPersonCp = {
  officer: {
    id: '3',
    partyType: 'Person',
    firstName: 'New',
    lastName: 'Person',
    orgName: ''
  },
  roles: [
    { roleType: 'Completing Party' }
  ],
  mailingAddress: {},
  action: 'added'
}

describe('unit tests', () => {
  beforeAll(async () => {
    await router.push({ name: 'correction' })
    await Vue.nextTick()
  })

  it('displays titles and null data correctly', () => {
    const wrapper = mount(CompletingParty, { store, vuetify, localVue, router })

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
          originalPersonCp,
          originalOrg
        ]
      }
    }
    store.state.stateModel.peopleAndRolesStep = {
      orgPeople: [
        originalPersonCp,
        originalOrg
      ]
    }

    const wrapper = mount(CompletingParty, { store, vuetify, localVue, router })

    expect(wrapper.findAll('.flex').at(0).find('.v-chip').exists()).toBe(false)
    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('Original  Person')

    wrapper.destroy()
  })

  it('displays new person and Corrected badge if CP has changed', () => {
    store.state.stateModel.originalIA = {
      incorporationApplication: {
        parties: [
          originalPersonCp,
          originalOrg
        ]
      }
    }
    store.state.stateModel.peopleAndRolesStep = {
      orgPeople: [
        originalPersonNotCp,
        originalOrg,
        newPersonCp
      ]
    }

    const wrapper = mount(CompletingParty, { store, vuetify, localVue, router })

    expect(wrapper.findAll('.flex').at(0).find('.v-chip').exists()).toBe(true)
    expect(wrapper.findAll('.flex').at(1).find('span').text()).toBe('New  Person')

    wrapper.destroy()
  })
})
