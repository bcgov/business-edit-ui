import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import { OfficeAddresses } from '@/components/YourCompany'
import { AddressIF, IncorporationAddressIf } from '@/interfaces'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

/**
 * Returns a customized Address object (except for country
 * and region, so we get meaningful display strings).
 * @param x the number to append to each property
 */
function getAddressX (x: number): AddressIF {
  return {
    addressCity: `addressCity${x}`,
    addressCountry: 'CA',
    addressRegion: 'BC',
    deliveryInstructions: `deliveryInstructions${x}`,
    postalCode: `postalCode${x}`,
    streetAddress: `streetAddress${x}`,
    streetAddressAdditional: `streetAddressAdditional${x}`
  } as AddressIF
}

/**
 * Returns a customized Incorporation Address object.
 * @param a1 the number to customize the 1st address (registered-mailing)
 * @param a2 the number to customize the 2nd address (registered-delivery)
 * @param a3 the number to customize the 3rd address (records-mailing)
 * @param a4 the number to customize the 4th address (records-delivery)
 */
function getIncorporationAddress (a1: number, a2: number, a3: number, a4: number): IncorporationAddressIf {
  return {
    registeredOffice: {
      mailingAddress: getAddressX(a1),
      deliveryAddress: getAddressX(a2)
    },
    recordsOffice: {
      mailingAddress: getAddressX(a3),
      deliveryAddress: getAddressX(a4)
    }
  }
}

