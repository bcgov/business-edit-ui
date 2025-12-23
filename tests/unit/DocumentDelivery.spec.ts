import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import DocumentsDelivery from '@/components/common/DocumentsDelivery.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { AuthorizationRoles, FilingTypes } from '@/enums'
import { setAuthRole } from 'tests/set-auth-roles'

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
    setAuthRole(store, AuthorizationRoles.STAFF)
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

    wrapper.destroy()
  })

  it('shows users email', () => {
    const wrapper: Wrapper<DocumentsDelivery> = createComponent()

    expect(wrapper.vm.userEmail).toBe('currentuser@mail.com')

    wrapper.destroy()
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

    wrapper.destroy()
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

    wrapper.destroy()
  })
})
