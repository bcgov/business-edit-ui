// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'

// Store
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import { PeopleAndRoles } from '@/components/PeopleAndRoles'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const btnAddPerson = '#btn-add-person'
const btnAddCompletingParty = '#btn-add-cp'
const btnAddCorp = '#btn-add-corp'
const orgPersonForm = '#org-person-form'
const closeCompletingParty = '.cp-invalid'
const closeDirector = '.dir-invalid'
const closeIncorporator = '.incorp-invalid'
const checkCompletingParty = '.cp-valid'
const checkDirector = '.dir-valid'
const checkIncorporator = '.incorp-valid'
const completingPartyRole = { roleType: 'Completing Party', appointmentDate: '2020-03-30' }

function resetStore (): void {
  store.state.stateModel.peopleAndRoles.orgPeople = []
}

function getPersonList (roles = [completingPartyRole]): Array<any> {
  return [
    {
      officer: {
        id: 0,
        firstName: 'Adam',
        lastName: 'Smith',
        middleName: 'D',
        orgName: '',
        partyType: 'Person'
      },
      roles,
      mailingAddress: {
        streetAddress: '123 Fake Street',
        streetAddressAdditional: '',
        addressCity: 'Victoria',
        addressRegion: 'BC',
        postalCode: 'V8Z 5C6',
        addressCountry: 'CA'
      },
      deliveryAddress: {
        streetAddress: '123 Fake Street',
        streetAddressAdditional: '',
        addressCity: 'Victoria',
        addressRegion: 'BC',
        postalCode: 'V8Z 5C6',
        addressCountry: 'CA'
      }
    }
  ]
}

describe('People And Roles component', () => {
  let wrapperFactory: any

  beforeAll(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    wrapperFactory = () => {
      return mount(PeopleAndRoles, {
        localVue,
        router,
        store,
        vuetify
      })
    }
  })

  it('shows all 3 add buttons when people list is empty', () => {
    resetStore()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBe(true)
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(true)
    expect(wrapper.find(btnAddCorp).exists()).toBe(true)
    wrapper.destroy()
  })

  it('shows Add Person and Add Corporation buttons when people list has a Completing Party', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCorp).exists()).toBe(true)
    expect(wrapper.find(btnAddPerson).exists()).toBe(true)
    wrapper.destroy()
    resetStore()
  })

  it('shows Add Completing Party button when people list has no Completing Party', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      { 'roleType': 'Director', 'appointmentDate': '2020-03-30' }
    ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(true)
    wrapper.destroy()
    resetStore()
  })

  it('does not show Add Completing Party Button when people list has Completing Party', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(false)
    wrapper.destroy()
    resetStore()
  })

  it('sets the data attributes as expected when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    wrapper.find(btnAddPerson).trigger('click')
    await Vue.nextTick()
    expect(wrapper.vm.$data.renderOrgPersonForm).toBe(true)
    expect(wrapper.vm.$data.nextId).toBe(1)
    wrapper.destroy()
    resetStore()
  })

  it('sets the data attributes as expected when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    wrapper.find(btnAddCorp).trigger('click')
    await Vue.nextTick()
    expect(wrapper.vm.$data.renderOrgPersonForm).toBe(true)
    expect(wrapper.vm.$data.nextId).toBe(1)
    wrapper.destroy()
    resetStore()
  })

  it('shows the add person form when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    wrapper.find(btnAddPerson).trigger('click')
    await Vue.nextTick()
    // verify buttons are now disabled
    expect(wrapper.find(btnAddPerson).attributes('disabled')).toBe('disabled')
    expect(wrapper.find(btnAddCorp).attributes('disabled')).toBe('disabled')
    // check form
    expect(wrapper.find(orgPersonForm).exists()).toBe(true)
    expect(wrapper.find('.add-org-header').text()).toBe('Add Person')
    wrapper.destroy()
    resetStore()
  })

  it('shows the add corporation form when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    wrapper.find(btnAddCorp).trigger('click')
    await Vue.nextTick()
    // verify buttons are now disabled
    expect(wrapper.find(btnAddPerson).attributes('disabled')).toBe('disabled')
    expect(wrapper.find(btnAddCorp).attributes('disabled')).toBe('disabled')
    // check form
    expect(wrapper.find(orgPersonForm).exists()).toBe(true)
    expect(wrapper.find('.add-org-header').text()).toBe('Add Corporation or Firm')
    wrapper.destroy()
    resetStore()
  })

  it('shows check icons next to all 3 roles when people list is complete', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      { 'roleType': 'Director', 'appointmentDate': '2020-03-30' },
      { 'roleType': 'Incorporator', 'appointmentDate': '2020-03-30' },
      { 'roleType': 'Completing Party', 'appointmentDate': '2020-03-30' }
    ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(checkIncorporator).exists()).toBe(true)
    expect(wrapper.find(checkDirector).exists()).toBe(true)
    expect(wrapper.find(checkCompletingParty).exists()).toBe(true)
    wrapper.destroy()
    resetStore()
  })

  it('shows close icons next to all 3 roles when people list is empty', () => {
    resetStore()
    const wrapper = wrapperFactory()
    expect(wrapper.find(closeCompletingParty).exists()).toBe(true)
    expect(wrapper.find(closeIncorporator).exists()).toBe(true)
    expect(wrapper.find(closeDirector).exists()).toBe(true)
    wrapper.destroy()
  })
})
