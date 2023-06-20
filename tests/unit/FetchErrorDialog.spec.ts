import Vuetify from 'vuetify'
import { shallowMount, mount } from '@vue/test-utils'
import FetchErrorDialog from '@/dialogs/FetchErrorDialog.vue'
import ErrorContact from '@/components/common/ErrorContact.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Fetch Error Dialog', () => {
  it('renders the component properly as a staff user', () => {
    store.stateModel.tombstone.keycloakRoles = ['staff', 'edit', 'view']
    const wrapper = shallowMount(FetchErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.attributes('contentclass')).toBe('fetch-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to Retrieve Filing')
    expect(wrapper.findAll('p').length).toBe(1)
    expect(wrapper.findAll('p').at(0).text()).toContain('We were unable to retrieve your')
    expect(wrapper.findComponent(ErrorContact).exists()).toBe(false)
    expect(wrapper.findAll('#dialog-exit-button').exists()).toBe(true)
    expect(wrapper.findAll('#dialog-retry-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component properly as a regular user', () => {
    store.stateModel.tombstone.keycloakRoles = ['edit', 'view']
    const wrapper = shallowMount(FetchErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.attributes('contentclass')).toBe('fetch-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to Retrieve Filing')
    expect(wrapper.findAll('p').length).toBe(2)
    expect(wrapper.findAll('p').at(0).text()).toContain('We were unable to retrieve your')
    expect(wrapper.findAll('p').at(1).text()).toContain('If this error persists')
    expect(wrapper.findComponent(ErrorContact).exists()).toBe(true)
    expect(wrapper.findAll('#dialog-exit-button').exists()).toBe(true)
    expect(wrapper.findAll('#dialog-retry-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('emits an event when Exit button is clicked', async () => {
    const wrapper = mount(FetchErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('exit')).toBeUndefined()

    // verify and click Exit button
    const exitButton = wrapper.find('#dialog-exit-button')
    expect(exitButton.text()).toBe('Return to dashboard')
    await exitButton.trigger('click')

    expect(wrapper.emitted('exit').length).toBe(1)

    wrapper.destroy()
  })

  it('emits an event when Retry button is clicked', async () => {
    const wrapper = mount(FetchErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('retry')).toBeUndefined()

    // verify and click Retry button
    const retryButton = wrapper.find('#dialog-retry-button')
    expect(retryButton.text()).toBe('Retry')
    await retryButton.trigger('click')

    expect(wrapper.emitted('retry').length).toBe(1)

    wrapper.destroy()
  })
})
