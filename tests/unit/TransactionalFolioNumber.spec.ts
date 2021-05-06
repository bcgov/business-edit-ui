import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import { TransactionalFolioNumber } from '@/components/Summary'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()
const optionalEmailInput = '#optionalEmail'

/**
 * Creates and mounts a component, so that it can be tested.
 */
function createComponent (): Wrapper<TransactionalFolioNumber> {
  return mount(TransactionalFolioNumber, {
    vuetify,
    store
  })
}

// TODO: implement
xdescribe('Transactional Folio Number component', () => {
  let wrapperFactory: any
  beforeAll(() => {
    store.state.stateModel.tombstone.keycloakRoles = ['staff']
    store.state.stateModel.tombstone.userInfo = {
      email: 'currentuser@mail.com',
      contacts: [{ email: 'currentuser@mail.com' }]
    }
  })

  it('mounts the document delivery component ', () => {
    const wrapper: Wrapper<TransactionalFolioNumber> = createComponent()

    expect(wrapper.findComponent(TransactionalFolioNumber).exists()).toBe(true)
    expect(wrapper.find('#document-delivery-section').exists()).toBe(true)
  })

  it('shows users email', () => {
    const wrapper: Wrapper<TransactionalFolioNumber> = createComponent()

    expect((wrapper.vm as any).getUserEmail).toBe('currentuser@mail.com')
  })

  it('validates a valid email', async () => {
    const wrapper: Wrapper<TransactionalFolioNumber> = createComponent()
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
    const wrapper: Wrapper<TransactionalFolioNumber> = createComponent()
    const vm: any = wrapper.vm

    // Set Input field values
    vm.$el.querySelector(optionalEmailInput).textContent = '1212'
    wrapper.find('.text-input-field').trigger('focus')
    wrapper.find('.text-input-field').find('input').setValue('1212')
    wrapper.find('.text-input-field').trigger('blur')
    await Vue.nextTick()

    expect(wrapper.find(optionalEmailInput).text()).toEqual('1212')

    // verify there is an error. Vue doesn't like the blur event with testing
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
  })
})
