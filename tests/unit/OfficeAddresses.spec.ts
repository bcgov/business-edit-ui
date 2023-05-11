import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import OfficeAddresses from '@/components/common/YourCompany/OfficeAddresses.vue'
import { AddressIF, AddressesIF } from '@/interfaces/stepper-interfaces/YourCompany/address-interfaces'
import { BenAlterationResource } from '@/resources/Alteration/BEN'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, FilingTypes } from '@/enums'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// needed for address component
Vue.use(Vuelidate)

setActivePinia(createPinia())
const store = useStore()

/**
 * Returns a customized Address object (except for country
 * and region, so we get meaningful display strings).
 * @param x the number to append to each property
 */
function getAddressX (x: number): AddressIF {
  return {
    id: x,
    addressCity: `addressCity${x}`,
    addressCountry: 'CA',
    addressRegion: 'BC',
    deliveryInstructions: `deliveryInstructions${x}`,
    postalCode: `postalCode${x}`,
    streetAddress: `streetAddress${x}`,
    streetAddressAdditional: `streetAddressAdditional${x}`
  } as any
}

/**
 * Returns a customized Incorporation Address object.
 * @param a1 the number to customize the 1st address (registered-mailing)
 * @param a2 the number to customize the 2nd address (registered-delivery)
 * @param a3 the number to customize the 3rd address (records-mailing)
 * @param a4 the number to customize the 4th address (records-delivery)
 */
