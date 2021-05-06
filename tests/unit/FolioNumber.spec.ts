// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import FolioNumber from '@/components/YourCompany/FolioNumber.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Folio Number component', () => {
  it('initializes with default props', () => {
    const wrapper = mount(FolioNumber, { vuetify })
    const vm: any = wrapper.vm

    // verify myself
    expect(wrapper.findComponent(FolioNumber).exists()).toBe(true)

    // verify props
    expect(vm.initialValue).toBeNull()
    expect(vm.originalValue).toBeNull()
    expect(vm.hideActions).toBe(false)
    expect(vm.editLabel).toBeUndefined()
    expect(vm.editedLabel).toBeUndefined()
    expect(vm.invalidSection).toBe(false)

    // verify local properties
    expect(vm.isEditing).toBe(false)
    expect(vm.formValid).toBe(false)
    expect(vm.folioNumber).toBeNull() // was set to initial value
    expect(vm.dropdown).toBe(false)

    // verify getter
    expect(vm.hasFolioNumberChanged).toBe(false)

    // verify events
    expect(wrapper.emitted('newFolioNumber')).toBeUndefined()
    expect(wrapper.emitted('haveChanges')).toBeUndefined()
    expect(wrapper.emitted('isEditing')).toBeUndefined()

    wrapper.destroy()
  })

  it('initializes with props passed in', () => {
    const wrapper = mount(FolioNumber, {
      propsData: {
        initialValue: '123',
        originalValue: '456',
        hideActions: true,
        editLabel: 'Edit',
        editedLabel: 'Edited',
        invalidSection: true
      },
      vuetify
    })
    const vm: any = wrapper.vm

    // verify myself
    expect(wrapper.findComponent(FolioNumber).exists()).toBe(true)

    // verify props
    expect(vm.initialValue).toBe('123')
    expect(vm.originalValue).toBe('456')
    expect(vm.hideActions).toBe(true)
    expect(vm.editLabel).toBe('Edit')
    expect(vm.editedLabel).toBe('Edited')
    expect(vm.invalidSection).toBe(true)

    // verify local properties
    expect(vm.isEditing).toBe(false)
    expect(vm.formValid).toBe(false)
    expect(vm.folioNumber).toBe('123') // was set to initial value
    expect(vm.dropdown).toBe(false)

    // verify getter
    expect(vm.hasFolioNumberChanged).toBe(true)

    // verify events
    expect(wrapper.emitted('newFolioNumber')).toBeUndefined()
    expect(wrapper.emitted('haveChanges')).toBeUndefined()
    expect(wrapper.emitted('isEditing')).toBeUndefined()

    wrapper.destroy()
  })

  it('renders display mode', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: {
        initialValue: '123',
        originalValue: '123',
        editLabel: 'Edit',
        editedLabel: 'Edited'
      },
      vuetify
    })

    // verify main sections
    expect(wrapper.find('#display-folio-number').exists()).toBe(true)
    expect(wrapper.find('#edit-folio-number').exists()).toBe(false)

    // verify title column
    expect(wrapper.find('.v-chip').exists()).toBe(false)
    expect(wrapper.find('label').text()).toContain('Business Folio or')
    expect(wrapper.find('label').text()).toContain('Reference Number')

    // verify value column
    expect(wrapper.find('#folio-number-readonly').text()).toBe('123')

    // verify actions column
    expect(wrapper.find('.edit-actions').exists()).toBe(true)
    expect(wrapper.find('.edit-button').text()).toBe('Edit')
    expect(wrapper.find('.undo-button').exists()).toBe(false)
    expect(wrapper.find('.drop-down-actions').exists()).toBe(false)

    // change folio number
    await wrapper.setData({ folioNumber: '456' })

    // verify badge + updated actions
    expect(wrapper.find('.v-chip').exists()).toBe(true)
    expect(wrapper.find('.v-chip').text()).toBe('Edited')
    expect(wrapper.find('.edit-button').exists()).toBe(false)
    expect(wrapper.find('.undo-button').text()).toBe('Undo')
    expect(wrapper.find('.drop-down-actions').exists()).toBe(true)

    // change prop
    await wrapper.setProps({ hideActions: true })

    // verify that actions are hidden
    expect(wrapper.find('.edit-actions').exists()).toBe(false)

    wrapper.destroy()
  })

  it('renders edit mode', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: {
        initialValue: '123',
        originalValue: '456',
        editLabel: 'Edit',
        editedLabel: 'Edited'
      },
      vuetify
    })

    // change edit state
    await wrapper.setData({ isEditing: true })

    // verify main sections
    expect(wrapper.find('#display-folio-number').exists()).toBe(false)
    expect(wrapper.find('#edit-folio-number').exists()).toBe(true)

    // verify title column
    expect(wrapper.find('.v-chip').exists()).toBe(false)
    expect(wrapper.find('label').text()).toContain('Business Folio or')
    expect(wrapper.find('label').text()).toContain('Reference Number')

    // verify value column
    expect(wrapper.find('p').text()).toContain('This is the Folio or Reference Number')
    expect(wrapper.find('#folio-number-input').exists()).toBe(true)

    // verify action buttons
    expect(wrapper.find('.form-actions').exists()).toBe(true)
    expect(wrapper.find('.save-button').text()).toBe('Save')
    expect(wrapper.find('.cancel-button').text()).toBe('Cancel')

    wrapper.destroy()
  })

  it('displays empty folio number', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '' },
      vuetify
    })

    // verify value column
    expect(wrapper.find('#folio-number-readonly').text()).toBe('None')

    wrapper.destroy()
  })

  it('hides actions', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { hideActions: true },
      vuetify
    })

    // verify main sections
    expect(wrapper.find('#display-folio-number').exists()).toBe(true)
    expect(wrapper.find('#edit-folio-number').exists()).toBe(false)

    // verify actions column
    expect(wrapper.find('.edit-actions').exists()).toBe(false)

    wrapper.destroy()
  })

  it('sets invalid section styling', async () => {
    const wrapper = mount(FolioNumber, { vuetify })

    // change edit state
    await wrapper.setData({ isEditing: true })

    // verify label styling
    expect(wrapper.find('label').classes('error-text')).toBe(false)

    // change prop
    await wrapper.setProps({ invalidSection: true })

    // verify label styling
    expect(wrapper.find('label').classes('error-text')).toBe(true)

    wrapper.destroy()
  })

  it('handles Edit action', async () => {
    const wrapper = mount(FolioNumber, { vuetify })
    const vm: any = wrapper.vm

    // verify initial state
    expect(vm.isEditing).toBe(false)

    // click Edit button
    wrapper.find('.edit-button').trigger('click')
    await flushPromises()

    // verify results
    expect(vm.isEditing).toBe(true)
    expect(wrapper.emitted('isEditing').pop()).toEqual([true, false])

    wrapper.destroy()
  })

  it('handles Save action', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '123' },
      vuetify
    })
    const vm: any = wrapper.vm

    // verify initial data
    expect(vm.folioNumber).toBe('123')

    // change edit state
    await wrapper.setData({ isEditing: true })

    // enter a different folio number
    const input = wrapper.find('#folio-number-input')
    input.setValue('456')
    input.trigger('change')
    await flushPromises()

    // verify updated data
    expect(vm.folioNumber).toBe('456')

    // perform save (form submit) action
    await vm.onFormSubmit()

    // verify results
    expect(wrapper.emitted('newFolioNumber').pop()).toEqual(['456'])
    expect(wrapper.emitted('haveChanges').pop()).toEqual([true])
    expect(wrapper.emitted('isEditing').pop()).toEqual([false, true])

    wrapper.destroy()
  })

  it('handles Cancel action', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '123' },
      vuetify
    })
    const vm: any = wrapper.vm

    // verify initial data
    expect(vm.folioNumber).toBe('123')

    // change edit state
    await wrapper.setData({ isEditing: true })

    // enter a different folio number
    const input = wrapper.find('#folio-number-input')
    input.setValue('456')
    input.trigger('change')
    await flushPromises()

    // verify updated data
    expect(vm.folioNumber).toBe('456')

    // click Cancel button
    wrapper.find('.cancel-button').trigger('click')
    await flushPromises()

    // verify results
    expect(vm.folioNumber).toBe('123')
    expect(wrapper.emitted('isEditing').pop()).toEqual([false, true])

    wrapper.destroy()
  })

  it('handles Undo action', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: {
        initialValue: '123',
        originalValue: '456'
      },
      vuetify
    })
    const vm: any = wrapper.vm

    // verify initial data
    expect(vm.folioNumber).toBe('123')

    // click Undo button
    wrapper.find('.undo-button').trigger('click')
    await flushPromises()

    // verify results
    expect(vm.folioNumber).toBe('456')
    expect(wrapper.emitted('newFolioNumber').pop()).toEqual(['456'])
    expect(wrapper.emitted('haveChanges').pop()).toEqual([false])
    expect(wrapper.emitted('isEditing')).toBeUndefined() // new value (false) was same as prev value

    wrapper.destroy()
  })

  it('handles Change action', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: {
        initialValue: '123',
        originalValue: '456'
      },
      vuetify
    })
    const vm: any = wrapper.vm

    // verify initial state
    expect(vm.isEditing).toBe(false)

    // click More button
    wrapper.find('.more-button').trigger('click')
    await flushPromises()

    // click Change button
    wrapper.find('.change-button').trigger('click')
    await flushPromises()

    // verify results
    expect(vm.isEditing).toBe(true)
    expect(wrapper.emitted('isEditing').pop()).toEqual([true, false])

    wrapper.destroy()
  })

  it('accepts empty folio number', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '123' },
      vuetify
    })
    const vm: any = wrapper.vm

    // change edit state
    await wrapper.setData({ isEditing: true })

    // enter an empty string
    const input = wrapper.find('#folio-number-input')
    input.setValue('')
    input.trigger('change')
    await flushPromises()

    // verify results
    expect(vm.folioNumber).toBe('')
    expect(vm.formValid).toBe(true)
    expect(wrapper.findAll('.v-messages__message').length).toBe(0)

    wrapper.destroy()
  })

  it('accepts valid folio number', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const vm: any = wrapper.vm

    // change edit state
    await wrapper.setData({ isEditing: true })

    // enter a string that is exactly the maximum length
    const input = wrapper.find('#folio-number-input')
    input.setValue('ABCDEFGHIJabcdefghij1234567890')
    input.trigger('change')
    await flushPromises()

    // verify results
    expect(vm.folioNumber).toBe('ABCDEFGHIJabcdefghij1234567890')
    expect(vm.formValid).toBe(true)
    expect(wrapper.findAll('.v-messages__message').length).toBe(0)

    wrapper.destroy()
  })

  it('rejects folio number that is too long', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const vm: any = wrapper.vm

    // change edit state
    await wrapper.setData({ isEditing: true })

    // enter a string that is over the maximum length
    const input = wrapper.find('#folio-number-input')
    input.setValue('ABCDEFGHIJabcdefghij1234567890X')
    input.trigger('change')
    await flushPromises()

    // verify results
    expect(vm.folioNumber).toBe('ABCDEFGHIJabcdefghij1234567890X')
    expect(vm.formValid).toBe(false)
    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Maximum 30 characters reached')

    wrapper.destroy()
  })
})
