import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ListPeopleAndRoles from '@/components/common/PeopleAndRoles/ListPeopleAndRoles.vue'
import { getVuexStore } from '@/store/'
import { FilingTypes } from '@/enums/'
import { GeneralPartnershipResource } from '@/resources/Change/GeneralPartnershipResource'
import { BenefitCompanyStatementResource } from '@/resources/Correction/BenefitCompanyStatementResource'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const store = getVuexStore()
const vuetify = new Vuetify({})

// Sample data is from:
// https://www.name-generator.org.uk/quick/
// https://www.fakeaddressgenerator.com/World/ca_address_generator
const peopleAndRoles = [
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
      { roleType: 'Completing Party', appointmentDate: '2020-03-30' },
      { roleType: 'Incorporator', appointmentDate: '2020-03-30' },
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
      { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
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
  }
]

const emptyPerson = {
  officer: {
    id: null as string,
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: '',
    partyType: 'person',
    email: null as string
  },
  roles: [] as [],
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
    id: null as string,
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: '',
    partyType: 'organization',
    email: null as string
  },
  roles: [] as [],
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
  let wrapperFactory: any

  beforeAll(() => {
    store.state.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.state.resourceModel = BenefitCompanyStatementResource
    wrapperFactory = (propsData: any) => {
      return mount(ListPeopleAndRoles, { propsData: { ...propsData }, vuetify, store })
    }
  })

  it('does not show the list if there is no data to display', () => {
    const wrapper = wrapperFactory()

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(0)
    expect(wrapper.find('#people-roles-list').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays the correct number of items when data is present', () => {
    const wrapper = wrapperFactory({ peopleAndRoles })

    expect(wrapper.find('#people-roles-list').exists()).toBe(true)
    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(4)

    wrapper.destroy()
  })

  it('displays the correct names and badges in the list', () => {
    const wrapper = wrapperFactory({ peopleAndRoles })

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
    const wrapper = wrapperFactory({ peopleAndRoles })

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-mailing-address').text()).toContain('4219 St. John Street')
    expect(rows.at(1).find('.peoples-roles-mailing-address').text()).toContain('1797 rue Levy')
    expect(rows.at(2).find('.peoples-roles-mailing-address').text()).toContain('917 Hardy Street')
    expect(rows.at(3).find('.peoples-roles-mailing-address').text()).toContain('1179 A Avenue')

    wrapper.destroy()
  })

  it('displays the correct delivery addresses in the list', () => {
    const wrapper = wrapperFactory({ peopleAndRoles })

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-delivery-address').text()).toBe('Same as Mailing Address')
    expect(rows.at(1).find('.peoples-roles-delivery-address').text()).toBe('')
    expect(rows.at(2).find('.peoples-roles-delivery-address').text()).toContain('4434 Cassells St')
    expect(rows.at(3).find('.peoples-roles-delivery-address').text()).toContain('433 Ferry Road')

    wrapper.destroy()
  })

  it('displays the correct roles', () => {
    const wrapper = wrapperFactory({ peopleAndRoles })

    const item1 = wrapper.findAll('.people-roles-content').at(0)
    expect(item1.findAll('.col-roles').at(0).text()).toBe('Completing Party')
    expect(item1.findAll('.col-roles').at(1).text()).toBe('Incorporator')
    expect(item1.findAll('.col-roles').at(2).text()).toBe('Director')

    const item2 = wrapper.findAll('.people-roles-content').at(1)
    expect(item2.find('.col-roles').text()).toBe('Incorporator')

    const item3 = wrapper.findAll('.people-roles-content').at(2)
    expect(item3.text()).toContain('Missing Role')

    const item4 = wrapper.findAll('.people-roles-content').at(3)
    expect(item4.find('.col-roles').text()).toBe('Director')

    wrapper.destroy()
  })

  it('displays the correct actions menus', () => {
    const wrapper = wrapperFactory({ peopleAndRoles })

    // No action
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
    const wrapper = wrapperFactory({
      peopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: emptyPerson,
      activeIndex: NaN,
      currentCompletingParty: undefined
    })

    // verify that add component is at the top (above the list)
    const section = wrapper.find('#people-roles-add')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Add Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Add Corporation component', () => {
    const wrapper = wrapperFactory({
      peopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: emptyOrg,
      activeIndex: NaN,
      currentCompletingParty: undefined
    })

    // verify that add component is at the top (above the list)
    const section = wrapper.find('#people-roles-add')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-org-header').text()).toBe('Add Corporation or Firm')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Edit Person component', () => {
    const wrapper = wrapperFactory({
      peopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: peopleAndRoles[0],
      activeIndex: 0,
      currentCompletingParty: undefined
    })

    // verify that edit component is within the list (inline)
    const section = wrapper.find('#people-roles-list #people-roles-edit')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Edit Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Edit Corporation component', () => {
    const wrapper = wrapperFactory({
      peopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: peopleAndRoles[1],
      activeIndex: 0,
      currentCompletingParty: undefined
    })

    // verify that edit component is within the list (inline)
    const section = wrapper.find('#people-roles-list #people-roles-edit')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-org-header').text()).toBe('Edit Corporation or Firm')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })
})

describe('List People And Roles component for Change of Registration', () => {
  let wrapperFactory: any

  beforeAll(() => {
    store.state.stateModel.tombstone.filingType = FilingTypes.CHANGE_OF_REGISTRATION
    store.state.resourceModel = GeneralPartnershipResource
    wrapperFactory = (propsData: any) => {
      return mount(ListPeopleAndRoles, { propsData: { ...propsData }, vuetify, store })
    }
  })

  it('does not show the list if there is no data to display', () => {
    const wrapper = wrapperFactory()

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(0)
    expect(wrapper.find('#people-roles-list').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays the correct number of items when data is present', () => {
    const wrapper = wrapperFactory({ peopleAndRoles: gpPeopleAndRoles })

    expect(wrapper.find('#people-roles-list').exists()).toBe(true)
    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.length).toEqual(4)

    wrapper.destroy()
  })

  it('displays the correct names and badges in the list', () => {
    const wrapper = wrapperFactory({ peopleAndRoles: gpPeopleAndRoles })

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.people-roles-title').text()).toBe('Romeo D Whitehead')
    expect(rows.at(0).find('.v-chip').exists()).toBe(false)
    expect(rows.at(1).find('.people-roles-title').text()).toBe('Random Food Distributors')
    expect(rows.at(1).find('.v-chip').text()).toBe('NAME CHANGED')
    expect(rows.at(2).find('.people-roles-title').text()).toBe('Lawrence Kavanagh')
    expect(rows.at(2).find('.v-chip').text()).toBe('ADDED')
    expect(rows.at(3).find('.people-roles-title').text()).toBe('Christy Sawyer')
    expect(rows.at(3).find('.v-chip').text()).toBe('REMOVED')

    wrapper.destroy()
  })

  it('displays the correct mailing addresses in the list', () => {
    const wrapper = wrapperFactory({ peopleAndRoles: gpPeopleAndRoles })

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-mailing-address').text()).toContain('4219 St. John Street')
    expect(rows.at(1).find('.peoples-roles-mailing-address').text()).toContain('1797 rue Levy')
    expect(rows.at(2).find('.peoples-roles-mailing-address').text()).toContain('917 Hardy Street')
    expect(rows.at(3).find('.peoples-roles-mailing-address').text()).toContain('1179 A Avenue')

    wrapper.destroy()
  })

  it('displays the correct delivery addresses in the list', () => {
    const wrapper = wrapperFactory({ peopleAndRoles: gpPeopleAndRoles })

    const rows = wrapper.findAll('.people-roles-content')
    expect(rows.at(0).find('.peoples-roles-delivery-address').text()).toBe('Same as Mailing Address')
    expect(rows.at(1).find('.peoples-roles-delivery-address').text()).toBe('')
    expect(rows.at(2).find('.peoples-roles-delivery-address').text()).toContain('4434 Cassells St')
    expect(rows.at(3).find('.peoples-roles-delivery-address').text()).toContain('433 Ferry Road')

    wrapper.destroy()
  })

  it('does not display the roles', () => {
    const wrapper = wrapperFactory({ peopleAndRoles: gpPeopleAndRoles })

    const item1 = wrapper.findAll('.people-roles-content').at(0)
    expect(item1.findAll('.col-roles').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays the correct actions menus', () => {
    const wrapper = wrapperFactory({ peopleAndRoles: gpPeopleAndRoles })

    // No action
    const item1 = wrapper.findAll('.people-roles-content').at(0)
    const button1 = item1.find('.actions .edit-action #officer-0-edit-btn')
    expect(button1.exists()).toBe(true)
    expect(button1.text()).toBe('Change')

    // NAME CHANGED
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
    const wrapper = wrapperFactory({
      peopleAndRoles: gpPeopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: emptyPerson,
      activeIndex: NaN,
      currentCompletingParty: undefined
    })

    // verify that add component is at the top (above the list)
    const section = wrapper.find('#people-roles-add')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Add Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Add Corporation component', () => {
    const wrapper = wrapperFactory({
      peopleAndRoles: gpPeopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: emptyOrg,
      activeIndex: NaN,
      currentCompletingParty: undefined
    })

    // verify that add component is at the top (above the list)
    const section = wrapper.find('#people-roles-add')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-org-header').text()).toBe('Add Business or Corporation')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Edit Person component', () => {
    const wrapper = wrapperFactory({
      peopleAndRoles: gpPeopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: peopleAndRoles[0],
      activeIndex: 0,
      currentCompletingParty: undefined
    })

    // verify that edit component is within the list (inline)
    const section = wrapper.find('#people-roles-list #people-roles-edit')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-person-header').text()).toBe('Edit Person')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })

  it('correctly displays Edit Corporation component', () => {
    const wrapper = wrapperFactory({
      peopleAndRoles: gpPeopleAndRoles,
      renderOrgPersonForm: true,
      currentOrgPerson: peopleAndRoles[1],
      activeIndex: 0,
      currentCompletingParty: undefined
    })

    // verify that edit component is within the list (inline)
    const section = wrapper.find('#people-roles-list #people-roles-edit')
    expect(section.exists()).toBe(true)
    expect(section.find('.add-org-header').text()).toBe('Edit Business or Corporation')
    expect(section.find('#org-person-form').exists()).toBe(true)

    wrapper.destroy()
  })
})