function getIncorporationAddress (a1: number, a2: number, a3: number, a4: number): AddressesIF {
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
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.resourceModel = BenAlterationResource
  })

  it('displays the correct sections', () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION

    const wrapper = mount(OfficeAddresses, { vuetify })

    expect(wrapper.find('#summary-registered-address').exists()).toBe(true)
    expect(wrapper.find('#summary-records-address').exists()).toBe(true)
    expect(wrapper.find('#edit-registered-address').exists()).toBe(false)
    expect(wrapper.find('#edit-records-address').exists()).toBe(false)
    expect(wrapper.find('.action-btns').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays the registered office row - not same as mailing address', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    const summaryRow = wrapper.find('#summary-registered-address')

    // verify labels
    const labels = summaryRow.findAll('label')
    expect(labels.at(0).text()).toBe('Registered Office')
    expect(labels.at(1).text()).toBe('Mailing Address')
    expect(labels.at(2).text()).toBe('Delivery Address')

    // Verify mailing address
    const mailingAddress = summaryRow.findAll('.base-address').at(0)
    expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

    {
      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress1')
      expect(rows.at(1).text()).toBe('streetAddressAdditional1')
      expect(rows.at(2).text()).toContain('addressCity1')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode1')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions1')
    }

    // Verify delivery address
    const deliveryAddress = summaryRow.findAll('.base-address').at(1)
    expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)

    {
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
    const actions = summaryRow.find('.actions')
    const correctBtn = actions.find('#btn-correct-office-addresses')
    expect(correctBtn.find('span').text()).toBe('Correct')

    wrapper.destroy()
  })

  it('displays the registered office row - same as mailing address', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 1, 1, 1)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    const summaryRow = wrapper.find('#summary-registered-address')

    // verify labels
    const labels = summaryRow.findAll('label')
    expect(labels.at(0).text()).toBe('Registered Office')
    expect(labels.at(1).text()).toBe('Mailing Address')
    expect(labels.at(2).text()).toBe('Delivery Address')

    // Verify mailing address
    const mailingAddress = summaryRow.findAll('.base-address').at(0)
    expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

    {
      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress1')
      expect(rows.at(1).text()).toBe('streetAddressAdditional1')
      expect(rows.at(2).text()).toContain('addressCity1')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode1')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions1')
    }

    // Verify delivery address
    const deliveryAddress = summaryRow.findAll('.info-text').at(0)
    expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)
    expect(deliveryAddress.find('label + div').text()).toBe('Same as Mailing Address')

    // verify actions
    const actions = summaryRow.find('.actions')
    const correctBtn = actions.find('#btn-correct-office-addresses')
    expect(correctBtn.find('span').text()).toBe('Correct')

    wrapper.destroy()
  })

  it('displays the registered office row - changed addresses', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(4, 3, 2, 1))
    await Vue.nextTick()

    const summaryRow = wrapper.find('#summary-registered-address')

    // verify labels
    const labels = summaryRow.findAll('label')
    expect(labels.at(0).text()).toBe('Registered Office')
    expect(labels.at(1).text()).toBe('Mailing Address Corrected')
    expect(labels.at(2).text()).toBe('Delivery Address Corrected')

    // verify mailing address
    const mailingAddress = summaryRow.findAll('.base-address').at(0)
    {
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
    const deliveryAddress = summaryRow.findAll('.base-address').at(1)
    {
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
    const actions = summaryRow.find('.actions')

    const undoBtn = actions.find('.edit-action #btn-undo-office-addresses')
    expect(undoBtn.find('span').text()).toBe('Undo')

    const moreBtn = actions.find('.more-actions #btn-more-actions span')
    expect(moreBtn.find('span').exists()).toBe(true)

    await moreBtn.trigger('click')

    const correctBtn = actions.find('.more-actions #btn-more-actions-edit')
    expect(correctBtn.find('span').text()).toBe('Change')

    wrapper.destroy()
  })

  it('displays the records office row - not same as registered office', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    const summaryRow = wrapper.find('#summary-records-address')

    // verify labels
    const labels = summaryRow.findAll('label')
    expect(labels.at(0).text()).toBe('Records Office')
    expect(labels.at(1).text()).toBe('Mailing Address')
    expect(labels.at(2).text()).toBe('Delivery Address')

    // Verify mailing address
    const mailingAddress = summaryRow.findAll('.base-address').at(0)
    expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

    {
      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress3')
      expect(rows.at(1).text()).toBe('streetAddressAdditional3')
      expect(rows.at(2).text()).toContain('addressCity3')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode3')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions3')
    }

    // Verify delivery address
    const deliveryAddress = summaryRow.findAll('.base-address').at(1)
    expect(deliveryAddress.find('label > .v-chip').exists()).toBe(false)

    {
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
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 1, 1, 1)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    const summaryRow = wrapper.find('#summary-records-address')

    // verify labels
    const labels = summaryRow.findAll('label')
    expect(labels.at(0).text()).toBe('Records Office')
    expect(labels.at(1).text()).toBe('Mailing Address')
    expect(labels.at(2).text()).toBe('Delivery Address')

    // Verify mailing address
    const mailingAddress = summaryRow.findAll('.info-text').at(0)
    expect(mailingAddress.find('label + div').text()).toBe('Same as Registered Office')

    // Verify delivery address
    const deliveryAddress = summaryRow.findAll('.info-text').at(1)
    expect(deliveryAddress.find('label + div').text()).toBe('Same as Registered Office')

    wrapper.destroy()
  })

  it('displays the records office row - same as mailing address', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 1, 3, 3)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 1, 3, 3))
    await Vue.nextTick()

    const summaryRow = wrapper.find('#summary-records-address')

    // verify labels
    const labels = summaryRow.findAll('label')
    expect(labels.at(0).text()).toBe('Records Office')
    expect(labels.at(1).text()).toBe('Mailing Address')
    expect(labels.at(2).text()).toBe('Delivery Address')

    // verify mailing address
    const mailingAddress = summaryRow.findAll('.base-address').at(0)
    expect(mailingAddress.find('label > .v-chip').exists()).toBe(false)

    {
      const rows = mailingAddress.findAll('.address-block__info-row')
      expect(rows.at(0).text()).toBe('streetAddress3')
      expect(rows.at(1).text()).toBe('streetAddressAdditional3')
      expect(rows.at(2).text()).toContain('addressCity3')
      expect(rows.at(2).text()).toContain('BC')
      expect(rows.at(2).text()).toContain('postalCode3')
      expect(rows.at(3).text()).toBe('Canada')
      expect(rows.at(4).text()).toBe('deliveryInstructions3')
    }

    // Verify delivery address
    const deliveryAddress = summaryRow.findAll('.info-text').at(0)
    expect(deliveryAddress.find('label + div').text()).toBe('Same as Mailing Address')

    wrapper.destroy()
  })

  it('displays the records office row - changed addresses', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(4, 3, 2, 1))
    await Vue.nextTick()

    const summaryRow = wrapper.find('#summary-records-address')

    // verify labels
    const labels = summaryRow.findAll('label')
    expect(labels.at(0).text()).toBe('Records Office')
    expect(labels.at(1).text()).toBe('Mailing Address Corrected')
    expect(labels.at(2).text()).toBe('Delivery Address Corrected')

    // verify mailing address
    const mailingAddress = summaryRow.findAll('.base-address').at(0)
    {
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
    const deliveryAddress = summaryRow.findAll('.base-address').at(1)
    {
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
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
  })

  it('displays the correct sections', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

    expect(wrapper.find('#summary-registered-address').exists()).toBe(false)
    expect(wrapper.find('#summary-records-address').exists()).toBe(false)
    expect(wrapper.find('#edit-registered-address').exists()).toBe(true)
    expect(wrapper.find('#edit-records-address').exists()).toBe(true)
    expect(wrapper.find('.action-btns').exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays the registered office mailing address', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

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

      const address = block.find('#registered-mailing-address')
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
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

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

      const address = block.find('#registered-delivery-address')
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
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 1, 3, 3)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 1, 3, 3))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

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
      expect(block.find('#registered-delivery-address').exists()).toBe(false)
    }

    wrapper.destroy()
  })

  it('displays the records office mailing - not same as registered office', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

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

      const address = block.find('#records-mailing-address')
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
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 1, 1, 1)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

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
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

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

      const address = block.find('#records-delivery-address')
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
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 1, 3, 3)
    } as any

    const wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 1, 3, 3))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('.actions #btn-correct-office-addresses')
    await correctBtn.trigger('click')

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
      expect(block.find('#records-delivery-address').exists()).toBe(false)
    }

    wrapper.destroy()
  })
})

