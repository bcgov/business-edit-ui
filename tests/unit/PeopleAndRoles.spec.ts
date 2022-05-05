import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { GeneralPartnershipResource } from '@/resources/Change/GeneralPartnershipResource'
import { BenefitCompanyStatementResource } from '@/resources/Correction/BenefitCompanyStatementResource'
import { getVuexStore } from '@/store/'
import { createLocalVue, mount } from '@vue/test-utils'
import PeopleAndRoles from '@/components/common/PeopleAndRoles/PeopleAndRoles.vue'
import { FilingTypes } from '@/enums/'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const orgPersonForm = '#org-person-form'
const btnAddPerson = '#btn-add-person'
const gpAddPerson = '#gp-btn-add-person'
const btnAddCorp = '#btn-add-corp'
const gpAddCorp = '#gp-btn-add-corp'
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

function getOrgList (roles: Array<any> = []): Array<any> {
  return [
    {
      officer: {
        id: '0',
        firstName: '',
        lastName: '',
        middleName: 'D',
        organizationName: 'Mock Corporation Inc.',
        partyType: 'organization'
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

describe('People And Roles component for Correction', () => {
  let wrapperFactory: any
  beforeAll(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    store.state.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.state.resourceModel = BenefitCompanyStatementResource

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
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBe(true)
    expect(wrapper.find(btnAddCorp).exists()).toBe(true)
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(true)
    wrapper.destroy()
  })

  it('shows only Add Person and Add Corporation buttons when people list has a Completing Party', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([completingPartyRole])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBe(true)
    expect(wrapper.find(btnAddCorp).exists()).toBe(true)
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(false)
    wrapper.destroy()
  })

  it('shows Add Completing Party button when people list has no Completing Party', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([incorporatorRole, directorRole])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(true)
    wrapper.destroy()
  })

  it('sets the data attributes as expected when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(btnAddPerson).trigger('click')
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
    wrapper.destroy()
  })

  it('sets the data attributes as expected when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(btnAddCorp).trigger('click')
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
    wrapper.destroy()
  })

  it('shows the add person form when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(btnAddPerson).trigger('click')
    // verify buttons are now disabled
    expect(wrapper.find(btnAddPerson).attributes('disabled')).toBe('disabled')
    expect(wrapper.find(btnAddCorp).attributes('disabled')).toBe('disabled')
    // check form
    expect(wrapper.find(orgPersonForm).exists()).toBe(true)
    expect(wrapper.find('.add-person-header').text()).toBe('Add Person')
    wrapper.destroy()
  })

  it('shows the add corporation form when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(btnAddCorp).trigger('click')
    // verify buttons are now disabled
    expect(wrapper.find(btnAddPerson).attributes('disabled')).toBe('disabled')
    expect(wrapper.find(btnAddCorp).attributes('disabled')).toBe('disabled')
    // check form
    expect(wrapper.find(orgPersonForm).exists()).toBe(true)
    expect(wrapper.find('.add-org-header').text()).toBe('Add Corporation or Firm')
    wrapper.destroy()
  })

  it('shows check icons next to all 3 roles when people list is complete', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
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
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(closeCompletingParty).exists()).toBe(true)
    expect(wrapper.find(closeIncorporator).exists()).toBe(true)
    expect(wrapper.find(closeDirector).exists()).toBe(true)
    wrapper.destroy()
  })

  it('sets Valid flag to False when Completing Party role is missing', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      incorporatorRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to False when Incorporator role is missing', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      completingPartyRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to False when Director role is missing', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to False when a person has no roles', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([])
    const wrapper = wrapperFactory()

    // verify warning text
    expect(wrapper.find('.warning-text').text()).toBe('Missing Role')
    // verify flag
    expect(store.state.stateModel.peopleAndRoles.valid).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to True when the component is valid', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.valid).toBe(true)

    wrapper.destroy()
  })

  it('sets Changed flag to False when component has no changes', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole,
      directorRole
    ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.changed).toBe(false)

    wrapper.destroy()
  })

  it('sets Changed flag to True when component has changes', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([
      completingPartyRole,
      incorporatorRole,
      directorRole
    ])
    store.state.stateModel.peopleAndRoles.orgPeople[0].actions = ['edited']
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.changed).toBe(true)

    wrapper.destroy()
  })

  it('shows popup when undoing an edit would change the Completing Party', async () => {
    // original IA containing original CP:
    const originalCp = getPersonList([completingPartyRole])[0]
    originalCp.officer.id = '1'
    originalCp.actions = undefined
    store.state.stateModel.originalIA.incorporationApplication.parties = [originalCp]

    // current orgPeople list containing edited CP and added CP:
    const editedCp = getPersonList([])[0]
    editedCp.officer.id = '1'
    editedCp.actions = ['edited']
    const addedCp = getPersonList([completingPartyRole])[0]
    addedCp.officer.id = '2'
    addedCp.actions = ['added']
    store.state.stateModel.peopleAndRoles.orgPeople = [editedCp, addedCp]

    const wrapper = wrapperFactory()

    // verify that popup is not yet displayed
    expect(wrapper.find('.confirm-dialog').exists()).toBe(false)

    // click the first person's Undo button
    await wrapper.find('#officer-0-undo-btn').trigger('click')

    // verify that popup is now displayed
    expect(wrapper.find('.confirm-dialog').exists()).toBe(true)

    wrapper.destroy()
  })
})

describe('People And Roles component for Change of Registration', () => {
  let wrapperFactory: any
  beforeAll(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    store.state.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    store.state.stateModel.tombstone.entityType = 'GP'
    store.state.resourceModel = GeneralPartnershipResource

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
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(gpAddPerson).exists()).toBe(true)
    expect(wrapper.find(gpAddCorp).exists()).toBe(true)
    wrapper.destroy()
  })

  it('shows only Add Person and Add Corporation buttons when people list has a Completing Party', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList(['partner'])
    const wrapper = wrapperFactory()
    expect(wrapper.find(gpAddPerson).exists()).toBe(true)
    expect(wrapper.find(gpAddCorp).exists()).toBe(true)
    expect(wrapper.find(btnAddCompletingParty).exists()).toBe(false)
    wrapper.destroy()
  })

  it('sets the data attributes as expected when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(gpAddPerson).trigger('click')
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
    wrapper.destroy()
  })

  it('sets the data attributes as expected when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(gpAddCorp).trigger('click')
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
    wrapper.destroy()
  })

  it('shows the add person form when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(gpAddPerson).trigger('click')
    // verify buttons are now disabled
    expect(wrapper.find(gpAddPerson).attributes('disabled')).toBe('disabled')
    expect(wrapper.find(gpAddCorp).attributes('disabled')).toBe('disabled')
    // check form
    expect(wrapper.find(orgPersonForm).exists()).toBe(true)
    expect(wrapper.find('.add-person-header').text()).toBe('Add Person')
    wrapper.destroy()
  })

  it('shows the add corporation form when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getOrgList(['partner'])
    const wrapper = wrapperFactory()
    await wrapper.find(gpAddCorp).trigger('click')
    // verify buttons are now disabled
    expect(wrapper.find(gpAddPerson).attributes('disabled')).toBe('disabled')
    expect(wrapper.find(gpAddCorp).attributes('disabled')).toBe('disabled')
    // check form
    expect(wrapper.find(orgPersonForm).exists()).toBe(true)
    expect(wrapper.find('.add-org-header').text()).toBe('Add Business or Corporation')
    wrapper.destroy()
  })
})
