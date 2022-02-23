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
import { PeopleAndRoles } from '@/components/common/PeopleAndRoles'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const orgPersonForm = '#org-person-form'
const btnAddPerson = '#btn-add-person'
const btnAddCorp = '#btn-add-corp'
const btnAddCompletingParty = '#btn-add-cp'
const closeCompletingParty = '.cp-invalid'
const closeIncorporator = '.incorp-invalid'
const closeDirector = '.dir-invalid'
const checkCompletingParty = '.cp-valid'
const checkIncorporator = '.incorp-valid'
const checkDirector = '.dir-valid'

const completingPartyRole = { roleType: 'Completing Party', appointmentDate: '2020-03-30' }
const incorporatorRole = { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
const directorRole = { roleType: 'Director', appointmentDate: '2020-03-30' }

function getPersonList (roles: Array<any> = []): Array<any> {
  return [
    {
      officer: {
        id: '0',
        firstName: 'Adam',
        lastName: 'Smith',
        middleName: 'D',
        organizationName: '',
        partyType: 'person'
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
    store.state.stateModel.peopleAndRolesStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBe(true)
    expect(wrapper.find(btnAddCorp).exists()).toBe(true)
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(true)
    wrapper.destroy()
  })

  it('shows only Add Person and Add Corporation buttons when people list has a Completing Party', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([completingPartyRole])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBe(true)
    expect(wrapper.find(btnAddCorp).exists()).toBe(true)
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(false)
    wrapper.destroy()
  })

  it('shows Add Completing Party button when people list has no Completing Party', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([incorporatorRole, directorRole])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(true)
    wrapper.destroy()
  })

  it('sets the data attributes as expected when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = []
    const wrapper = wrapperFactory()
    wrapper.find(btnAddPerson).trigger('click')
    await Vue.nextTick()
    expect(wrapper.vm.$data.renderOrgPersonForm).toBe(true)
    wrapper.destroy()
  })

  it('sets the data attributes as expected when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = []
    const wrapper = wrapperFactory()
    wrapper.find(btnAddCorp).trigger('click')
    await Vue.nextTick()
    expect(wrapper.vm.$data.renderOrgPersonForm).toBe(true)
    wrapper.destroy()
  })

  it('shows the add person form when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = []
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
  })

  it('shows the add corporation form when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = []
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
  })

  it('shows check icons next to all 3 roles when people list is complete', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole,
      directorRole
    ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(checkIncorporator).exists()).toBe(true)
    expect(wrapper.find(checkDirector).exists()).toBe(true)
    expect(wrapper.find(checkCompletingParty).exists()).toBe(true)
    wrapper.destroy()
  })

  it('shows close icons next to all 3 roles when people list is empty', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(closeCompletingParty).exists()).toBe(true)
    expect(wrapper.find(closeIncorporator).exists()).toBe(true)
    expect(wrapper.find(closeDirector).exists()).toBe(true)
    wrapper.destroy()
  })

  it('sets Valid flag to False when Completing Party role is missing', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([
      incorporatorRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRolesStep.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to False when Incorporator role is missing', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([
      completingPartyRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRolesStep.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to False when Director role is missing', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRolesStep.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to False when a person has no roles', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([])
    const wrapper = wrapperFactory()

    // verify warning text
    expect(wrapper.find('.warning-text').text()).toBe('Missing Role')
    // verify flag
    expect(store.state.stateModel.peopleAndRolesStep.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to True when the component is valid', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRolesStep.valid).toBe(true)

    wrapper.destroy()
  })

  it('sets Changed flag to False when component has no changes', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRolesStep.changed).toBe(false)

    wrapper.destroy()
  })

  it('sets Changed flag to True when component has changes', () => {
    store.state.stateModel.peopleAndRolesStep.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole,
      directorRole
    ])
    store.state.stateModel.peopleAndRolesStep.orgPeople[0].action = 'edited'
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRolesStep.changed).toBe(true)

    wrapper.destroy()
  })

  it('shows popup when undoing an edit would change the Completing Party', async () => {
    // original IA containing original CP:
    const originalCp = getPersonList([completingPartyRole])[0]
    originalCp.officer.id = '1'
    originalCp.action = undefined
    store.state.stateModel.originalIA.incorporationApplication.parties = [originalCp]

    // current orgPeople list containing edited CP and added CP:
    const editedCp = getPersonList([])[0]
    editedCp.officer.id = '1'
    editedCp.action = 'edited'
    const addedCp = getPersonList([completingPartyRole])[0]
    addedCp.officer.id = '2'
    addedCp.action = 'added'
    store.state.stateModel.peopleAndRolesStep.orgPeople = [editedCp, addedCp]

    const wrapper = wrapperFactory()

    // verify that popup is not yet displayed
    expect(wrapper.find('.confirm-dialog').exists()).toBe(false)

    // click the first person's Undo button
    wrapper.find('#officer-0-undo-btn').trigger('click')
    await Vue.nextTick()

    // verify that popup is now displayed
    expect(wrapper.find('.confirm-dialog').exists()).toBe(true)

    wrapper.destroy()
  })
})