describe('"same as" checkboxes', () => {
  let wrapper: any

  beforeAll(() => {
    // init entity type
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY

    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 1, 1, 1)
    } as any
  })

  beforeEach(async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 1, 1, 1))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('#btn-correct-office-addresses')
    await correctBtn.trigger('click')
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
    let address = wrapper.find('#registered-delivery-address')
    expect(address.exists()).toBe(false)

    // uncheck and verify the checkbox
    await checkbox.trigger('click')
    expect(checkbox.attributes('aria-checked')).toBe('false')

    // verify the address data and elements
    expect(wrapper.vm.$data.deliveryAddress.addressCity).toBe('')
    // NB: since the address didn't exist previously, we need to find it again
    address = wrapper.find('#registered-delivery-address')
    expect(address.exists()).toBe(true)
    expect(address.find('.v-input.street-address').props('value')).toBe('')
    expect(address.find('.v-input.street-address-additional').props('value')).toBe('')
    expect(address.find('.v-input.address-city').props('value')).toBe('')
    expect(address.find('.v-input.address-region').props('value')).toBe('BC')
    expect(address.find('.v-input.postal-code').props('value')).toBe('')
    expect(address.find('.v-input.address-country').props('value')).toBe('CA')
    expect(address.find('.v-input.delivery-instructions').props('value')).toBeNull()

    // re-check and verify the checkbox
    await checkbox.trigger('click')
    expect(checkbox.attributes('aria-checked')).toBe('true')

    // verify the address data and elements
    expect(wrapper.vm.$data.deliveryAddress.addressCity).toBe('addressCity1')
    // NB: since the address existed previously, we need to find it again
    address = wrapper.find('#registered-delivery-address')
    expect(address.exists()).toBe(false)
  })

  it('toggles records mailing address same as registered mailing address', async () => {
    // verify initial registered mailing and records mailing address data
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity1')
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('addressCity1')

    // verify that checkbox is checked and that address doesn't exist
    const checkbox = wrapper.find('#records-mailing-same-chkbx')
    expect(checkbox.attributes('aria-checked')).toBe('true')
    let address = wrapper.find('#records-mailing-address')
    expect(address.exists()).toBe(false)

    // uncheck and verify the checkbox
    await checkbox.trigger('click')
    expect(checkbox.attributes('aria-checked')).toBe('false')

    // verify the address data and elements
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('')
    // NB: since the address didn't exist previously, we need to find it again
    address = wrapper.find('#records-mailing-address')
    expect(address.exists()).toBe(true)
    expect(address.find('.v-input.street-address').props('value')).toBe('')
    expect(address.find('.v-input.street-address-additional').props('value')).toBe('')
    expect(address.find('.v-input.address-city').props('value')).toBe('')
    expect(address.find('.v-input.address-region').props('value')).toBe('BC')
    expect(address.find('.v-input.postal-code').props('value')).toBe('')
    expect(address.find('.v-input.address-country').props('value')).toBe('CA')
    expect(address.find('.v-input.delivery-instructions').props('value')).toBeNull()

    // re-check and verify the checkbox
    await checkbox.trigger('click')
    expect(checkbox.attributes('aria-checked')).toBe('true')

    // verify the address data and elements
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('addressCity1')
    // NB: since the address existed previously, we need to find it again
    address = wrapper.find('#records-mailing-address')
    expect(address.exists()).toBe(false)
  })

  it('toggles records delivery address same as records mailing address', async () => {
    // verify initial registered mailing and records mailing address data
    expect(wrapper.vm.$data.recMailingAddress.addressCity).toBe('addressCity1')
    expect(wrapper.vm.$data.recDeliveryAddress.addressCity).toBe('addressCity1')

    // verify that checkbox is checked and that records addresses don't exist
    expect(wrapper.find('#records-mailing-same-chkbx').attributes('aria-checked')).toBe('true')
    expect(wrapper.find('#records-mailing-address').exists()).toBe(false)
    expect(wrapper.find('#records-delivery-address').exists()).toBe(false)

    // first make records office not the same as registered office
    const recordsCheckbox = wrapper.find('#records-mailing-same-chkbx')
    await recordsCheckbox.trigger('click')

    // the above assigned a default address to records mailing address so set a new one
    wrapper.vm.$data.recMailingAddress = getAddressX(3)

    // verify that checkbox is checked and that address doesn't exist
    const checkbox = wrapper.find('#records-delivery-same-chkbx')
    expect(checkbox.attributes('aria-checked')).toBe('true')
    let address = wrapper.find('#records-delivery-address')
    expect(address.exists()).toBe(false)

    // uncheck and verify the checkbox
    await checkbox.trigger('click')
    expect(checkbox.attributes('aria-checked')).toBe('false')

    // verify the address data and elements
    expect(wrapper.vm.$data.recDeliveryAddress.addressCity).toBe('')
    // NB: since the address didn't exist previously, we need to find it again
    address = wrapper.find('#records-delivery-address')
    expect(address.exists()).toBe(true)
    expect(address.find('.v-input.street-address').props('value')).toBe('')
    expect(address.find('.v-input.street-address-additional').props('value')).toBe('')
    expect(address.find('.v-input.address-city').props('value')).toBe('')
    expect(address.find('.v-input.address-region').props('value')).toBe('BC')
    expect(address.find('.v-input.postal-code').props('value')).toBe('')
    expect(address.find('.v-input.address-country').props('value')).toBe('CA')
    expect(address.find('.v-input.delivery-instructions').props('value')).toBeNull()

    // re-check and verify the checkbox
    await checkbox.trigger('click')
    expect(checkbox.attributes('aria-checked')).toBe('true')

    // verify the address data and elements
    expect(wrapper.vm.$data.recDeliveryAddress.addressCity).toBe('addressCity3')
    // NB: since the address existed previously, we need to find it again
    address = wrapper.find('#records-delivery-address')
    expect(address.exists()).toBe(false)
  })
})

