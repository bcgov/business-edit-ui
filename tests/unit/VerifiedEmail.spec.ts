import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import VerifiedEmail from '@/components/common/VerifiedEmail.vue'
import EmailVerificationService from '@/services/email-verification-service'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('Verified Email component', () => {
  it('displays correctly with no props', () => {
    const wrapper = mount(VerifiedEmail, { vuetify })

    // verify misc elements
    expect(wrapper.find('#verified-email').exists()).toBe(true)
    expect(wrapper.find('.v-text-field').exists()).toBe(true)
    expect(wrapper.find('.v-label').text()).toBe('Email Address')
    expect(wrapper.find('.v-messages__message').text()).toBe('Example: name@email.com')

    // verify initial events
    expect(wrapper.emitted('update:email').pop()).toEqual([null]) // initially empty
    expect(wrapper.emitted('valid').pop()).toEqual([true]) // initially valid

    wrapper.destroy()
  })

  it('displays label prop correctly', () => {
    const wrapper = mount(VerifiedEmail, {
      vuetify,
      propsData: { label: 'My Label' }
    })

    expect(wrapper.find('.v-label').text()).toBe('My Label')

    wrapper.destroy()
  })

  it('displays hint prop correctly', () => {
    const wrapper = mount(VerifiedEmail, {
      vuetify,
      propsData: { hint: 'My Hint' }
    })

    expect(wrapper.find('.v-messages__message').text()).toBe('My Hint')

    wrapper.destroy()
  })

  it('is valid when optional and no email is set', async () => {
    // mock email verification service function
    const mock = jest.spyOn((EmailVerificationService as any), 'isValidEmail').mockReturnValue(true)

    const wrapper = mount(VerifiedEmail, { vuetify })

    // set input value
    const input = wrapper.find('input')
    await input.setValue('')
    await input.trigger('blur')

    // verify mock was not called
    expect(mock).not.toHaveBeenCalled()

    // verify events
    expect(wrapper.emitted('update:email').pop()).toEqual([null]) // still empty
    expect(wrapper.emitted('valid').pop()).toEqual([true]) // still valid

    wrapper.destroy()
  })

  it('is invalid when required and no email is set', async () => {
    // mock email verification service function
    const mock = jest.spyOn((EmailVerificationService as any), 'isValidEmail').mockReturnValue(true)

    const wrapper = mount(VerifiedEmail, {
      vuetify,
      propsData: { required: true }
    })

    // set input value
    const input = wrapper.find('input')
    await input.setValue('')
    await input.trigger('blur')

    // verify mock was not called
    expect(mock).not.toHaveBeenCalled()

    // verify events
    expect(wrapper.emitted('update:email').pop()).toEqual([null]) // still empty
    expect(wrapper.emitted('valid').pop()).toEqual([false]) // now invalid

    wrapper.destroy()
  })

  xit('is valid with initial valid email', async () => {
    // mock email verification service function
    const mock = jest.spyOn((EmailVerificationService as any), 'isValidEmail').mockReturnValue(true)

    const wrapper = mount(VerifiedEmail, {
      vuetify,
      propsData: { email: 'valid@email.com' }
    })

    // verify mock was called
    expect(mock).toHaveBeenCalled()

    // verify events
    expect(wrapper.emitted('update:email').pop()).toBe(['valid@email.com']) // new value
    expect(wrapper.emitted('valid').pop()).toEqual([true]) // still valid

    wrapper.destroy()
  })

  xit('is invalid with initial invalid email', async () => {
    // mock email verification service function
    const mock = jest.spyOn((EmailVerificationService as any), 'isValidEmail').mockReturnValue(false)

    const wrapper = mount(VerifiedEmail, {
      vuetify,
      propsData: { email: 'invalid@email.com' }
    })

    // verify mock was called
    expect(mock).not.toHaveBeenCalled()

    // verify events
    expect(wrapper.emitted('update:email').pop()).toBe(['invalid@email.com']) // new value
    expect(wrapper.emitted('valid').pop()).toEqual([false]) // now invalid

    wrapper.destroy()
  })
})
