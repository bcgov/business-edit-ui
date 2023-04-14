import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount, mount } from '@vue/test-utils'
import SaveErrorDialog from '@/dialogs/SaveErrorDialog.vue'
import ErrorContact from '@/components/common/ErrorContact.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Save Error Dialog', () => {
  it('renders the component properly as a staff user with no errors or warnings', () => {
    store.stateModel.tombstone.keycloakRoles = ['staff', 'edit', 'view']
    const wrapper = shallowMount(SaveErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.attributes('contentclass')).toBe('save-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to save Filing')
    expect(wrapper.findAll('p').length).toBe(2)
    expect(wrapper.findAll('p').at(0).text()).toContain('We were unable to save your Filing.')
    expect(wrapper.findAll('p').at(1).text()).toContain('If you exit this Filing')
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component properly as a regular user with no errors or warnings', () => {
    store.stateModel.tombstone.keycloakRoles = ['edit', 'view']
    const wrapper = shallowMount(SaveErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.attributes('contentclass')).toBe('save-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to save Filing')
    expect(wrapper.findAll('p').length).toBe(3)
    expect(wrapper.findAll('p').at(0).text()).toContain('We were unable to save your Filing.')
    expect(wrapper.findAll('p').at(1).text()).toContain('If you exit this Filing')
    expect(wrapper.findAll('p').at(2).text()).toContain('If this error persists')
    expect(wrapper.findComponent(ErrorContact).exists()).toBe(true)
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component properly when there are only errors', () => {
    store.stateModel.tombstone.keycloakRoles = ['edit', 'view']
    const wrapper = shallowMount(SaveErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          errors: [
            { error: 'Test Error 1' },
            { error: 'Test Error 2' }
          ]
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Unable to save Filing')
    expect(wrapper.findAll('p').length).toBe(2)
    expect(wrapper.findAll('p').at(0).text()).toContain('We were unable to save your Filing due')
    expect(wrapper.findAll('p').at(1).text()).toContain('If this error persists')
    expect(wrapper.findAll('li').length).toBe(2)
    expect(wrapper.findAll('li').at(0).text()).toBe('Test Error 1')
    expect(wrapper.findAll('li').at(1).text()).toBe('Test Error 2')
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component properly when there are only warnings', () => {
    store.stateModel.tombstone.keycloakRoles = ['edit', 'view']
    const wrapper = shallowMount(SaveErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          warnings: [
            { warning: 'Test Warning 1' },
            { warning: 'Test Warning 2' }
          ]
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Filing saved with warnings')
    expect(wrapper.findAll('p').length).toBe(2)
    expect(wrapper.findAll('p').at(0).text()).toContain('Please note the following warnings')
    expect(wrapper.findAll('p').at(1).text()).toContain('If this error persists')
    expect(wrapper.findAll('li').length).toBe(2)
    expect(wrapper.findAll('li').at(0).text()).toBe('Test Warning 1')
    expect(wrapper.findAll('li').at(1).text()).toBe('Test Warning 2')
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component properly when there are both errors and warnings', () => {
    store.stateModel.tombstone.keycloakRoles = ['edit', 'view']
    const wrapper = shallowMount(SaveErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          errors: [{ error: 'Test Error' }],
          warnings: [{ warning: 'Test Warning' }]
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Unable to save Filing')
    expect(wrapper.findAll('p').length).toBe(3)
    expect(wrapper.findAll('p').at(0).text()).toContain('We were unable to save your Filing due')
    expect(wrapper.findAll('p').at(1).text()).toContain('Please note the following warnings')
    expect(wrapper.findAll('p').at(2).text()).toContain('If this error persists')
    expect(wrapper.findAll('li').length).toBe(2)
    expect(wrapper.findAll('li').at(0).text()).toBe('Test Error')
    expect(wrapper.findAll('li').at(1).text()).toBe('Test Warning')
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('emits an event when Exit button is clicked', async () => {
    const wrapper = mount(SaveErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('exit')).toBeUndefined()

    // verify and click Exit button
    const exitButton = wrapper.find('#dialog-exit-button')
    expect(exitButton.text()).toBe('Exit without saving')
    await exitButton.trigger('click')

    expect(wrapper.emitted('exit').length).toBe(1)

    wrapper.destroy()
  })

  it('emits an event when OK button is clicked', async () => {
    const wrapper = mount(SaveErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('okay')).toBeUndefined()

    // verify and click OK button
    const okayButton = wrapper.find('#dialog-okay-button')
    expect(okayButton.text()).toBe('OK')
    await okayButton.trigger('click')

    expect(wrapper.emitted('okay').length).toBe(1)

    wrapper.destroy()
  })
})