describe('actions and events', () => {
  let wrapper: any

  beforeAll(() => {
    // init entity type
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY

    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any
  })

  beforeEach(async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    wrapper = mount(OfficeAddresses, { vuetify })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()

    // change to edit mode
    const correctBtn = wrapper.find('#btn-correct-office-addresses')
    await correctBtn.trigger('click')
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

    // verify initial state
    expect(wrapper.vm.haveOfficeAddressesChanged).toEqual(false)
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

    // verify state
    expect(wrapper.vm.haveOfficeAddressesChanged).toEqual(false)
  })

  it('ignores a canceled change', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Cancel button
    const cancelBtn = wrapper.find('#cancel-btn')
    await cancelBtn.trigger('click')

    // verify that summary shows Correct button
    const correctBtn = wrapper.find('#btn-correct-office-addresses')
    expect(correctBtn.find('span').text()).toBe('Correct')

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')

    // verify state
    expect(wrapper.vm.haveOfficeAddressesChanged).toEqual(false)
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
    await doneBtn.trigger('click')

    // verify that summary shows Correct button
    const correctBtn = wrapper.find('#btn-correct-office-addresses')
    expect(correctBtn.find('span').text()).toBe('Correct')

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')

    // verify state
    expect(wrapper.vm.haveOfficeAddressesChanged).toEqual(false)
  })

  it('accepts a valid change', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Done button
    const doneBtn = wrapper.find('#done-btn')
    await doneBtn.trigger('click')

    // verify that summary shows Undo button
    // verify that summary shows Correct button
    const undoBtn = wrapper.find('#btn-undo-office-addresses')
    expect(undoBtn.find('span').text()).toBe('Undo')

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity5')

    // verify state
    expect(wrapper.vm.haveOfficeAddressesChanged).toEqual(true)
  })

  it('handles undo action', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Done button
    const doneBtn = wrapper.find('#done-btn')
    await doneBtn.trigger('click')

    // click Undo button
    const undoBtn = wrapper.find('#btn-undo-office-addresses')
    await undoBtn.trigger('click')

    // verify that summary shows Correct button
    const correctBtn = wrapper.find('#btn-correct-office-addresses')
    expect(correctBtn.find('span').text()).toBe('Correct')

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity1')

    // verify state
    expect(wrapper.vm.haveOfficeAddressesChanged).toEqual(false)
  })

  it('handles re-correct action', async () => {
    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(5) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity5')

    // click Done button
    {
      const doneBtn = wrapper.find('#done-btn')
      await doneBtn.trigger('click')
    }

    // click Correct button
    const moreBtn = wrapper.find('#btn-more-actions')
    expect(moreBtn.find('span').exists()).toBe(true)
    await moreBtn.trigger('click')

    const correctBtn = wrapper.find('#btn-more-actions-edit')
    await correctBtn.trigger('click')

    // make a change (and verify)
    await wrapper.setData({ mailingAddress: getAddressX(6) })
    expect(wrapper.vm.$data.mailingAddress.addressCity).toBe('addressCity6')

    // click Done button
    {
      const doneBtn = wrapper.find('#done-btn')
      await doneBtn.trigger('click')
    }

    // verify data
    expect(wrapper.vm.getOfficeAddresses.registeredOffice.mailingAddress.addressCity).toBe('addressCity6')

    // verify state
    expect(wrapper.vm.haveOfficeAddressesChanged).toEqual(true)
  })
})

