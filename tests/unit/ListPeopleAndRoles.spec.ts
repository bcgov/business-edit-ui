import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ListPeopleAndRoles from '@/components/common/PeopleAndRoles/ListPeopleAndRoles.vue'
import { ChangeResourceGp } from '@/resources/Change/GP'
import { CorrectionResourceBen } from '@/resources/Correction/BEN'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Sample data is from:
// https://www.name-generator.org.uk/quick/
// https://www.fakeaddressgenerator.com/World/ca_address_generator
const benPeopleAndRoles = [
  // unchanged director-person
  {
    officer: {
      id: '0',
      firstName: 'Romeo',
      lastName: 'Whitehead',
      middleName: 'D',
      organizationName: '',
      partyType: 'person',
      email: 'completing-party@example.com'
    },
    roles: [
      { roleType: 'Director', appointmentDate: '2020-03-30' }
    ],
    mailingAddress: {
      streetAddress: '4219 St. John Street',
      streetAddressAdditional: '',
      addressCity: 'Birch Hills',
      addressRegion: 'SK',
      postalCode: 'S4P 3Y2',
      addressCountry: 'CA'
    },
    deliveryAddress: {
      streetAddress: '4219 St. John Street',
      streetAddressAdditional: '',
      addressCity: 'Birch Hills',
      addressRegion: 'SK',
      postalCode: 'S4P 3Y2',
      addressCountry: 'CA'
    }
    // no action here
  },
  // corrected director-org
  {
    officer: {
      id: '1',
      firstName: '',
      lastName: '',
      middleName: '',
      organizationName: 'Random Food Distributors',
      partyType: 'organization'
    },
    roles: [
      { roleType: 'Director', appointmentDate: '2020-03-30' }
    ],
    mailingAddress: {
      streetAddress: '1797 rue Levy',
      streetAddressAdditional: '',
      addressCity: 'Montreal',
      addressRegion: 'QC',
      postalCode: 'H3C 5K4',
      addressCountry: 'CA'
    },
    actions: ['CORRECTED']
  },
  // added person without roles and different addresses
  {
    officer: {
      id: '2',
      firstName: 'Lawrence',
      lastName: 'Kavanagh',
      middleName: '',
      organizationName: '',
      partyType: 'person'
    },
    // for testing "missing role":
    roles: [],
    // for testing "different addresses":
    mailingAddress: {
      streetAddress: '917 Hardy Street',
      streetAddressAdditional: '',
      addressCity: 'Kelowna',
      addressRegion: 'BC',
      postalCode: 'V1Y 8H2',
      addressCountry: 'CA'
    },
    deliveryAddress: {
      streetAddress: '4434 Cassells St',
      streetAddressAdditional: '',
      addressCity: 'North Bay',
      addressRegion: 'ON',
      postalCode: 'P1B 2Y7',
      addressCountry: 'CA'
    },
    actions: ['ADDED']
  },
  // removed director-person
  {
    officer: {
      id: '3',
      firstName: 'Christy',
      lastName: 'Sawyer',
      middleName: '',
      organizationName: '',
      partyType: 'person'
    },
    roles: [
      { roleType: 'Director', appointmentDate: '2020-03-30' }
    ],
    // for testing "different addresses":
    mailingAddress: {
      streetAddress: '1179 A Avenue',
      streetAddressAdditional: '',
      addressCity: 'Edmonton',
      addressRegion: 'AB',
      postalCode: 'T5J 0K7',
      addressCountry: 'CA'
    },
    deliveryAddress: {
      streetAddress: '433 Ferry Road',
      streetAddressAdditional: '',
      addressCity: 'Cornwall',
      addressRegion: 'PE',
      postalCode: 'C0A 1H8',
      addressCountry: 'CA'
    },
    actions: ['REMOVED']
  }
]

