import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'
import OrgPerson from '@/components/common/PeopleAndRoles/OrgPerson.vue'
import { getVuexStore } from '@/store/'
import { BenCorrectionResource } from '@/resources/Correction/BEN'
import { SpChangeResource } from '@/resources/Change/SP'
import { GpChangeResource } from '@/resources/Change/GP'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Events
const addEditEvent = 'addEdit'
const removeEvent = 'remove'
const resetEvent = 'reset'

// Input field selectors to test changes to the DOM elements.
const firstNameSelector = '#person__first-name'
const middleNameSelector = '#person__middle-name'
const lastNameSelector = '#person__last-name'
const orgNameSelector = '#organization-name'
const confirmNameChangeSelector = '#confirm-name-change-checkbox'
const directorChkBoxSelector = '#dir-checkbox'
const removeButtonSelector = '#btn-remove'
const doneButtonSelector = '#btn-done'
const cancelButtonSelector = '#btn-cancel'
const orgPersonFormSelector = '#org-person-form'

const validPersonData = {
  officer: {
    id: '0',
    firstName: 'Adam',
    lastName: 'Smith',
    middleName: 'D',
    organizationName: '',
    partyType: 'person',
    email: 'completing-party@example.com'
  },
  roles: [
    { roleType: 'Director', appointmentDate: '2020-03-30' }
  ],
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

const validIncorporator = {
  officer: {
    id: '1',
    firstName: 'Adam',
    lastName: 'Smith',
    middleName: 'D',
    organizationName: '',
    partyType: 'person'
  },
  roles: [
    { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
  ],
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

const validOrgData = {
  officer: {
    id: '2',
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: 'Test Org',
    partyType: 'organization'
  },
  roles: [
    { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: {
    streetAddress: '3942 Fake Street',
    streetAddressAdditional: '',
    addressCity: 'Victoria',
    addressRegion: 'BC',
    postalCode: 'V8Z 5C6',
    addressCountry: 'CA',
    deliveryInstructions: null
  }
}

const EmptyPerson = {
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
  actions: [],
  isLookupBusiness: null
}

const EmptyOrg = {
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
  actions: [],
  isLookupBusiness: null
}

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 * @param wrapper the wrapper for the component that is being tested
 * @param name the name of the event that is to be returned
 * @returns the value of the last named event for the wrapper
 */
function getLastEvent (wrapper: Wrapper<OrgPerson>, name: string): any {
  const eventsList = wrapper.emitted(name)
  if (eventsList) {
    const events = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

/**
 * Creates and mounts a component, so that it can be tested.
 * @returns a Wrapper<OrgPerson> object with the given parameters.
 */
function createComponent (
  currentOrgPerson: any,
  activeIndex = NaN
): Wrapper<OrgPerson> {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  document.body.setAttribute('data-app', 'true')

  return mount(OrgPerson, {
    localVue,
    propsData: { currentOrgPerson, activeIndex },
    store,
    vuetify
  })
}

describe('Org/Person component for a BEN Correction filing', () => {
  beforeAll(() => {
    store.state.stateModel.tombstone.filingType = 'correction'
    store.state.stateModel.tombstone.entityType = 'BEN'
    store.state.stateModel.tombstone.currentDate = '2020-03-30'
    store.state.resourceModel = BenCorrectionResource
  })

  it('Loads the component and sets data for person', async () => {
    const wrapper = createComponent(validPersonData, NaN)
    await Vue.nextTick()

    expect(wrapper.vm.$data.orgPerson).toStrictEqual(validPersonData)
    expect((wrapper.vm as any).isDirector).toBe(true)

    wrapper.destroy()
  })

  it('Loads the component and sets data for org', async () => {
    const wrapper = createComponent(validOrgData, NaN)
    await Vue.nextTick()

    expect(wrapper.vm.$data.orgPerson).toStrictEqual(validOrgData)
    expect((wrapper.vm as any).isDirector).toBe(false)

    wrapper.destroy()
  })

  // NB: edit functions the same as add for a person
  it('Displays edit form for person', async () => {
    const wrapper = createComponent(validPersonData, 0)
    await Vue.nextTick()

    // verify person's name
    expect((wrapper.find(firstNameSelector).element as HTMLInputElement).value)
      .toEqual(validPersonData['officer']['firstName'])
    expect((wrapper.find(middleNameSelector).element as HTMLInputElement).value)
      .toEqual(validPersonData['officer']['middleName'])
    expect((wrapper.find(lastNameSelector).element as HTMLInputElement).value)
      .toEqual(validPersonData['officer']['lastName'])

    // verify role checkbox
    expect(wrapper.find(directorChkBoxSelector).attributes('aria-checked')).toBe('true')

    // verify that role checkbox is disabled
    expect(wrapper.find(directorChkBoxSelector).attributes('disabled')).toBeDefined()

    // verify action buttons
    expect(wrapper.find(doneButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(cancelButtonSelector).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('Enables Remove button in edit mode', async () => {
    const wrapper = createComponent(validOrgData, 0)

    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('Disables Remove button in create mode', async () => {
    const wrapper = createComponent(validOrgData, NaN)

    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBeDefined()

    wrapper.destroy()
  })

  it('Emits "remove" event when clicking Remove button', async () => {
    const wrapper = createComponent(validOrgData, 0)

    await wrapper.find(removeButtonSelector).trigger('click')

    expect(getLastEvent(wrapper, removeEvent)).toBe(0)

    wrapper.destroy()
  })

  it('Does not emit "reset" event when clicking Done button and org has not changed', async () => {
    const wrapper = createComponent(validOrgData, 0)
    await Vue.nextTick()

    // verify that button is not disabled, then click it
    const button = wrapper.find(doneButtonSelector)
    expect(button.attributes('disabled')).toBeUndefined()
    await button.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted(resetEvent)).toBeUndefined()

    wrapper.destroy()
  })

  it('Emits "addEdit" event when clicking Done button and org has changed', async () => {
    const wrapper = createComponent(validOrgData, 0)
    await Vue.nextTick()

    // change org name
    const input = wrapper.find(orgNameSelector)
    await input.setValue('Different Test Org')
    await input.trigger('change')

    // verify that checkbox isn't checked and then check it
    const chkbox = wrapper.find(confirmNameChangeSelector)
    expect(chkbox.attributes('aria-checked')).toBe('false')
    await chkbox.trigger('click')

    // verify that button is not disabled, then click it
    const button = wrapper.find(doneButtonSelector)
    expect(button.attributes('disabled')).toBeUndefined()
    await button.trigger('click')
    await Vue.nextTick()

    expect(getLastEvent(wrapper, addEditEvent).officer.organizationName).toBe('Different Test Org')

    wrapper.destroy()
  })

  it('Emits "reset" event when clicking Cancel button', async () => {
    const wrapper = createComponent(validOrgData, 0)
    const vm: any = wrapper.vm

    vm.applyRules()
    await Vue.nextTick()

    await wrapper.find(cancelButtonSelector).trigger('click')

    const emitted = wrapper.emitted(resetEvent)
    expect(emitted.length).toBe(1)
    expect(emitted[0]).toStrictEqual([]) // empty event

    wrapper.destroy()
  })

  it('Does not display error message when user enters valid org name', async () => {
    const wrapper = createComponent(validOrgData, NaN)

    const input = wrapper.find(orgNameSelector)
    await input.setValue('Valid Org Name')
    await input.trigger('change')

    expect(wrapper.find(orgPersonFormSelector).text()).not.toContain('Invalid spaces')
    expect(wrapper.vm.$data.orgPersonFormValid).toBe(true)

    wrapper.destroy()
  })

  it('Displays error message when user enters invalid org name', async () => {
    const wrapper = createComponent(validOrgData, NaN)
    const vm: any = wrapper.vm

    vm.applyRules()
    await Vue.nextTick()

    const input = wrapper.find(orgNameSelector)
    await input.setValue(' Invalid Org Name ')
    await input.trigger('change')

    expect(wrapper.find(orgPersonFormSelector).text()).toContain('Invalid spaces')
    expect(wrapper.vm.$data.orgPersonFormValid).toBe(false)

    wrapper.destroy()
  })

  it('Does not display error message when user enters valid person names', async () => {
    const wrapper = createComponent(validPersonData, NaN)

    const input1 = wrapper.find(firstNameSelector)
    await input1.setValue('First')
    await input1.trigger('change')

    const input2 = wrapper.find(middleNameSelector)
    await input2.setValue('Middle')
    await input2.trigger('change')

    const input3 = wrapper.find(lastNameSelector)
    await input3.setValue('Last')
    await input3.trigger('change')

    expect(wrapper.findAll('.v-messages__message').length).toBe(0)
    expect(wrapper.vm.$data.orgPersonFormValid).toBe(true)

    wrapper.destroy()
  })

  it('Displays error message when user does not enter person names', async () => {
    const wrapper = createComponent(validPersonData, NaN)
    const vm: any = wrapper.vm

    vm.applyRules()
    await Vue.nextTick()

    const input1 = wrapper.find(firstNameSelector)
    await input1.setValue('')
    await input1.trigger('change')

    const input2 = wrapper.find(middleNameSelector)
    await input2.setValue('')
    await input2.trigger('change')

    const input3 = wrapper.find(lastNameSelector)
    await input3.setValue('')
    await input3.trigger('change')

    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(2)
    expect(messages.at(0).text()).toBe('A first name is required')
    expect(messages.at(1).text()).toBe('A last name is required')
    expect(wrapper.vm.$data.orgPersonFormValid).toBe(false)

    wrapper.destroy()
  })

  it('Displays error message when user enters person names that are too long', async () => {
    const wrapper = createComponent(validPersonData, NaN)
    const vm: any = wrapper.vm

    vm.applyRules()
    await Vue.nextTick()

    const input1 = wrapper.find(firstNameSelector)
    await input1.setValue('1234567890123456789012345678901')
    await input1.trigger('change')

    const input2 = wrapper.find(middleNameSelector)
    await input2.setValue('1234567890123456789012345678901')
    await input2.trigger('change')

    const input3 = wrapper.find(lastNameSelector)
    await input3.setValue('1234567890123456789012345678901')
    await input3.trigger('change')

    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(3)
    expect(messages.at(0).text()).toBe('Cannot exceed 30 characters')
    expect(messages.at(1).text()).toBe('Cannot exceed 30 characters')
    expect(messages.at(2).text()).toBe('Cannot exceed 30 characters')
    expect(wrapper.vm.$data.orgPersonFormValid).toBe(false)

    wrapper.destroy()
  })

  it('Displays errors and does not submit form when clicking Done button and form is invalid', async () => {
    const wrapper = createComponent(EmptyPerson, NaN)
    const vm: any = wrapper.vm

    vm.applyRules()
    await Vue.nextTick()

    // verify that Done button is enabled, even for an empty person
    // then click it
    const button = wrapper.find(doneButtonSelector)
    expect(button.attributes('disabled')).toBeUndefined()
    await button.trigger('click')

    // get a list of validation messages
    const wrappers = wrapper.findAll('.v-messages__message')
    const messages: Array<string> = []
    for (let i = 0; i < wrappers.length; i++) {
      messages.push(wrappers.at(i).text())
    }

    // verify some error messages
    expect(messages.includes('A first name is required'))
    expect(messages.includes('A last name is required'))
    expect(messages.includes('A role is required'))
    expect(messages.includes('This field is required'))

    // verify that no events were emitted
    expect(wrapper.emitted(addEditEvent)).toBeUndefined()
    expect(wrapper.emitted(resetEvent)).toBeUndefined()

    wrapper.destroy()
  })
})

const NewPersonPartner = {
  ...EmptyPerson,
  roles: [{ roleType: 'Partner', appointmentDate: '2020-03-30' }]
}

const NewOrgPartner = {
  ...EmptyOrg,
  roles: [{ roleType: 'Partner', appointmentDate: '2020-03-30' }]
}

const NewPersonProprietor = {
  ...EmptyPerson,
  roles: [{ roleType: 'Proprietor', appointmentDate: '2020-03-30' }]
}

const NewOrgProprietor = {
  ...EmptyOrg,
  roles: [{ roleType: 'Proprietor', appointmentDate: '2020-03-30' }]
}

const ExistingProprietorPersonData = {
  officer: {
    id: '2',
    firstName: 'First',
    lastName: 'Last',
    middleName: 'M',
    organizationName: null,
    partyType: 'person',
    email: 'proprietor@example.com'
  },
  roles: [
    { roleType: 'Proprietor', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: null
}

const ExistingProprietorOrgData = {
  officer: {
    id: '2',
    firstName: null,
    lastName: null,
    middleName: null,
    organizationName: 'Test Org',
    partyType: 'organization',
    email: 'proprietor@example.com'
  },
  roles: [
    { roleType: 'Proprietor', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: null
}

const ExistingPartnerPersonData = {
  officer: {
    id: '2',
    firstName: 'First',
    lastName: 'Last',
    middleName: 'M',
    organizationName: null,
    partyType: 'person',
    identifier: null,
    email: 'partner@example.com'
  },
  roles: [
    { roleType: 'Partner', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: null
}

const ExistingPartnerOrgData = {
  officer: {
    id: '2',
    firstName: null,
    lastName: null,
    middleName: null,
    organizationName: 'Test Org',
    partyType: 'organization',
    identifier: 'FM1234567',
    email: 'partner@example.com'
  },
  roles: [
    { roleType: 'Partner', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: null
}

describe('Org/Person component for SP/GP filings', () => {
  beforeAll(() => {
    store.state.stateModel.tombstone.currentDate = '2020-03-30'
  })

  const tests = [
    {
      filingType: 'changeOfRegistration',
      name: 'adds new GP partner-person',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: NewPersonPartner,
      activeIndex: NaN,
      addPersonHeader: 'Add Person',
      addOrgHeader: false,
      personName: 'Person\'s Name',
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'changeOfRegistration',
      name: 'adds new GP partner-organization',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: NewOrgPartner,
      activeIndex: NaN,
      addPersonHeader: false,
      addOrgHeader: 'Add Business or Corporation',
      personName: false,
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: 'Business or Corporation Unregistered in B.C.',
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'changeOfRegistration',
      name: 'changes existing SP proprietor-person',
      entityType: 'SP',
      resourceModel: SpChangeResource,
      currentOrgPerson: ExistingProprietorPersonData,
      activeIndex: 0,
      addPersonHeader: 'Edit Person',
      addOrgHeader: false,
      personName: 'Person\'s Name',
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: false
    },
    {
      filingType: 'changeOfRegistration',
      name: 'changes existing SP proprietor-organization',
      entityType: 'SP',
      resourceModel: SpChangeResource,
      currentOrgPerson: ExistingProprietorOrgData,
      activeIndex: 0,
      addPersonHeader: false,
      addOrgHeader: 'Edit Business or Corporation',
      personName: false,
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: 'Business or Corporation Name',
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: false
    },
    {
      filingType: 'changeOfRegistration',
      name: 'changes existing GP partner-person',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: ExistingPartnerPersonData,
      activeIndex: 0,
      addPersonHeader: 'Edit Person',
      addOrgHeader: false,
      personName: 'Person\'s Name',
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'changeOfRegistration',
      name: 'changes existing GP partner - organization',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: ExistingPartnerOrgData,
      activeIndex: 0,
      addPersonHeader: false,
      addOrgHeader: 'Edit Business or Corporation',
      personName: false,
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: 'Business or Corporation Name',
      incorporationNumber: 'Incorporation/Registration Number:',
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'adds new SP proprietor-person',
      entityType: 'SP',
      resourceModel: SpChangeResource,
      currentOrgPerson: NewPersonProprietor,
      activeIndex: NaN,
      addPersonHeader: 'Add Person',
      addOrgHeader: false,
      personName: 'Person\'s Name',
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'adds new SP proprietor-organization',
      entityType: 'SP',
      resourceModel: SpChangeResource,
      currentOrgPerson: NewOrgProprietor,
      activeIndex: NaN,
      addPersonHeader: false,
      addOrgHeader: 'Add Business or Corporation',
      personName: false,
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: 'Business or Corporation Unregistered in B.C.',
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'adds new GP partner-person',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: NewPersonProprietor,
      activeIndex: NaN,
      addPersonHeader: 'Add Person',
      addOrgHeader: false,
      personName: 'Person\'s Name',
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'adds new GP partner-organization',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: NewOrgProprietor,
      activeIndex: NaN,
      addPersonHeader: false,
      addOrgHeader: 'Add Business or Corporation',
      personName: false,
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: 'Business or Corporation Unregistered in B.C.',
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'changes existing SP proprietor - person',
      entityType: 'SP',
      resourceModel: SpChangeResource,
      currentOrgPerson: ExistingProprietorPersonData,
      activeIndex: 0,
      addPersonHeader: 'Edit Person',
      addOrgHeader: false,
      personName: 'Person\'s Name',
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'changes existing SP proprietor-organization',
      entityType: 'SP',
      resourceModel: SpChangeResource,
      currentOrgPerson: ExistingProprietorOrgData,
      activeIndex: 0,
      addPersonHeader: false,
      addOrgHeader: 'Edit Business or Corporation',
      personName: false,
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: 'Business or Corporation Name',
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'changes existing GP partner-person',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: ExistingPartnerPersonData,
      activeIndex: 0,
      addPersonHeader: 'Edit Person',
      addOrgHeader: false,
      personName: 'Person\'s Name',
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: false,
      incorporationNumber: false,
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    },
    {
      filingType: 'conversion',
      name: 'changes existing GP partner-organization',
      entityType: 'GP',
      resourceModel: GpChangeResource,
      currentOrgPerson: ExistingPartnerOrgData,
      activeIndex: 0,
      addPersonHeader: false,
      addOrgHeader: 'Edit Business or Corporation',
      personName: false,
      confirmNameChange: false,
      orgLookUp: false,
      orgManualEntry: false,
      otherEditOrg: 'Business or Corporation Name',
      incorporationNumber: 'Incorporation/Registration Number:',
      emailAddress: 'Email Address',
      roles: false,
      mailingAddress: 'Mailing Address',
      deliveryAddressLabel: 'Delivery Address same as Mailing Address',
      deliveryAddressSubHeader: 'Delivery Address',
      removeButton: true
    }
  ]

  tests.forEach((test, index) => {
    it(`${index + 1}. ${test.filingType} - ${test.name}`, () => {
      store.state.stateModel.tombstone.filingType = test.filingType
      store.state.stateModel.tombstone.entityType = test.entityType
      store.state.resourceModel = test.resourceModel

      const wrapper = createComponent(test.currentOrgPerson, test.activeIndex)

      if (test.addPersonHeader) {
        expect(wrapper.find('.add-person-header').text()).toBe(test.addPersonHeader)
      } else {
        expect(wrapper.find('.add-person-header').exists()).toBe(false)
      }

      if (test.addOrgHeader) {
        expect(wrapper.find('.add-org-header').text()).toBe(test.addOrgHeader)
      } else {
        expect(wrapper.find('.add-org-header').exists()).toBe(false)
      }

      if (test.personName) {
        expect(wrapper.find('.person-name .sub-header').text()).toBe(test.personName)
      } else {
        expect(wrapper.find('.person-name').exists()).toBe(false)
      }

      if (!test.confirmNameChange) {
        expect(wrapper.find('.confirm-name-change').exists()).toBe(false)
      }

      if (!test.orgLookUp) {
        expect(wrapper.find('.org-look-up').exists()).toBe(false)
      }

      if (test.orgManualEntry) {
        expect(wrapper.find('.org-manual-entry .sub-header').text()).toBe(test.orgManualEntry)
      } else {
        expect(wrapper.find('.org-manual-entry').exists()).toBe(false)
      }

      if (!test.otherEditOrg) {
        expect(wrapper.find('.other-edit-org').exists()).toBe(false)
      }

      if (!test.incorporationNumber) {
        expect(wrapper.find('.incorporation-number').exists()).toBe(false)
      }

      if (test.emailAddress) {
        expect(wrapper.find('.email-address .sub-header').text()).toBe(test.emailAddress)
      } else {
        expect(wrapper.find('.email-address').exists()).toBe(false)
      }

      if (!test.roles) {
        expect(wrapper.find('.roles').exists()).toBe(false)
      }

      if (test.mailingAddress) {
        expect(wrapper.find('.mailing-address .sub-header').text()).toBe(test.mailingAddress)
      } else {
        expect(wrapper.find('.mailing-address').exists()).toBe(false)
      }

      if (test.deliveryAddressLabel) {
        expect(wrapper.find('.delivery-address label').text()).toBe(test.deliveryAddressLabel)
      } else {
        expect(wrapper.find('.delivery-address').exists()).toBe(false)
      }

      if (test.deliveryAddressSubHeader) {
        expect(wrapper.find('.delivery-address .sub-header').text()).toBe(test.deliveryAddressSubHeader)
      } else {
        expect(wrapper.find('.delivery-address .sub-header').exists()).toBe(false)
      }

      expect(wrapper.find(removeButtonSelector).exists()).toBe(test.removeButton)

      wrapper.destroy()
    })
  })
})

describe('Org/Person component for SP change of registration filing', () => {
  beforeEach(() => {
    store.state.stateModel.tombstone.currentDate = '2020-03-30'
    store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.resourceModel = SpChangeResource
  })

  it('displays Confirm Documents checkbox for a replaced-added org-person', () => {
    store.state.stateModel.tombstone.filingType = 'changeOfRegistration'
    store.state.stateModel.tombstone.entityType = 'SP'
    store.state.resourceModel = SpChangeResource

    const currentOrgPerson = {
      ...NewOrgProprietor,
      actions: ['REPLACED', 'ADDED']
    }

    const wrapper = createComponent(currentOrgPerson, NaN)

    expect(wrapper.find('.confirm-documents-checkbox').exists()).toBe(true)
  })

  it('does not display Confirm Documents checkbox for an added org-person', () => {
    const currentOrgPerson = {
      ...NewOrgProprietor,
      action: ['ADDED']
    }

    const wrapper = createComponent(currentOrgPerson, NaN)

    expect(wrapper.find('.confirm-documents-checkbox').exists()).toBe(false)
  })
})