describe('For Special resolution', () => {
  let wrapper: any

  beforeAll(() => {
    // init entity type
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP

    // init original offices
    store.stateModel.entitySnapshot = {
      addresses: getIncorporationAddress(1, 2, 3, 4)
    } as any
  })

  beforeEach(async () => {
    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
    wrapper = mount(OfficeAddresses, { vuetify, propsData: { isSummaryView: false } })

    // set office addresses to trigger watcher
    store.setOfficeAddresses(getIncorporationAddress(1, 2, 3, 4))
    await Vue.nextTick()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('tooltip exist for COOP', () => {
    // verify initial state
    expect(wrapper.find('.v-tooltip').exists()).toBe(true)
    expect(wrapper.find('.actions').exists()).toBe(false)
  })
})

describe('verify updateAddress()', () => {
  let wrapper: any
  let vm: any

  /** Returns True if address IDs and types are unchanged and contents are as specified. */
  function verifyAddressChanges (vals: Array<number>): boolean {
    // verify IDs (should be same as original)
    if (vm.$data.mailingAddress.id !== 1) return false
    if (vm.$data.deliveryAddress.id !== 2) return false
    if (vm.$data.recMailingAddress.id !== 3) return false
    if (vm.$data.recDeliveryAddress.id !== 4) return false

    // verify address types (should be same as original)
    if (vm.$data.mailingAddress.addressType !== 'mailing') return false
    if (vm.$data.deliveryAddress.addressType !== 'delivery') return false
    if (vm.$data.recMailingAddress.addressType !== 'mailing') return false
    if (vm.$data.recDeliveryAddress.addressType !== 'delivery') return false

    // verify address contents (checking only City is sufficient)
    if (vm.$data.mailingAddress.addressCity !== `addressCity${vals[0]}`) return false
    if (vm.$data.deliveryAddress.addressCity !== `addressCity${vals[1]}`) return false
    if (vm.$data.recMailingAddress.addressCity !== `addressCity${vals[2]}`) return false
    if (vm.$data.recDeliveryAddress.addressCity !== `addressCity${vals[3]}`) return false

    return true
  }

  beforeEach(async () => {
    wrapper = mount(OfficeAddresses, { vuetify })
    vm = wrapper.vm

    // set original addresses
    wrapper.setData({ mailingAddress: getAddressX(1) })
    wrapper.setData({ deliveryAddress: getAddressX(2) })
    wrapper.setData({ recMailingAddress: getAddressX(3) })
    wrapper.setData({ recDeliveryAddress: getAddressX(4) })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const tests = [
    {
      inherit: false,
      address: 1, // MAILING_ADDRESS
      expected: [5, 2, 3, 4]
    },
    {
      inherit: true,
      address: 1, // MAILING_ADDRESS
      expected: [5, 5, 5, 5]
    },
    {
      inherit: false,
      address: 2, // DELIVERY_ADDRESS
      expected: [1, 5, 3, 4]
    },
    {
      inherit: true,
      address: 2, // DELIVERY_ADDRESS
      expected: [1, 5, 3, 5]
    },
    {
      inherit: false,
      address: 3, // REC_MAILING_ADDRESS
      expected: [1, 2, 5, 4]
    },
    {
      inherit: true,
      address: 3, // REC_MAILING_ADDRESS
      expected: [1, 2, 5, 5]
    },
    {
      inherit: false,
      address: 4, // REC_DELIVERY_ADDRESS
      expected: [1, 2, 3, 5]
    },
    {
      inherit: true,
      address: 4, // REC_DELIVERY_ADDRESS
      expected: [1, 2, 3, 5]
    }
  ]

  for (const test of tests) {
    it(`updates address: ${test.address} with inherit flags: ${test.inherit}`, () => {
      // set inherit state
      wrapper.setData({
        inheritMailingAddress: test.inherit,
        inheritRegisteredAddress: test.inherit
      })

      // verify unchanged address
      vm.updateAddress(test.address, getAddressX(test.address))
      verifyAddressChanges([1, 2, 3, 4])

      // verify changed address
      vm.updateAddress(test.address, getAddressX(5))
      verifyAddressChanges(test.expected)
    })
  }
})
