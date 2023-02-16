import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { GpChangeResource } from '@/resources/Change/GP'
import { BenCorrectionResource } from '@/resources/Correction/BEN'
import { getVuexStore } from '@/store/'
import { mount, shallowMount } from '@vue/test-utils'
import PeopleAndRoles from '@/components/common/PeopleAndRoles/PeopleAndRoles.vue'

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
const gpAddCorp = '#gp-btn-add-corp'
const closeDirector = '.dir-invalid'
const checkDirector = '.dir-valid'

const directorRole = { roleType: 'Director', appointmentDate: '2020-03-30' }

/** Returns a single-element array with a person having the specified roles. */
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

/** Returns a single-element array with an organization having the specified roles. */
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
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.entitySnapshot = {}
    store.state.resourceModel = BenCorrectionResource

    wrapperFactory = () => {
      return mount(PeopleAndRoles, { store, vuetify })
    }
  })

  it('shows 1 add button when people list is empty', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBe(true)
    wrapper.destroy()
  })

  it('sets the data attributes as expected when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(btnAddPerson).trigger('click')
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
    wrapper.destroy()
  })

  it('shows the add person form when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    await wrapper.find(btnAddPerson).trigger('click')
    // verify button is now disabled
    expect(wrapper.find(btnAddPerson).attributes('disabled')).toBe('disabled')
    // check form
    expect(wrapper.find(orgPersonForm).exists()).toBe(true)
    expect(wrapper.find('.add-person-header').text()).toBe('Add Person')
    wrapper.destroy()
  })

  it('shows check icons next to the director role when people list is complete', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([ directorRole ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(checkDirector).exists()).toBe(true)
    wrapper.destroy()
  })

  it('shows close icons next to the director role when people list is empty', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(closeDirector).exists()).toBe(true)
    wrapper.destroy()
  })

  it('sets Valid flag to False when Director role is missing', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.validationFlags.flagsCompanyInfo.isValidOrgPersons).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to False when a person has no roles', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([])
    const wrapper = wrapperFactory()

    // verify warning text
    expect(wrapper.find('.warning-text').text()).toBe('Missing Role')
    // verify flag
    expect(store.state.stateModel.validationFlags.flagsCompanyInfo.isValidOrgPersons).toBe(false)

    wrapper.destroy()
  })

  it('sets Valid flag to True when the component is valid', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([ directorRole ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.validationFlags.flagsCompanyInfo.isValidOrgPersons).toBe(true)

    wrapper.destroy()
  })

  it('sets Changed flag to False when component has no changes', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([ directorRole ])
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.changed).toBe(false)

    wrapper.destroy()
  })

  it('sets Changed flag to True when component has changes', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = getPersonList([ directorRole ])
    store.state.stateModel.peopleAndRoles.orgPeople[0].actions = ['EDITED']
    const wrapper = wrapperFactory()

    expect(store.state.stateModel.peopleAndRoles.changed).toBe(true)

    wrapper.destroy()
  })
})

