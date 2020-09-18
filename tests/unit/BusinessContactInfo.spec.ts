import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { mount, Wrapper } from '@vue/test-utils'

import { BusinessContactInfo } from '@/components/DefineCompany'
import { BusinessContactIF } from '@/interfaces'

Vue.use(Vuetify)

let vuetify = new Vuetify({})

// Events
const haveChangesEvent = 'haveChanges'
const formDataChangeEvent = 'contactInfoChange'

// Input field selectors to test changes to the DOM elements.
const emailSelector: string = '#txt-email'
const confirmEmailSelector: string = '#txt-confirm-email'
const phoneSelector: string = '#txt-phone'
const extensionSelector: string = '#txt-phone-extension'
const formSelector: string = '[name="business-contact-form"]'
const readOnlyEmailSelector: string = '#lbl-email'
const readOnlyPhoneSelector: string = '#lbl-phone'
const phoneCorrectedLabelSelector: string = '#phone-corrected-lbl'
const emailCorrectedLabelSelector: string = '#email-corrected-lbl'
const correctButtonSelector: string = '#btn-correct-contact-info'
const undoButtonSelector: string = '#btn-undo-contact-info'
const doneButtonSelector: string = '#done-btn'
const cancelBtnSelector: string = '#cancel-btn'

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<BusinessContactInfo>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  const events: Array<any> = eventsList[eventsList.length - 1]
  return events[0]
}

/**
 * Utility method to get around with the timing issues
 */
async function waitForUpdate (wrapper: Wrapper<Vue>) {
  await Vue.nextTick()
  await flushPromises()
  await Vue.nextTick()
}

const originalBusinessContactInfo: BusinessContactIF = {
  email: 'abc@test.com',
  confirmEmail: 'abc@test.com',
  phone: '(555) 555-5555',
  extension: ''
}

const correctedBusinessContactInfo: BusinessContactIF = {
  email: 'abc@test.com',
  confirmEmail: 'abc@test.com',
  phone: '(666) 555-5555',
  extension: '123'
}

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @param originalContactInfo The contact info in the original IA.
 * @param contactInfo The contact info in the store.
 * @returns a Wrapper<BusinessContactInfo> object with the given parameters.
 */
function createComponent (originalContactInfo: BusinessContactIF, contactInfo: BusinessContactIF):
 Wrapper<BusinessContactInfo> {
  return mount(BusinessContactInfo, {
    propsData: { businessContact: contactInfo, originalBusinessContact: originalContactInfo },
    vuetify
  })
}

