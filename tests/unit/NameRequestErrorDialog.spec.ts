import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { NameRequestErrorDialog } from '@/components/dialogs'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Name Request Error Dialog', () => {
  it('displays "not found" message', async () => {
    const wrapper = mount(NameRequestErrorDialog, {
      vuetify,
      propsData: { dialog: true, type: 'NOT_FOUND' }
    })
    await Vue.nextTick()

    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('.v-card__title').text()).toBe('Name Request Not Found')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('We could not find a match for the information you have entered.')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('Please verify the NR Number and the phone number or email address and try again.')
    expect(wrapper.find('.v-card__actions button').text()).toBe('OK')

    wrapper.destroy()
  })

  it('displays "incorrect email" message', async () => {
    const wrapper = mount(NameRequestErrorDialog, {
      vuetify,
      propsData: { dialog: true, type: 'INCORRECT_EMAIL' }
    })
    await Vue.nextTick()

    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('.v-card__title').text()).toBe('Name Request Not Found')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('We could not find a match for the information you have entered.')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('Please verify the NR Number and the phone number or email address and try again.')
    expect(wrapper.find('.v-card__actions button').text()).toBe('OK')

    wrapper.destroy()
  })

  it('displays "incorrect phone" message', async () => {
    const wrapper = mount(NameRequestErrorDialog, {
      vuetify,
      propsData: { dialog: true, type: 'INCORRECT_PHONE' }
    })
    await Vue.nextTick()

    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('.v-card__title').text()).toBe('Name Request Not Found')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('We could not find a match for the information you have entered.')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('Please verify the NR Number and the phone number or email address and try again.')
    expect(wrapper.find('.v-card__actions button').text()).toBe('OK')

    wrapper.destroy()
  })

  it('displays "invalid NR" message', async () => {
    const wrapper = mount(NameRequestErrorDialog, {
      vuetify,
      propsData: { dialog: true, type: 'INVALID' }
    })
    await Vue.nextTick()

    expect(wrapper.isVisible()).toBe(true)
    // look for stubs due to shallow mount
    expect(wrapper.find('.v-card__title').text()).toBe('Name Request Not Found')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('We could not find a match for the information you have entered.')
    expect(wrapper.find('.v-card__text p').text())
      .toContain('Please verify the NR Number and the phone number or email address and try again.')
    expect(wrapper.find('.v-card__actions button').text()).toBe('OK')

    wrapper.destroy()
  })

  it('emits an event when OK button is clicked', async () => {
    const wrapper = mount(NameRequestErrorDialog, {
      vuetify,
      propsData: { dialog: true }
    })
    await Vue.nextTick()

    expect(wrapper.emitted('close')).toBeUndefined()

    // verify and click OK button
    const okBtn = wrapper.find('button')
    expect(okBtn.text()).toBe('OK')
    okBtn.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('close').length).toBe(1)

    wrapper.destroy()
  })
})