describe('People And Roles component for Change of Registration', () => {
  let wrapperFactory: any

  beforeAll(() => {
    store.state.stateModel.tombstone.entityType = 'GP'
    store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
    store.state.resourceModel = GpChangeResource

    wrapperFactory = () => {
      return mount(PeopleAndRoles, {
        computed: { appointmentDate: { get (): string { return '2022-11-24' } } },
        store,
        vuetify
      })
    }
  })

  it('shows both add buttons when people list is empty', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()

    expect(wrapper.find(gpAddPerson).exists()).toBe(true)
    expect(wrapper.find(gpAddCorp).exists()).toBe(true)

    wrapper.destroy()
  })

  it('sets the properties as expected when Add Person button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()

    await wrapper.find(gpAddPerson).trigger('click')

    // verify properties
    expect(wrapper.vm.$data.activeIndex).toBe(NaN)
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
    expect(wrapper.vm.$data.currentOrgPerson.roles).toEqual([{ roleType: 'Partner', appointmentDate: '2022-11-24' }])
    expect(wrapper.vm.$data.currentOrgPerson.officer.partyType).toBe('person')
    expect(wrapper.vm.$data.currentOrgPerson.actions).toEqual(['ADDED'])

    wrapper.destroy()
  })

  it('sets the properties as expected when Add Corporation button is clicked', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = []
    const wrapper = wrapperFactory()

    await wrapper.find(gpAddCorp).trigger('click')

    // verify properties
    expect(wrapper.vm.$data.activeIndex).toBe(NaN)
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
    expect(wrapper.vm.$data.currentOrgPerson.roles).toEqual([{ roleType: 'Partner', appointmentDate: '2022-11-24' }])
    expect(wrapper.vm.$data.currentOrgPerson.officer.partyType).toBe('organization')
    expect(wrapper.vm.$data.currentOrgPerson.actions).toEqual(['ADDED'])

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

  it('resets state properties correctly', async () => {
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: null,
        roles: [],
        mailingAddress: null,
        actions: ['REMOVED', 'REPLACED']
      }
    ]
    const wrapper: any = shallowMount(PeopleAndRoles, {
      data: () => ({ isAddingEditingOrgPerson: true }),
      store,
      vuetify
    })
    const mockScrollToTop = jest.spyOn(wrapper.vm, 'scrollToTop').mockImplementation()

    // call reset, restoring the removed-replaced item
    await wrapper.vm.reset(true)

    // verify that item is no longer removed-replaced
    expect(store.state.stateModel.peopleAndRoles.orgPeople.length).toBe(1)
    expect(store.state.stateModel.peopleAndRoles.orgPeople[0].actions).toBeUndefined()

    // verify other things
    expect(wrapper.vm.$data.currentOrgPerson).toBeNull()
    expect(wrapper.vm.$data.activeIndex).toBe(NaN)
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(false)
    expect(mockScrollToTop).toHaveBeenCalled()
  })

  it('undoes "added" changes correctly', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { id: '0' },
        roles: [],
        mailingAddress: null,
        actions: ['ADDED']
      }
    ]
    const wrapper: any = shallowMount(PeopleAndRoles, {
      computed: {
        // bypass checks we don't care about
        haveRequiredParties: () => true,
        haveRequiredAddresses: () => true,
        noMissingRoles: () => true
      },
      store,
      vuetify
    })
    const mockSetValidity = jest.spyOn(wrapper.vm, 'setPeopleAndRolesValidity')
    const mockSetChanged = jest.spyOn(wrapper.vm, 'setPeopleAndRolesChanged')

    // call undo for the added item
    wrapper.vm.undo(0)

    // verify that item is no longer added
    expect(store.state.stateModel.peopleAndRoles.orgPeople.length).toBe(0)

    // verify other things
    expect(mockSetValidity).toHaveBeenCalledWith(true)
    expect(mockSetChanged).toHaveBeenCalledWith(false)
  })

  it('undoes "removed" changes correctly', () => {
    store.state.stateModel.entitySnapshot.orgPersons = [
      {
        officer: { id: '0' },
        roles: [],
        mailingAddress: null
      }
    ]
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { id: '0' },
        roles: [],
        mailingAddress: null,
        actions: ['REMOVED']
      }
    ]
    const wrapper: any = shallowMount(PeopleAndRoles, {
      computed: {
        // bypass checks we don't care about
        haveRequiredParties: () => true,
        haveRequiredAddresses: () => true,
        noMissingRoles: () => true
      },
      store,
      vuetify
    })
    const mockSetValidity = jest.spyOn(wrapper.vm, 'setPeopleAndRolesValidity')
    const mockSetChanged = jest.spyOn(wrapper.vm, 'setPeopleAndRolesChanged')

    // call undo for the removed item
    wrapper.vm.undo(0)

    // verify that item is no longer removed
    expect(store.state.stateModel.peopleAndRoles.orgPeople.length).toBe(1)
    expect(store.state.stateModel.peopleAndRoles.orgPeople[0].actions).toBeUndefined()

    // verify other things
    expect(mockSetValidity).toHaveBeenCalledWith(true)
    expect(mockSetChanged).toHaveBeenCalledWith(false)
  })

  it('undoes "replace" changes correctly', () => {
    store.state.stateModel.entitySnapshot.orgPersons = [
      {
        officer: { id: '0' },
        roles: [],
        mailingAddress: null
      }
    ]
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { id: '0' },
        roles: [],
        mailingAddress: null,
        actions: ['REMOVED', 'REPLACED']
      },
      {
        officer: { id: '1' },
        roles: [],
        mailingAddress: null,
        actions: ['ADDED', 'REPLACED']
      }
    ]
    const wrapper: any = shallowMount(PeopleAndRoles, {
      computed: {
        // bypass checks we don't care about
        haveRequiredParties: () => true,
        haveRequiredAddresses: () => true,
        noMissingRoles: () => true
      },
      store,
      vuetify
    })
    const mockSetValidity = jest.spyOn(wrapper.vm, 'setPeopleAndRolesValidity')
    const mockSetChanged = jest.spyOn(wrapper.vm, 'setPeopleAndRolesChanged')

    // call undo for the added-replaced item
    wrapper.vm.undo(1)

    // verify that item is no longer replaced
    expect(store.state.stateModel.peopleAndRoles.orgPeople.length).toBe(1)
    expect(store.state.stateModel.peopleAndRoles.orgPeople[0].actions).toBeUndefined()

    // verify other things
    expect(mockSetValidity).toHaveBeenCalledWith(true)
    expect(mockSetChanged).toHaveBeenCalledWith(false)
  })

  it('initializes "replace" correctly', () => {
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { id: '0' },
        roles: [],
        mailingAddress: null
      }
    ]
    const wrapper: any = shallowMount(PeopleAndRoles, {
      computed: { appointmentDate: { get (): string { return '2022-11-24' } } },
      store,
      vuetify
    })

    // call replace for the existing item
    wrapper.vm.replace(0)

    // verify replaced-removed item
    expect(store.state.stateModel.peopleAndRoles.orgPeople[0].actions).toEqual(['REPLACED', 'REMOVED'])

    // verify replaced-added item
    expect(wrapper.vm.$data.currentOrgPerson.roles).toEqual([{ roleType: 'Proprietor', appointmentDate: '2022-11-24' }])
    expect(wrapper.vm.$data.currentOrgPerson.officer.partyType).toBe('organization')
    expect(wrapper.vm.$data.currentOrgPerson.actions).toEqual(['REPLACED', 'ADDED'])

    // verify other things
    expect(wrapper.vm.$data.activeIndex).toBe(NaN)
    expect(wrapper.vm.$data.isAddingEditingOrgPerson).toBe(true)
  })

  it('change button is not visible to users for SP where the sole proprietor is an organization', () => {
    store.state.stateModel.tombstone.keycloakRoles = ['user']
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { partyType: 'organization' },
        roles: [{ roleType: 'Proprietor' }]
      }
    ]
    expect(store.getters.hideChangeButtonForSoleProps).toBe(true)
  })

  it('change button is visible to staff for SP where the sole proprietor is an organization', () => {
    store.state.stateModel.tombstone.keycloakRoles = ['staff']
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { partyType: 'organization' },
        roles: [{ roleType: 'Proprietor' }]
      }
    ]
    expect(store.getters.hideChangeButtonForSoleProps).toBe(false)
  })

  it('change button is visible to users for SP where the sole proprietor is an individual', () => {
    store.state.stateModel.tombstone.keycloakRoles = ['user']
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.stateModel.peopleAndRoles.orgPeople = [
      {
        officer: { partyType: 'person' },
        roles: [{ roleType: 'Proprietor' }]
      }
    ]
    expect(store.getters.hideChangeButtonForSoleProps).toBe(false)
  })
})