describe('summary mode', () => {
  beforeAll(() => {
    // init entity type
    store.state.stateModel.tombstone.entityType = 'BEN'
  })

  it('displays the correct sections', () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    expect(wrapper.find('#summary-registered-address').exists()).toBe(true)
    expect(wrapper.find('#summary-records-address').exists()).toBe(true)
    expect(wrapper.find('#edit-registered-address').exists()).toBe(false)
    expect(wrapper.find('#edit-records-address').exists()).toBe(false)
    expect(wrapper.find('.action-btns').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays the registered office row - not same as mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    const cols = wrapper.findAll('#summary-registered-address .flex')

    // verify header
    {
      const label = cols.at(0).find('label')
      expect(label.text()).toBe('Registered Office')
    }

    // verify mailing address
    {
      const mailingAddress = cols.at(1)
      expect(mailingAddress.find('label > span').text()).toBe('Mailing Address')
      expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress1')
      expect(rows.at(1).text()).toBe('streetAddressAdditional1')
      expect(rows.at(2).text()).toContain('addressCity1')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode1')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions1')
    }

    // verify delivery address
    {
      const deliveryAddress = cols.at(2)
      expect(deliveryAddress.find('label > span').text()).toBe('Delivery Address')
      expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)

      const rows = deliveryAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress2')
      expect(rows.at(1).text()).toBe('streetAddressAdditional2')
      expect(rows.at(2).text()).toContain('addressCity2')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode2')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions2')
    }

    // verify actions
    {
      const actions = cols.at(3)
      const correctBtn = actions.find('.actions #btn-correct-office-addresses')
      expect(correctBtn.find('span').text()).toBe('Correct')
    }

    wrapper.destroy()
  })

  it('displays the registered office row - same as mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 1, 1, 1)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    const cols = wrapper.findAll('#summary-registered-address .flex')

    // verify header
    {
      const label = cols.at(0).find('label')
      expect(label.text()).toBe('Registered Office')
    }

    // verify mailing address
    {
      const mailingAddress = cols.at(1)
      expect(mailingAddress.find('label > span').text()).toBe('Mailing Address')
      expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress1')
      expect(rows.at(1).text()).toBe('streetAddressAdditional1')
      expect(rows.at(2).text()).toContain('addressCity1')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode1')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions1')
    }

    // verify delivery address
    {
      const deliveryAddress = cols.at(2)
      expect(deliveryAddress.find('label > span').text()).toBe('Delivery Address')
      expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)
      expect(deliveryAddress.find('label + div').text()).toBe('Same as Mailing Address')
    }

    // verify actions
    {
      const actions = cols.at(3)
      const correctBtn = actions.find('.actions #btn-correct-office-addresses')
      expect(correctBtn.find('span').text()).toBe('Correct')
    }

    wrapper.destroy()
  })

  it('displays the registered office row - changed addresses', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(4, 3, 2, 1))
    await Vue.nextTick()

    const cols = wrapper.findAll('#summary-registered-address .flex')

    // verify header
    {
      const label = cols.at(0).find('label')
      expect(label.text()).toBe('Registered Office')
    }

    // verify mailing address
    {
      const mailingAddress = cols.at(1)
      expect(mailingAddress.find('label > span').text()).toBe('Mailing Address')
      expect(mailingAddress.find('label > .v-chip span').text()).toBe('CORRECTED')

      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress4')
      expect(rows.at(1).text()).toBe('streetAddressAdditional4')
      expect(rows.at(2).text()).toContain('addressCity4')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode4')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions4')
    }

    // verify delivery address
    {
      const deliveryAddress = cols.at(2)
      expect(deliveryAddress.find('label > span').text()).toBe('Delivery Address')
      expect(deliveryAddress.find('label > .v-chip span').text()).toBe('CORRECTED')

      const rows = deliveryAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress3')
      expect(rows.at(1).text()).toBe('streetAddressAdditional3')
      expect(rows.at(2).text()).toContain('addressCity3')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode3')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions3')
    }

    // verify actions
    {
      const actions = cols.at(3)

      const undoBtn = actions.find('.actions .edit-action #btn-undo-office-addresses')
      expect(undoBtn.find('span').text()).toBe('Undo')

      const moreBtn = actions.find('.actions .more-actions #btn-more-actions span')
      expect(moreBtn.find('span').exists()).toBe(true)
      moreBtn.trigger('click')
      await Vue.nextTick()
      const correctBtn = actions.find('.actions .more-actions #btn-more-actions-edit')
      expect(correctBtn.find('span').text()).toBe('Correct')
    }

    wrapper.destroy()
  })

  it('displays the records office row - not same as registered office', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    const cols = wrapper.findAll('#summary-records-address .flex')

    // verify header
    {
      const label = cols.at(0).find('label')
      expect(label.text()).toBe('Records Office')
    }

    // verify mailing address
    {
      const mailingAddress = cols.at(1)
      expect(mailingAddress.find('label > span').text()).toBe('Mailing Address')
      expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress3')
      expect(rows.at(1).text()).toBe('streetAddressAdditional3')
      expect(rows.at(2).text()).toContain('addressCity3')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode3')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions3')
    }

    // verify delivery address
    {
      const deliveryAddress = cols.at(2)
      expect(deliveryAddress.find('label > span').text()).toBe('Delivery Address')
      expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)

      const rows = deliveryAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress4')
      expect(rows.at(1).text()).toBe('streetAddressAdditional4')
      expect(rows.at(2).text()).toContain('addressCity4')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode4')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions4')
    }

    wrapper.destroy()
  })

  it('displays the records office row - same as registered office', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 1, 1, 1)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    const cols = wrapper.findAll('#summary-records-address .flex')

    // verify header
    {
      const label = cols.at(0).find('label')
      expect(label.text()).toBe('Records Office')
    }

    // verify mailing address
    {
      const mailingAddress = cols.at(1)
      expect(mailingAddress.find('label > span').text()).toBe('Mailing Address')
      expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)
      expect(mailingAddress.find('label + div').text()).toBe('Same as Registered Office')
    }

    // verify delivery address
    {
      const deliveryAddress = cols.at(2)
      expect(deliveryAddress.find('label > span').text()).toBe('Delivery Address')
      expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)
      expect(deliveryAddress.find('label + div').text()).toBe('Same as Registered Office')
    }

    wrapper.destroy()
  })

  it('displays the records office row - same as mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 1, 3, 3)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 1, 3, 3))
    await Vue.nextTick()

    const cols = wrapper.findAll('#summary-records-address .flex')

    // verify header
    {
      const label = cols.at(0).find('label')
      expect(label.text()).toBe('Records Office')
    }

    // verify mailing address
    {
      const mailingAddress = cols.at(1)
      expect(mailingAddress.find('label > span').text()).toBe('Mailing Address')
      expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress3')
      expect(rows.at(1).text()).toBe('streetAddressAdditional3')
      expect(rows.at(2).text()).toContain('addressCity3')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode3')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions3')
    }

    // verify delivery address
    {
      const deliveryAddress = cols.at(2)
      expect(deliveryAddress.find('label > span').text()).toBe('Delivery Address')
      expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)
      expect(deliveryAddress.find('label + div').text()).toBe('Same as Mailing Address')
    }

    wrapper.destroy()
  })

  it('displays the records office row - changed addresses', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(4, 3, 2, 1))
    await Vue.nextTick()

    const cols = wrapper.findAll('#summary-records-address .flex')

    // verify header
    {
      const label = cols.at(0).find('label')
      expect(label.text()).toBe('Records Office')
    }

    // verify mailing address
    {
      const mailingAddress = cols.at(1)
      expect(mailingAddress.find('label > span').text()).toBe('Mailing Address')
      expect(mailingAddress.find('label > .v-chip span').text()).toBe('CORRECTED')

      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress2')
      expect(rows.at(1).text()).toBe('streetAddressAdditional2')
      expect(rows.at(2).text()).toContain('addressCity2')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode2')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions2')
    }

    // verify delivery address
    {
      const deliveryAddress = cols.at(2)
      expect(deliveryAddress.find('label > span').text()).toBe('Delivery Address')
      expect(deliveryAddress.find('label > .v-chip span').text()).toBe('CORRECTED')

      const rows = deliveryAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress1')
      expect(rows.at(1).text()).toBe('streetAddressAdditional1')
      expect(rows.at(2).text()).toContain('addressCity1')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode1')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions1')
    }

    wrapper.destroy()
  })
})