const gpPeopleAndRoles = [
  // unchanged partner-person
  {
    officer: {
      id: '0',
      firstName: 'Romeo',
      lastName: 'Whitehead',
      middleName: 'D',
      organizationName: '',
      partyType: 'person',
      email: 'completing-party@example.com'
    },
    roles: [
      { roleType: 'Partner', appointmentDate: '2020-03-30' }
    ],
    mailingAddress: {
      streetAddress: '4219 St. John Street',
      streetAddressAdditional: '',
      addressCity: 'Birch Hills',
      addressRegion: 'SK',
      postalCode: 'S4P 3Y2',
      addressCountry: 'CA'
    },
    deliveryAddress: {
      streetAddress: '4219 St. John Street',
      streetAddressAdditional: '',
      addressCity: 'Birch Hills',
      addressRegion: 'SK',
      postalCode: 'S4P 3Y2',
      addressCountry: 'CA'
    }
    // no action here
  },
  // name-changed partner-org
  {
    officer: {
      id: '1',
      firstName: '',
      lastName: '',
      middleName: '',
      organizationName: 'Random Food Distributors',
      partyType: 'organization',
      email: 'random_food@example.com'
    },
    roles: [
      { roleType: 'Partner', appointmentDate: '2020-03-30' }
    ],
    mailingAddress: {
      streetAddress: '1797 rue Levy',
      streetAddressAdditional: '',
      addressCity: 'Montreal',
      addressRegion: 'QC',
      postalCode: 'H3C 5K4',
      addressCountry: 'CA'
    },
    actions: ['NAME CHANGED']
  },
  // added partner-person
  {
    officer: {
      id: '2',
      firstName: 'Lawrence',
      lastName: 'Kavanagh',
      middleName: '',
      organizationName: '',
      partyType: 'person'
    },
    // for testing "missing role":
    roles: [],
    // for testing "different addresses":
    mailingAddress: {
      streetAddress: '917 Hardy Street',
      streetAddressAdditional: '',
      addressCity: 'Kelowna',
      addressRegion: 'BC',
      postalCode: 'V1Y 8H2',
      addressCountry: 'CA'
    },
    deliveryAddress: {
      streetAddress: '4434 Cassells St',
      streetAddressAdditional: '',
      addressCity: 'North Bay',
      addressRegion: 'ON',
      postalCode: 'P1B 2Y7',
      addressCountry: 'CA'
    },
    actions: ['ADDED']
  },
  // removed partner-person
  {
    officer: {
      id: '3',
      firstName: 'Christy',
      lastName: 'Sawyer',
      middleName: '',
      organizationName: '',
      partyType: 'person'
    },
    roles: [
      { roleType: 'Partner', appointmentDate: '2020-03-30' }
    ],
    mailingAddress: {
      streetAddress: '1179 A Avenue',
      streetAddressAdditional: '',
      addressCity: 'Edmonton',
      addressRegion: 'AB',
      postalCode: 'T5J 0K7',
      addressCountry: 'CA'
    },
    deliveryAddress: {
      streetAddress: '433 Ferry Road',
      streetAddressAdditional: '',
      addressCity: 'Cornwall',
      addressRegion: 'PE',
      postalCode: 'C0A 1H8',
      addressCountry: 'CA'
    },
    actions: ['REMOVED']
  },
  // replaced-added (aka changed) partner-org
  {
    officer: {
      id: '4',
      firstName: '',
      lastName: '',
      middleName: '',
      organizationName: 'Borgan Consulting Inc.',
      partyType: 'organization',
      email: 'emerald_bogan@example.com'
    },
    roles: [
      { roleType: 'Partner', appointmentDate: '2020-03-30' }
    ],
    mailingAddress: {
      streetAddress: '27 Erie St',
      streetAddressAdditional: '',
      addressCity: 'Victoria',
      addressRegion: 'BC',
      postalCode: 'V8V 1P8',
      addressCountry: 'CA'
    },
    deliveryAddress: {
      streetAddress: '27 Erie St',
      streetAddressAdditional: '',
      addressCity: 'Victoria',
      addressRegion: 'BC',
      postalCode: 'V8V 1P8',
      addressCountry: 'CA'
    },
    actions: ['REPLACED', 'ADDED']
  }
]

