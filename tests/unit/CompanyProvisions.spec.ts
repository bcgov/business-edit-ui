import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount, mount } from '@vue/test-utils'
import { CompanyProvisions } from '@/components/Articles'
import mockRouter from './MockRouter'

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueRouter)

const vuetify = new Vuetify({})
const store = getVuexStore()

const alterationRouterName = 'alteration'

// Selectors
const hasPreExistingProvisionsText = '#has-pre-existing-provisions-text'
const changeCompanyProvisionsButton = '#change-company-provisions'
const defineCompanyProvisionsTitle = '.define-company-provisions-title'
const changedButton = 'span.v-chip > span.v-chip__content'
const undoCompanyProvisions = '#undo-company-provisions'
const userInstructionsText = '#company-provisions-user-instructions'
const companyProvisionsCheckbox = '#cp-checkbox'
const companyProvisionDoneButton = '#company-provisions-done'
const companyProvisionCancelButton = '#company-provisions-cancel'
const companyProvisionsComponent = '#checkbox-div .v-input--selection-controls.v-input--checkbox'
// CSS Classes
const infoTextClassName = 'info-text'
const invalidClassName = 'invalid'
describe('company provisions', () => {
  it('renders the component properly', () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRouterName })
    const wrapper = shallowMount(CompanyProvisions,
      {
        router,
        vuetify,
        store,
        propsData: { provisionsRemoved: false }
      })

    expect(wrapper.find(hasPreExistingProvisionsText).text())
      .toBe('This company has Pre-existing Company Provisions.')
    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(true)
    expect(wrapper.find(defineCompanyProvisionsTitle).text())
      .toBe('Pre-existing  Company Provisions')
    expect(wrapper.find(changedButton).exists()).toBe(false)

    wrapper.destroy()
  })

  it('should have the initial state set', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRouterName })
    const wrapper = mount(CompanyProvisions,
      {
        router,
        vuetify,
        store,
        propsData: { provisionsRemoved: false }
      })

    expect(wrapper.vm.$data.draftProvisionsRemoved).toBe(false)
    expect(wrapper.vm.$data.haveChanges).toBe(false)
    expect(wrapper.vm.$data.isEditing).toBe(false)
    expect(wrapper.vm.$data.isInvalid).toBe(false)
    expect(wrapper.vm.$data.originalProvisionsRemovedValue).toBe(false)

    wrapper.destroy()
  })

  it('shows form when Change button is clicked', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRouterName })
    const wrapper = mount(CompanyProvisions,
      {
        router,
        vuetify,
        store,
        propsData: { provisionsRemoved: false }
      })

    wrapper.find(changeCompanyProvisionsButton).trigger('click')
    await Vue.nextTick()

    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(false)
    expect(wrapper.find(userInstructionsText).exists()).toBe(true)
    expect(wrapper.find(companyProvisionsCheckbox).exists()).toBe(true)
    expect(wrapper.find(companyProvisionDoneButton).exists()).toBe(true)
    expect(wrapper.find(companyProvisionCancelButton).exists()).toBe(true)

    wrapper.destroy()
  })

  it('validates if provisionsRemoved value is not changed', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRouterName })
    const wrapper = mount(CompanyProvisions,
      {
        router,
        vuetify,
        store,
        propsData: { provisionsRemoved: false }
      })

    wrapper.find(changeCompanyProvisionsButton).trigger('click')
    await Vue.nextTick()

    // Initial state (valid)
    expect(wrapper.find(companyProvisionsComponent).element.classList.value.includes(invalidClassName)).toBeFalsy()

    wrapper.find(companyProvisionDoneButton).trigger('click')
    await Vue.nextTick()

    // Invalid state
    expect(wrapper.find(companyProvisionsComponent).element.classList.value.includes(invalidClassName)).toBeTruthy()

    wrapper.find(companyProvisionsCheckbox).trigger('click')
    await Vue.nextTick()

    // Valid state
    expect(wrapper.find(companyProvisionsComponent).element.classList.value.includes(invalidClassName)).toBeFalsy()

    wrapper.destroy()
  })

  it('should emit changes for company provisions', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRouterName })
    store.state.stateModel.originalAlteration.alteration.provisionsRemoved = false
    const wrapper = mount(CompanyProvisions,
      {
        router,
        vuetify,
        store,
        propsData: { provisionsRemoved: false }
      })
    wrapper.find(changeCompanyProvisionsButton).trigger('click')
    await Vue.nextTick()

    wrapper.find(companyProvisionsCheckbox).trigger('click')
    wrapper.find(companyProvisionDoneButton).trigger('click')
    await Vue.nextTick()

    let haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(1)
    expect(haveChanges.pop()).toEqual([true])
    expect(wrapper.emitted('companyProvisionsChanged').length).toBe(1)

    wrapper.destroy()
  })
  it('should emit changes with undo changes to company provisions', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRouterName })
    const wrapper = mount(CompanyProvisions,
      {
        router,
        vuetify,
        store,
        propsData: { provisionsRemoved: true }
      })
    // Sets the state for the checkbox selected
    wrapper.vm.$data.draftProvisionsRemoved = true
    wrapper.vm.$data.haveChanges = true
    wrapper.vm.$data.originalProvisionsRemovedValue = false
    await Vue.nextTick()

    expect(wrapper.find('#none-of-provisions-apply-text').text()).toBe('The company has resolved that none of the ' +
      'Pre-existing Company Provisions are to apply to this company.')
    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(false)
    expect(wrapper.find(undoCompanyProvisions).exists()).toBe(true)
    wrapper.find(undoCompanyProvisions).trigger('click')
    await Vue.nextTick()

    let haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(1)
    expect(haveChanges.pop()).toEqual([false])
    expect(wrapper.emitted('companyProvisionsChanged').length).toBe(1)

    wrapper.destroy()
  })
})