describe('edit mode', () => {
  beforeAll(() => {
    // init entity type
    store.state.stateModel.tombstone.entityType = 'BEN'
  })

  it('displays the correct sections', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    expect(wrapper.find('#summary-registered-address').exists()).toBe(false)
    expect(wrapper.find('#summary-records-address').exists()).toBe(false)
    expect(wrapper.find('#edit-registered-address').exists()).toBe(true)
    expect(wrapper.find('#edit-records-address').exists()).toBe(true)
    expect(wrapper.find('.action-btns').exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays the registered office mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    const editRegisteredAddress = wrapper.find('#edit-registered-address')

    // verify header
    {
      const header = editRegisteredAddress.find('.address-edit-header .address-edit-title')
      expect(header.text()).toBe('Registered Office')
    }

    // verify mailing address
    {
      const block = editRegisteredAddress.findAll('li').at(0)
      expect(block.find('label').text()).toBe('Mailing Address')

      const address = block.find('#address-registered-mailing')
      expect(address.find('.v-input.street-address').props('value')).toBe('streetAddress1')
      expect(address.find('.v-input.street-address-additional').props('value')).toBe('streetAddressAdditional1')
      expect(address.find('.v-input.address-city').props('value')).toBe('addressCity1')
      expect(address.find('.v-input.address-region').props('value')).toBe('BC')
      expect(address.find('.v-input.postal-code').props('value')).toBe('postalCode1')
      expect(address.find('.v-input.address-country').props('value')).toBe('CA')
      expect(address.find('.v-input.delivery-instructions').props('value')).toBe('deliveryInstructions1')
    }

    wrapper.destroy()
  })

  it('displays the registered office delivery address - not same as mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    const editRegisteredAddress = wrapper.find('#edit-registered-address')

    // verify header
    {
      const header = editRegisteredAddress.find('.address-edit-header .address-edit-title')
      expect(header.text()).toBe('Registered Office')
    }

    // verify delivery address
    {
      const block = editRegisteredAddress.findAll('li').at(1)
      expect(block.find('label').text()).toBe('Delivery Address')
      expect(block.find('.inherit-checkbox').props('inputValue')).toBe(false)

      const address = block.find('#address-registered-delivery')
      expect(address.find('.v-input.street-address').props('value')).toBe('streetAddress2')
      expect(address.find('.v-input.street-address-additional').props('value')).toBe('streetAddressAdditional2')
      expect(address.find('.v-input.address-city').props('value')).toBe('addressCity2')
      expect(address.find('.v-input.address-region').props('value')).toBe('BC')
      expect(address.find('.v-input.postal-code').props('value')).toBe('postalCode2')
      expect(address.find('.v-input.address-country').props('value')).toBe('CA')
      expect(address.find('.v-input.delivery-instructions').props('value')).toBe('deliveryInstructions2')
    }

    wrapper.destroy()
  })

  it('displays the registered office delivery address - same as mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 1, 3, 3)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 1, 3, 3))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    const editRegisteredAddress = wrapper.find('#edit-registered-address')

    // verify header
    {
      const header = editRegisteredAddress.find('.address-edit-header .address-edit-title')
      expect(header.text()).toBe('Registered Office')
    }

    // verify delivery address
    {
      const block = editRegisteredAddress.findAll('li').at(1)
      expect(block.find('label').text()).toBe('Delivery Address')
      expect(block.find('.inherit-checkbox').props('inputValue')).toBe(true)
      expect(block.find('#address-registered-delivery').exists()).toBe(false)
    }

    wrapper.destroy()
  })

  it('displays the records office mailing - not same as registered office', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    const editRecordsAddress = wrapper.find('#edit-records-address')
    expect(editRecordsAddress.find('.records-inherit-checkbox').props('inputValue')).toBe(false)

    // verify header
    {
      const header = editRecordsAddress.find('.address-edit-header .address-edit-title')
      expect(header.text()).toBe('Records Office')
    }

    // verify mailing address
    {
      const block = editRecordsAddress.findAll('li').at(0)
      expect(block.find('label').text()).toBe('Mailing Address')

      const address = block.find('#address-records-mailing')
      expect(address.find('.v-input.street-address').props('value')).toBe('streetAddress3')
      expect(address.find('.v-input.street-address-additional').props('value')).toBe('streetAddressAdditional3')
      expect(address.find('.v-input.address-city').props('value')).toBe('addressCity3')
      expect(address.find('.v-input.address-region').props('value')).toBe('BC')
      expect(address.find('.v-input.postal-code').props('value')).toBe('postalCode3')
      expect(address.find('.v-input.address-country').props('value')).toBe('CA')
      expect(address.find('.v-input.delivery-instructions').props('value')).toBe('deliveryInstructions3')
    }

    wrapper.destroy()
  })

  it('displays the records office mailing address - same as registered office', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 1, 1, 1)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    const editRecordsAddress = wrapper.find('#edit-records-address')
    expect(editRecordsAddress.find('.records-inherit-checkbox').props('inputValue')).toBe(true)

    // verify header
    {
      const header = editRecordsAddress.find('.address-edit-header .address-edit-title')
      expect(header.text()).toBe('Records Office')
    }

    // verify mailing address
    {
      const blocks = editRecordsAddress.findAll('li')
      expect(blocks.length).toBe(0)
    }

    wrapper.destroy()
  })

  it('displays the records office delivery address - not same same as mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    const editRecordsAddress = wrapper.find('#edit-records-address')

    // verify header
    {
      const header = editRecordsAddress.find('.address-edit-header .address-edit-title')
      expect(header.text()).toBe('Records Office')
    }

    // verify delivery address
    {
      const block = editRecordsAddress.findAll('li').at(1)
      expect(block.find('label').text()).toBe('Delivery Address')
      expect(block.find('.inherit-checkbox').props('inputValue')).toBe(false)

      const address = block.find('#address-records-delivery')
      expect(address.find('.v-input.street-address').props('value')).toBe('streetAddress4')
      expect(address.find('.v-input.street-address-additional').props('value')).toBe('streetAddressAdditional4')
      expect(address.find('.v-input.address-city').props('value')).toBe('addressCity4')
      expect(address.find('.v-input.address-region').props('value')).toBe('BC')
      expect(address.find('.v-input.postal-code').props('value')).toBe('postalCode4')
      expect(address.find('.v-input.address-country').props('value')).toBe('CA')
      expect(address.find('.v-input.delivery-instructions').props('value')).toBe('deliveryInstructions4')
    }

    wrapper.destroy()
  })

  it('displays the records office delivery address - same as mailing address', async () => {
    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 1, 3, 3)

    store.state.stateModel.tombstone.filingType = 'correction'
    const wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 1, 3, 3))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()

    const editRecordsAddress = wrapper.find('#edit-records-address')

    // verify header
    {
      const header = editRecordsAddress.find('.address-edit-header .address-edit-title')
      expect(header.text()).toBe('Records Office')
    }

    // verify delivery address
    {
      const block = editRecordsAddress.findAll('li').at(1)
      expect(block.find('label').text()).toBe('Delivery Address')
      expect(block.find('.inherit-checkbox').props('inputValue')).toBe(true)
      expect(block.find('#address-records-delivery').exists()).toBe(false)
    }

    wrapper.destroy()
  })
})