describe('Business Contact Info component', () => {
  it('Loads the component in read only mode and displays data', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    expect(wrapper.find(readOnlyEmailSelector).text()).toEqual(originalBusinessContactInfo.email)
    expect(wrapper.find(readOnlyPhoneSelector).text()).toEqual(originalBusinessContactInfo.phone)
    wrapper.destroy()
  })

  it('Loads the component in read only mode and shows corrected labels', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, correctedBusinessContactInfo)
    expect(wrapper.find(readOnlyEmailSelector).text()).toEqual(correctedBusinessContactInfo.email)
    expect(wrapper.find(readOnlyPhoneSelector).text()).toContain(correctedBusinessContactInfo.phone)
    expect(wrapper.find(readOnlyPhoneSelector).text()).toContain('Ext: ' + correctedBusinessContactInfo.extension)
    expect(wrapper.find(phoneCorrectedLabelSelector).exists()).toBe(true)
    expect(wrapper.find(emailCorrectedLabelSelector).exists()).toBe(false)
    wrapper.destroy()
  })

  it('Shows correct button for no change in contact info', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    expect(wrapper.find(correctButtonSelector).exists()).toBe(true)
    expect(wrapper.find(undoButtonSelector).exists()).toBe(false)
    wrapper.destroy()
  })

  it('Shows undo button if there are corrections to business info', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, correctedBusinessContactInfo)
    expect(wrapper.find(correctButtonSelector).exists()).toBe(false)
    expect(wrapper.find(undoButtonSelector).exists()).toBe(true)
    wrapper.destroy()
  })

  it('Shows business contact form with values populated when correct button is clicked', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    wrapper.find(correctButtonSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).exists()).toBe(true)
    expect((<HTMLInputElement> wrapper.find(emailSelector).element).value).toEqual(originalBusinessContactInfo.email)
    expect((<HTMLInputElement> wrapper.find(confirmEmailSelector).element).value)
      .toEqual(originalBusinessContactInfo.email)
    expect((<HTMLInputElement> wrapper.find(phoneSelector).element).value).toEqual(originalBusinessContactInfo.phone)
    expect((<HTMLInputElement> wrapper.find(extensionSelector).element).value)
      .toEqual(originalBusinessContactInfo.extension)
    expect(wrapper.find(doneButtonSelector).exists()).toBe(true)
    expect(wrapper.find(cancelBtnSelector).exists()).toBe(true)
    wrapper.destroy()
  })

  it('Clicking done button in the form emits form data change event with the corrected contact info', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    wrapper.find(correctButtonSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).exists()).toBe(true)
    const inputElement: Wrapper<Vue> = wrapper.find(phoneSelector)
    inputElement.setValue(correctedBusinessContactInfo.phone)
    inputElement.trigger('change')
    await waitForUpdate(wrapper)
    wrapper.find(doneButtonSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: originalBusinessContactInfo.email,
      confirmEmail: originalBusinessContactInfo.email,
      phone: correctedBusinessContactInfo.phone,
      extension: originalBusinessContactInfo.extension
    })
    wrapper.destroy()
  })

  it('Clicking done button in the form emits form data change event with the original contact info', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    wrapper.find(correctButtonSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).exists()).toBe(true)
    const inputElement: Wrapper<Vue> = wrapper.find(phoneSelector)
    inputElement.setValue(correctedBusinessContactInfo.phone)
    inputElement.trigger('change')
    await waitForUpdate(wrapper)
    wrapper.find(cancelBtnSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(getLastEvent(wrapper, haveChangesEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: originalBusinessContactInfo.email,
      confirmEmail: originalBusinessContactInfo.email,
      phone: originalBusinessContactInfo.phone,
      extension: originalBusinessContactInfo.extension
    })
    wrapper.destroy()
  })

  it('Done button is disabled for invalid data', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    wrapper.find(correctButtonSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).exists()).toBe(true)
    expect(wrapper.find(doneButtonSelector).exists()).toBe(true)
    const inputElement: Wrapper<Vue> = wrapper.find(phoneSelector)
    inputElement.setValue('123')
    inputElement.trigger('change')
    await waitForUpdate(wrapper)
    expect(wrapper.find(doneButtonSelector).attributes('disabled')).toBe('disabled')
    expect(wrapper.find(cancelBtnSelector).exists()).toBe(true)
    expect(wrapper.find(cancelBtnSelector).attributes('disabled')).toBeUndefined()
    wrapper.destroy()
  })

  it('displays error message when user enters invalid phone', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    wrapper.find(correctButtonSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).exists()).toBe(true)
    const inputElement: Wrapper<Vue> = wrapper.find(phoneSelector)
    inputElement.setValue('123')
    inputElement.trigger('change')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).text()).toContain('Phone number is invalid')
    wrapper.destroy()
  })

  it('displays error message when user enters invalid email', async () => {
    const wrapper: Wrapper<BusinessContactInfo> =
    createComponent(originalBusinessContactInfo, originalBusinessContactInfo)
    wrapper.find(correctButtonSelector).trigger('click')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).exists()).toBe(true)
    const inputElement: Wrapper<Vue> = wrapper.find(emailSelector)
    inputElement.setValue('aa')
    inputElement.trigger('change')
    await waitForUpdate(wrapper)
    expect(wrapper.find(formSelector).text()).toContain('Valid email is required')
    wrapper.destroy()
  })
})
