import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import flushPromises from 'flush-promises'

import { DocumentsDelivery } from '@/components/Summary'

import { DocumentDeliveryIF } from '@/interfaces'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()
const optionalEmailInput = '#optionalEmail'

/**
 * Creates and mounts a component, so that it can be tested.
 */
function createComponent(): Wrapper<DocumentsDelivery> {
  return mount(DocumentsDelivery, {
    vuetify,
    store
  })
}

describe('Document Delivery component', () => {
  let wrapperFactory: any
  beforeAll(() => {
    store.state.stateModel.tombstone.userInfo = {
      email: 'currentuser@mail.com',
      contacts: [{ email: 'currentuser@mail.com' }]
    }
  })

  it('mounts the document delivery component ', () => {
    const wrapper: Wrapper<DocumentsDelivery> = createComponent()

    expect(wrapper.find(DocumentsDelivery).exists()).toBe(true)
    expect(wrapper.find('#document-delivery-section').exists()).toBe(true)
  })

  it('shows users email', () => {
    const wrapper: Wrapper<DocumentsDelivery> = createComponent()

    expect((wrapper.vm as any).getUserEmail).toBe('currentuser@mail.com')
  })

  it('validates a valid email', async () => {
    const wrapper: Wrapper<DocumentsDelivery> = createComponent()
    const vm: any = wrapper.vm
    
    // Set Input field value
    const input = wrapper.find(optionalEmailInput)
    input.setValue('optional@mail.com')
    input.trigger('change')
    await flushPromises()

    // verify email is valid
    expect(vm.validateEmailFormat).toBeTruthy()
  })

  it('validates an invalid email', async () => {
    const wrapper: Wrapper<DocumentsDelivery> = createComponent()
    const vm: any = wrapper.vm

    // Set Input field values
    vm.$el.querySelector(optionalEmailInput).textContent = '1212'
    wrapper.find(optionalEmailInput).setValue('1212')
    wrapper.find(optionalEmailInput).trigger('change')
    await flushPromises()

    wrapper.find(optionalEmailInput).trigger('input')
    expect(wrapper.find(optionalEmailInput).text()).toEqual('1212')

    // verify the error message
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
    expect(wrapper.find('.v-messages__message').text()).toContain('Email is Invalid')
  })

})