describe('"same as" checkboxes', () => {
  let wrapper: any = null

  beforeAll(() => {
    // init entity type
    store.state.stateModel.tombstone.entityType = 'BEN'

    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 1, 1, 1)
  })

  beforeEach(async () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('#btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('toggles registered delivery address same as registered mailing address', async () => {
    // verify initial mailing and delivery address data
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity1')
    expect(wrapper.vm.$data.deliveryAddress.addressCity).toBe('addressCity1')

    // verify that checkbox is checked and that address doesn't exist
    const checkbox = wrapper.find('#registered-mailing-same-chkbx')
    expect(checkbox.attributes('aria-checked')).toBe('true')
    let address = wrapper.find('#address-registered-delivery')
    expect(address.exists()).toBe(false)

    // uncheck and verify the checkbox
    checkbox.trigger('click')
    await Vue.nextTick()
    expect(checkbox.attributes('aria-checked')).toBe('false')

    // verify the address data and elements
    expect(wrapper.vm.$data.deliveryAddress.addressCity).toBe('')
    // NB: since the address didn't exist previously, we need to find it again
    address = wrapper.find('#address-registered-delivery')
    expect(address.exists()).toBe(true)
    expect(address.find('.v-input.street-address').props('value')).toBe('')
    expect(address.find('.v-input.street-address-additional').props('value')).toBe('')
    expect(address.find('.v-input.address-city').props('value')).toBe('')
    expect(address.find('.v-input.address-region').props('value')).toBe('BC')
    expect(address.find('.v-input.postal-code').props('value')).toBe('')
    expect(address.find('.v-input.address-country').props('value')).toBe('CA')
    expect(address.find('.v-input.delivery-instructions').props('value')).toBe('')

    // re-check and verify the checkbox
    checkbox.trigger('click')
    await Vue.nextTick()
    expect(checkbox.attributes('aria-checked')).toBe('true')

    // verify the address data and elements
    expect(wrapper.vm.$data.deliveryAddress.addressCity).toBe('addressCity1')
    // NB: since the address existed previously, we need to find it again
    address = wrapper.find('#address-registered-delivery')
    expect(address.exists()).toBe(false)
  })

  it('toggles records mailing address same as registered mailing address', async () => {
    // verify initial registered mailing and records mailing address data
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity1')
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('addressCity1')

    // verify that checkbox is checked and that address doesn't exist
    const checkbox = wrapper.find('#records-mailing-same-chkbx')
    expect(checkbox.attributes('aria-checked')).toBe('true')
    let address = wrapper.find('#address-records-mailing')
    expect(address.exists()).toBe(false)

    // uncheck and verify the checkbox
    checkbox.trigger('click')
    await Vue.nextTick()
    expect(checkbox.attributes('aria-checked')).toBe('false')

    // verify the address data and elements
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('')
    // NB: since the address didn't exist previously, we need to find it again
    address = wrapper.find('#address-records-mailing')
    expect(address.exists()).toBe(true)
    expect(address.find('.v-input.street-address').props('value')).toBe('')
    expect(address.find('.v-input.street-address-additional').props('value')).toBe('')
    expect(address.find('.v-input.address-city').props('value')).toBe('')
    expect(address.find('.v-input.address-region').props('value')).toBe('BC')
    expect(address.find('.v-input.postal-code').props('value')).toBe('')
    expect(address.find('.v-input.address-country').props('value')).toBe('CA')
    expect(address.find('.v-input.delivery-instructions').props('value')).toBe('')

    // re-check and verify the checkbox
    checkbox.trigger('click')
    await Vue.nextTick()
    expect(checkbox.attributes('aria-checked')).toBe('true')

    // verify the address data and elements
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('addressCity1')
    // NB: since the address existed previously, we need to find it again
    address = wrapper.find('#address-records-mailing')
    expect(address.exists()).toBe(false)
  })

  it('toggles records delivery address same as records mailing address', async () => {
    // verify initial registered mailing and records mailing address data
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('addressCity1')
    expect(wrapper.vm.$data.recDeliveryAddress.addressCity).toBe('addressCity1')

    // verify that checkbox is checked and that records addresses don't exist
    expect(wrapper.find('#records-mailing-same-chkbx').attributes('aria-checked')).toBe('true')
    expect(wrapper.find('#address-records-mailing').exists()).toBe(false)
    expect(wrapper.find('#address-records-delivery').exists()).toBe(false)

    // first make records office not the same as registered office
    const recordsCheckbox = wrapper.find('#records-mailing-same-chkbx')
    recordsCheckbox.trigger('click')
    await Vue.nextTick()

    // the above assigned a default address to records mailing address so set a new one
    wrapper.vm.$data.recMailingAddress = getAddressX(3)

    // verify that checkbox is checked and that address doesn't exist
    const checkbox = wrapper.find('#records-delivery-same-chkbx')
    expect(checkbox.attributes('aria-checked')).toBe('true')
    let address = wrapper.find('#address-records-delivery')
    expect(address.exists()).toBe(false)

    // uncheck and verify the checkbox
    checkbox.trigger('click')
    await Vue.nextTick()
    expect(checkbox.attributes('aria-checked')).toBe('false')

    // verify the address data and elements
    expect(wrapper.vm.$data.recDeliveryAddress.addressCity).toBe('')
    // NB: since the address didn't exist previously, we need to find it again
    address = wrapper.find('#address-records-delivery')
    expect(address.exists()).toBe(true)
    expect(address.find('.v-input.street-address').props('value')).toBe('')
    expect(address.find('.v-input.street-address-additional').props('value')).toBe('')
    expect(address.find('.v-input.address-city').props('value')).toBe('')
    expect(address.find('.v-input.address-region').props('value')).toBe('BC')
    expect(address.find('.v-input.postal-code').props('value')).toBe('')
    expect(address.find('.v-input.address-country').props('value')).toBe('CA')
    expect(address.find('.v-input.delivery-instructions').props('value')).toBe('')

    // re-check and verify the checkbox
    checkbox.trigger('click')
    await Vue.nextTick()
    expect(checkbox.attributes('aria-checked')).toBe('true')

    // verify the address data and elements
    expect(wrapper.vm.$data.recDeliveryAddress.addressCity).toBe('addressCity3')
    // NB: since the address existed previously, we need to find it again
    address = wrapper.find('#address-records-delivery')
    expect(address.exists()).toBe(false)
  })
})

