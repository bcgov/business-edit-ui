import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import DocumentsDelivery from '@/components/common/DocumentsDelivery.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()
const optionalEmailInput = '#optionalEmail'

/**
 * Creates and mounts a component, so that it can be tested.
 */
function createComponent (): Wrapper<DocumentsDelivery> {
  return mount(DocumentsDelivery, {
    vuetify
  })
}

describe('Document Delivery component', () => {
  beforeAll(() => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.tombstone.keycloakRoles = ['staff']
    store.stateModel.tombstone.userInfo = {
      email: 'currentuser@mail.com',
      contacts: [{ email: 'currentuser@mail.com' }]
    }
  })

  it('mounts the document delivery component ', () => {
    const wrapper: Wrapper<DocumentsDelivery> = createComponent()

    expect(wrapper.findComponent(DocumentsDelivery).exists()).toBe(true)
    expect(wrapper.find('#document-delivery-section').exists()).toBe(true)
    expect(wrapper.find('.document-info').text()).toContain('Copies of the alteration')
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
    await input.setValue('optional@mail.com')
    await input.trigger('change')

    // verify email is valid
    expect(vm.validateEmailFormat).toBeTruthy()
  })

  it('validates an invalid email', async () => {
    const wrapper: Wrapper<DocumentsDelivery> = createComponent()
    const vm: any = wrapper.vm

    // Set Input field values
    vm.$el.querySelector(optionalEmailInput).textContent = '1212'
    await wrapper.find('.email-input-field').trigger('focus')
    await wrapper.find('.email-input-field').find('input').setValue('1212')
    await wrapper.find('.email-input-field').trigger('blur')

    expect(wrapper.find(optionalEmailInput).text()).toEqual('1212')

    // verify there is an error. Vue doesn't like the blur event with testing
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
  })
})