const emptyPerson = {
  officer: {
    id: null,
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: '',
    partyType: 'person',
    email: null
  },
  roles: [],
  mailingAddress: {
    streetAddress: '',
    streetAddressAdditional: '',
    addressCity: '',
    addressRegion: '',
    postalCode: '',
    addressCountry: '',
    deliveryInstructions: ''
  },
  actions: []
}

const emptyOrg = {
  officer: {
    id: null,
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: '',
    partyType: 'organization',
    email: null
  },
  roles: [],
  mailingAddress: {
    streetAddress: '',
    streetAddressAdditional: '',
    addressCity: '',
    addressRegion: '',
    postalCode: '',
    addressCountry: '',
    deliveryInstructions: ''
  },
  actions: []
}

describe('List People And Roles component for Corrections', () => {
  const wrapperFactory = (orgPeople, propsData = {}) => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.resourceModel = CorrectionResourceBen
    store.stateModel.peopleAndRoles.orgPeople = orgPeople
    return mount(ListPeopleAndRoles, { propsData, vuetify })
  }

  it('does not show the list if there is no data to display', () => {
    const wrapper = wrapperFactory([])

    expect(wrapper.find('#people-roles-list').exists()).toBe(false)
    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(0)

    wrapper.destroy()
  })

  it('displays the correct number of items when data is present', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles)

    expect(wrapper.find('#people-roles-list').exists()).toBe(true)
    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(4)

    wrapper.destroy()
  })

  it('displays the correct names and badges in the list', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.people-roles-title').text()).toBe('Romeo D Whitehead')
    expect(rows.at(0).find('.v-chip').exists()).toBe(false)
    expect(rows.at(1).find('.people-roles-title').text()).toBe('Random Food Distributors')
    expect(rows.at(1).find('.v-chip').text()).toBe('CORRECTED')
    expect(rows.at(2).find('.people-roles-title').text()).toBe('Lawrence Kavanagh')
    expect(rows.at(2).find('.v-chip').text()).toBe('ADDED')
    expect(rows.at(3).find('.people-roles-title').text()).toBe('Christy Sawyer')
    expect(rows.at(3).find('.v-chip').text()).toBe('REMOVED')

    wrapper.destroy()
  })

  it('displays the correct mailing addresses in the list', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-mailing-address').text()).toContain('4219 St. John Street')
    expect(rows.at(1).find('.peoples-roles-mailing-address').text()).toContain('1797 rue Levy')
    expect(rows.at(2).find('.peoples-roles-mailing-address').text()).toContain('917 Hardy Street')
    expect(rows.at(3).find('.peoples-roles-mailing-address').text()).toContain('1179 A Avenue')

    wrapper.destroy()
  })

  it('displays the correct delivery addresses in the list', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-delivery-address').text()).toBe('Same as Mailing Address')
    expect(rows.at(1).find('.peoples-roles-delivery-address').exists()).toBe(true)
    expect(rows.at(2).find('.peoples-roles-delivery-address').exists()).toBe(false)
    expect(rows.at(3).find('.peoples-roles-delivery-address').text()).toContain('433 Ferry Road')

    wrapper.destroy()
  })

  it('displays the correct roles', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles)

    const item1 = wrapper.findAll('.people-roles-content').at(0)
    expect(item1.find('.col-roles').text()).toBe('Director')

    const item2 = wrapper.findAll('.people-roles-content').at(1)
    expect(item2.find('.col-roles').text()).toBe('Director')

    const item3 = wrapper.findAll('.people-roles-content').at(2)
    expect(item3.text()).toContain('Missing Role')

    const item4 = wrapper.findAll('.people-roles-content').at(3)
    expect(item4.find('.col-roles').text()).toBe('Director')

    wrapper.destroy()
  })

  it('displays the correct actions menus', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles)

    // unchanged
    const item1 = wrapper.findAll('.people-roles-content').at(0)
    const button1 = item1.find('.actions .edit-action #officer-0-edit-btn')
    expect(button1.exists()).toBe(true)
    expect(button1.text()).toBe('Correct')

    // CORRECTED
    const item2 = wrapper.findAll('.people-roles-content').at(1)
    const button2 = item2.find('.actions .undo-action #officer-1-undo-btn')
    expect(button2.exists()).toBe(true)
    expect(button2.text()).toBe('Undo')

    // ADDED
    const item3 = wrapper.findAll('.people-roles-content').at(2)
    const button3 = item3.find('.actions .edit-action #officer-2-edit-btn')
    expect(button3.exists()).toBe(true)
    expect(button3.text()).toBe('Edit')

    // REMOVED
    const item4 = wrapper.findAll('.people-roles-content').at(3)
    const button4 = item4.find('.actions .undo-action #officer-3-undo-btn')
    expect(button4.exists()).toBe(true)
    expect(button4.text()).toBe('Undo')

    wrapper.destroy()
  })

  it('correctly displays Add Person component', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles, {
      renderOrgPersonForm: true,
      currentOrgPerson: emptyPerson,
      activeIndex: NaN
    })

    // verify that add component is at the top (above the list)
    const section = wrapper.find('#people-roles-add')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Add Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Edit Person component', () => {
    const wrapper = wrapperFactory(benPeopleAndRoles, {
      renderOrgPersonForm: true,
      currentOrgPerson: benPeopleAndRoles[0],
      activeIndex: 0
    })

    // verify that edit component is within the list (inline)
    const section = wrapper.find('#people-roles-list #people-roles-edit')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Edit Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })
})