describe('actions and events', () => {
  let wrapper: any = null

  beforeAll(() => {
    // init entity type
    store.state.stateModel.tombstone.entityType = 'BEN'

    // init original offices
    store.state.stateModel.originalIA.incorporationApplication.offices = getIncorporationAddress(1, 2, 3, 4)
  })

  beforeEach(async () => {
    store.state.stateModel.tombstone.filingType = 'correction'
    wrapper = mount(OfficeAddresses, { store, vuetify })

    // set office addresses to trigger watcher
    wrapper.vm.$store.commit('mutateOfficeAddresses', getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('#btn-correct-office-addresses')
    correctBtn.trigger('click')
    await Vue.nextTick()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('starts valid initially', () => {
    // verify initial buttons
    expect(wrapper.find('#done-btn').props('disabled')).toBe(false)
    expect(wrapper.find('#cancel-btn').props('disabled')).toBe(false)

    // verify initial data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity1')

    // verify initial events
    const valid = wrapper.emitted('valid')
    expect(valid.length).toBe(1)
    expect(valid.pop()).toEqual([true])
    const haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(1)
    expect(haveChanges.pop()).toEqual([false])
  })

  it('handles an invalid address', async () => {
    // set invalid/blank data (and verify)
    await wrapper.setData({ mailingAddress: wrapper.vm.$data.defaultAddress })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('')

    // verify buttons
    expect(wrapper.find('#done-btn').props('disabled')).toBe(true)
    expect(wrapper.find('#cancel-btn').props('disabled')).toBe(false)

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')

    // verify there are no new events
    expect(wrapper.emitted('valid').length).toEqual(1)
    expect(wrapper.emitted('haveChanges').length).toEqual(1)
  })

  it('ignores a canceled change', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Cancel button
    const cancelBtn = wrapper.find('#cancel-btn')
    cancelBtn.trigger('click')
    await Vue.nextTick()

    // verify that summary shows Correct button
    {
      const cols = wrapper.findAll('#summary-registered-address .flex')
      const actions = cols.at(3)
      const correctBtn = actions.find('.actions #btn-correct-office-addresses')
      expect(correctBtn.find('span').text()).toBe('Correct')
    }

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')

    // verify there are no new events
    expect(wrapper.emitted('valid').length).toEqual(1)
    expect(wrapper.emitted('haveChanges').length).toEqual(1)
  })

  it('ignores a null change', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // revert the change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(1) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity1')

    // click Done button
    const doneBtn = wrapper.find('#done-btn')
    doneBtn.trigger('click')
    await Vue.nextTick()

    // verify that summary shows Correct button
    {
      const cols = wrapper.findAll('#summary-registered-address .flex')
      const actions = cols.at(3)
      const correctBtn = actions.find('.actions #btn-correct-office-addresses')
      expect(correctBtn.find('span').text()).toBe('Correct')
    }

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')

    // verify new events
    const valid = wrapper.emitted('valid')
    expect(valid.length).toBe(2)
    expect(valid.pop()).toEqual([true])
    const haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(2)
    expect(haveChanges.pop()).toEqual([false])
  })

  it('accepts a valid change', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Done button
    const doneBtn = wrapper.find('#done-btn')
    doneBtn.trigger('click')
    await Vue.nextTick()

    // verify that summary shows Undo button
    {
      const cols = wrapper.findAll('#summary-registered-address .flex')
      const actions = cols.at(3)
      const undoBtn = actions.find('.actions .edit-action #btn-undo-office-addresses')
      expect(undoBtn.find('span').text()).toBe('Undo')
    }

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity5')

    // verify new events
    const valid = wrapper.emitted('valid')
    expect(valid.length).toBe(2)
    expect(valid.pop()).toEqual([true])
    const haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(2)
    expect(haveChanges.pop()).toEqual([true])
  })

  it('handles undo action', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Done button
    const doneBtn = wrapper.find('#done-btn')
    doneBtn.trigger('click')
    await Vue.nextTick()

    // click Undo button
    {
      const cols = wrapper.findAll('#summary-registered-address .flex')
      const actions = cols.at(3)
      const undoBtn = actions.find('.actions .edit-action #btn-undo-office-addresses')
      undoBtn.trigger('click')
      await Vue.nextTick()
    }

    // verify that summary shows Correct button
    {
      const cols = wrapper.findAll('#summary-registered-address .flex')
      const actions = cols.at(3)
      const correctBtn = actions.find('.actions #btn-correct-office-addresses')
      expect(correctBtn.find('span').text()).toBe('Correct')
    }

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')

    // verify new events
    const valid = wrapper.emitted('valid')
    expect(valid.length).toBe(3)
    expect(valid.pop()).toEqual([true])
    const haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(3)
    expect(haveChanges.pop()).toEqual([false])
  })

  it('handles re-correct action', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Done button
    {
      const doneBtn = wrapper.find('#done-btn')
      doneBtn.trigger('click')
      await Vue.nextTick()
    }

    // click Correct button
    {
      const cols = wrapper.findAll('#summary-registered-address .flex')
      const actions = cols.at(3)
      const moreBtn = actions.find('.actions .more-actions #btn-more-actions span')
      expect(moreBtn.find('span').exists()).toBe(true)
      moreBtn.trigger('click')
      await Vue.nextTick()
      const correctBtn = actions.find('.actions .more-actions #btn-more-actions-edit')
      correctBtn.trigger('click')
      await Vue.nextTick()
    }

    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(6) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity6')

    // click Done button
    {
      const doneBtn = wrapper.find('#done-btn')
      doneBtn.trigger('click')
      await Vue.nextTick()
    }

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity6')

    // verify new events
    const valid = wrapper.emitted('valid')
    expect(valid.length).toBe(3)
    expect(valid.pop()).toEqual([true])
    const haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(3)
    expect(haveChanges.pop()).toEqual([true])
  })
})
