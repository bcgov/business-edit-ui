import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount, mount } from '@vue/test-utils'
import CompanyProvisions from '@/components/Alteration/Articles/CompanyProvisions.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, FilingTypes } from '@/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Selectors
const changeCompanyProvisionsButton = '#change-company-provisions'
const defineCompanyProvisionsTitle = '.define-company-provisions-title'
const changedButton = 'span.v-chip > span.v-chip__content'
const undoCompanyProvisions = '#undo-company-provisions'
const userInstructionsText = '#company-provisions-user-instructions'
const companyProvisionsCheckbox = '#cp-checkbox'
const companyProvisionDoneButton = '#company-provisions-done'
const companyProvisionCancelButton = '#company-provisions-cancel'
const companyProvisionsComponent = '#checkbox-div .v-input--selection-controls.v-input--checkbox'

describe('company provisions', () => {
  it('renders the component properly', () => {
    const wrapper = shallowMount(CompanyProvisions,
      {
        vuetify,
        propsData: { provisionsRemoved: false }
      })

    expect(wrapper.find('#has-pre-existing-provisions-text').text())
      .toBe('This company has Pre-existing Company Provisions.')
    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(true)
    expect(wrapper.find(defineCompanyProvisionsTitle).text()).toContain('Pre-existing')
    expect(wrapper.find(defineCompanyProvisionsTitle).text()).toContain('Company Provisions')
    expect(wrapper.find(changedButton).exists()).toBe(false)

    wrapper.destroy()
  })

  it('should have the initial state set', async () => {
    const wrapper = mount(CompanyProvisions,
      {
        vuetify,
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
    const wrapper = mount(CompanyProvisions,
      {
        vuetify,
        propsData: { provisionsRemoved: false }
      })

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')

    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(false)
    expect(wrapper.find(userInstructionsText).exists()).toBe(true)
    expect(wrapper.find(companyProvisionsCheckbox).exists()).toBe(true)
    expect(wrapper.find(companyProvisionDoneButton).exists()).toBe(true)
    expect(wrapper.find(companyProvisionCancelButton).exists()).toBe(true)

    wrapper.destroy()
  })

  it('validates if provisionsRemoved value is not changed', async () => {
    const wrapper = mount(CompanyProvisions,
      {
        vuetify,
        propsData: { provisionsRemoved: false }
      })

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')

    // Initial state (valid)
    expect(wrapper.find(companyProvisionsComponent).element.classList.value.includes('invalid')).toBeFalsy()

    await wrapper.find(companyProvisionDoneButton).trigger('click')

    // Invalid state
    expect(wrapper.find(companyProvisionsComponent).element.classList.value.includes('invalid')).toBeTruthy()

    await wrapper.find(companyProvisionsCheckbox).trigger('click')

    // Valid state
    expect(wrapper.find(companyProvisionsComponent).element.classList.value.includes('invalid')).toBeFalsy()

    wrapper.destroy()
  })

  it('should emit changes for company provisions', async () => {
    const wrapper = mount(CompanyProvisions,
      {
        vuetify,
        propsData: { provisionsRemoved: false }
      })

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')
    await wrapper.find(companyProvisionsCheckbox).trigger('click')
    await wrapper.find(companyProvisionDoneButton).trigger('click')

    const haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(1)
    expect(haveChanges.pop()).toEqual([true])
    expect(wrapper.emitted('isChanged').length).toBe(1)

    wrapper.destroy()
  })

  it('should emit changes with undo changes to company provisions', async () => {
    const wrapper = mount(CompanyProvisions,
      {
        vuetify,
        propsData: { provisionsRemoved: true }
      })

    // Set the state for the checkbox selected
    wrapper.vm.$data.draftProvisionsRemoved = true
    wrapper.vm.$data.haveChanges = true
    wrapper.vm.$data.originalProvisionsRemovedValue = false
    await Vue.nextTick()

    expect(wrapper.find('#none-of-provisions-apply-text').text())
      .toBe('The company has resolved that the Pre-existing Company Provisions no longer apply to this company.')
    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(false)
    expect(wrapper.find(undoCompanyProvisions).exists()).toBe(true)

    await wrapper.find(undoCompanyProvisions).trigger('click')

    const haveChanges = wrapper.emitted('haveChanges')
    expect(haveChanges.length).toBe(1)
    expect(haveChanges.pop()).toEqual([false])
    expect(wrapper.emitted('isChanged').length).toBe(1)

    wrapper.destroy()
  })

  it('displays the Correct button for correction filings', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION

    const wrapper = mount(CompanyProvisions,
      {
        vuetify,
        propsData: { provisionsRemoved: false }
      })

    const addBtn = wrapper.find('#change-company-provisions')
    expect(addBtn.exists()).toBe(true)
    expect(addBtn.text()).toBe('Correct')
    expect(addBtn.find('.v-icon.mdi-pencil').exists()).toBe(true)

    wrapper.destroy()
  })
})