describe('List People And Roles component for Change of Registration', () => {
  const wrapperFactory = (orgPeople, propsData = {}) => {
    store.stateModel.tombstone.entityType = CorpTypeCd.PARTNERSHIP
    store.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    store.resourceModel = ChangeResourceGp
    store.stateModel.peopleAndRoles.orgPeople = orgPeople
    return mount(ListPeopleAndRoles, { propsData, vuetify })
  }

  it('does not show the list if there is no data to display', () => {
    const wrapper = wrapperFactory([])

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(0)
    expect(wrapper.find('#people-roles-list').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays list headers if there is only a removed item', () => {
    const orgPeople = [
      {
        ...emptyOrg,
        actions: ['REMOVED']
      }
    ]
    const wrapper = wrapperFactory(orgPeople)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(1)
    expect(wrapper.find('.people-roles-list-header').exists()).toBe(true)

    wrapper.destroy()
  })

  it('does not show list headers if there is only a replaced-removed item', () => {
    const orgPeople = [
      {
        ...emptyOrg,
        actions: ['REPLACED', 'REMOVED']
      }
    ]
    const wrapper = wrapperFactory(orgPeople)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(0)
    expect(wrapper.find('.people-roles-list-header').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays the correct number of items when data is present', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles)

    expect(wrapper.find('#people-roles-list').exists()).toBe(true)
    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(5)

    wrapper.destroy()
  })

  it('displays the correct names and badges in the list', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.people-roles-title').text()).toBe('Romeo D Whitehead')
    expect(rows.at(0).find('.v-chip').exists()).toBe(false)
    expect(rows.at(1).find('.people-roles-title').text()).toBe('Random Food Distributors')
    expect(rows.at(1).find('.v-chip').text()).toBe('NAME CHANGED')
    expect(rows.at(2).find('.people-roles-title').text()).toBe('Lawrence Kavanagh')
    expect(rows.at(2).find('.v-chip').text()).toBe('ADDED')
    expect(rows.at(3).find('.people-roles-title').text()).toBe('Christy Sawyer')
    expect(rows.at(3).find('.v-chip').text()).toBe('REMOVED')
    expect(rows.at(4).find('.people-roles-title').text()).toBe('Borgan Consulting Inc.')
    expect(rows.at(4).find('.v-chip').text()).toBe('CHANGED')

    wrapper.destroy()
  })

  it('displays the correct mailing addresses in the list', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-mailing-address').text()).toContain('4219 St. John Street')
    expect(rows.at(1).find('.peoples-roles-mailing-address').text()).toContain('1797 rue Levy')
    expect(rows.at(2).find('.peoples-roles-mailing-address').text()).toContain('917 Hardy Street')
    expect(rows.at(3).find('.peoples-roles-mailing-address').text()).toContain('1179 A Avenue')
    expect(rows.at(4).find('.peoples-roles-mailing-address').text()).toContain('27 Erie St')

    wrapper.destroy()
  })

  it('displays the correct delivery addresses in the list', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles)

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-delivery-address').text()).toBe('Same as Mailing Address')
    expect(rows.at(1).find('.peoples-roles-delivery-address').text()).toBe('')
    expect(rows.at(2).find('.peoples-roles-delivery-address').exists()).toBe(false)
    expect(rows.at(3).find('.peoples-roles-delivery-address').text()).toContain('433 Ferry Road')
    expect(rows.at(4).find('.peoples-roles-delivery-address').text()).toBe('Same as Mailing Address')

    wrapper.destroy()
  })

  it('does not display the roles', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles,
      {
        showDeliveryAddressColumn: true,
        showRolesColumn: false,
        showEmailColumn: false
      })

    const item1 = wrapper.findAll('.people-roles-content').at(0)
    expect(item1.findAll('.col-roles').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays the correct actions menus', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles)

    // unchanged
    const item1 = wrapper.findAll('.people-roles-content').at(0)
    const button1 = item1.find('.actions .edit-action #officer-0-edit-btn')
    expect(button1.exists()).toBe(true)
    expect(button1.text()).toBe('Change')
    expect(item1.find('.dropdown-action').exists()).toBe(true)

    // NAME CHANGED
    const item2 = wrapper.findAll('.people-roles-content').at(1)
    const button2 = item2.find('.actions .undo-action #officer-1-undo-btn')
    expect(button2.exists()).toBe(true)
    expect(button2.text()).toBe('Undo')
    expect(item2.find('.dropdown-action').exists()).toBe(true)

    // ADDED
    const item3 = wrapper.findAll('.people-roles-content').at(2)
    const button3 = item3.find('.actions .edit-action #officer-2-edit-btn')
    expect(button3.exists()).toBe(true)
    expect(button3.text()).toBe('Edit')
    expect(item3.find('.dropdown-action').exists()).toBe(true)

    // REMOVED
    const item4 = wrapper.findAll('.people-roles-content').at(3)
    const button4 = item4.find('.actions .undo-action #officer-3-undo-btn')
    expect(button4.exists()).toBe(true)
    expect(button4.text()).toBe('Undo')
    expect(item4.find('.dropdown-action').exists()).toBe(false)

    // REPLACED
    const item5 = wrapper.findAll('.people-roles-content').at(4)
    const button5 = item5.find('.actions .undo-action #officer-4-undo-btn')
    expect(button5.exists()).toBe(true)
    expect(button5.text()).toBe('Undo')
    expect(item5.find('.dropdown-action').exists()).toBe(false)

    wrapper.destroy()
  })

  it('correctly displays Add Person component', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles, {
      renderOrgPersonForm: true,
      currentOrgPerson: emptyPerson,
      activeIndex: NaN
    })

    // verify that add component is at the top (above the list)
    const section = wrapper.find('#people-roles-add')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Add Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Add Corporation component', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles, {
      renderOrgPersonForm: true,
      currentOrgPerson: emptyOrg,
      activeIndex: NaN
    })

    // verify that add component is at the top (above the list)
    const section = wrapper.find('#people-roles-add')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-org-header').text()).toBe('Add Business or Corporation')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Edit Person component', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles, {
      renderOrgPersonForm: true,
      currentOrgPerson: gpPeopleAndRoles[0],
      activeIndex: 0
    })

    // verify that edit component is within the list (inline)
    const section = wrapper.find('#people-roles-list #people-roles-edit')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Edit Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Edit Corporation component', () => {
    const wrapper = wrapperFactory(gpPeopleAndRoles, {
      renderOrgPersonForm: true,
      currentOrgPerson: gpPeopleAndRoles[1],
      activeIndex: 0
    })

    // verify that edit component is within the list (inline)
    const section = wrapper.find('#people-roles-list #people-roles-edit')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-org-header').text()).toBe('Edit Business or Corporation')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })
})
