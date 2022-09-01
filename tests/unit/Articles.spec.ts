import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store/'
import { mount } from '@vue/test-utils'
import Articles from '@/components/Alteration/Articles/Articles.vue'
import mockRouter from './MockRouter'

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueRouter)

const vuetify = new Vuetify({})
const store = getVuexStore()

const alterationRoute = 'alteration'

// Selectors
const articlesTitle = '#articles'
const articlesHeaderIcon = '#articles > div.define-article-header > i.v-icon'
const articlesHeaderLabel = '#articles > div.define-article-header > label.define-article-title'
const companyProvisionsSection = '#company-provisions'
const changeCompanyProvisionsButton = '#change-company-provisions'
const undoCompanyProvisions = '#undo-company-provisions'
const companyProvisionsCheckbox = '#cp-checkbox'
const companyProvisionDoneButton = '#company-provisions-done'
const resolutionDatesSection = '#resolution-dates'
const resolutionDatesAddButtonn = '#add-resolution-date'
const resolutionDatesCloseButton = '#close-resolution-date'
const resolutionDatesRemoveButton = '#remove-resolution-date'
const resolutionDatesTextsList = '.resolution-date-list'

describe('Articles component', () => {
  it('displays the correct sections', () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.businessInformation.hasRestrictions = true
    store.state.stateModel.newAlteration.provisionsRemoved = false
    const wrapper = mount(Articles, { router, store, vuetify })

    expect(wrapper.find(articlesTitle).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderIcon).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderLabel).text()).toBe('Articles')
    expect(wrapper.find(companyProvisionsSection).exists()).toBe(true)
    expect(wrapper.find(resolutionDatesSection).exists()).toBe(true)

    wrapper.destroy()
  })

  it('should not display the company provisions sections when company doesn\'t have pre-existing provisions', () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.businessInformation.hasRestrictions = false
    store.state.stateModel.newAlteration.provisionsRemoved = false
    const wrapper = mount(Articles, { router, store, vuetify })

    expect(wrapper.find(articlesTitle).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderIcon).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderLabel).text()).toBe('Articles')
    expect(wrapper.find(companyProvisionsSection).exists()).toBe(false)

    wrapper.destroy()
  })

  it('shows only Change button when list for the initial state', () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.businessInformation.hasRestrictions = true
    store.state.stateModel.newAlteration.provisionsRemoved = false
    const wrapper = mount(Articles, { router, store, vuetify })

    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(true)
    expect(wrapper.find(undoCompanyProvisions).exists()).toBe(false)

    wrapper.destroy()
  })

  it('should emit changes', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.businessInformation.hasRestrictions = true
    store.state.stateModel.newAlteration.provisionsRemoved = false
    const wrapper = mount(Articles, { router, store, vuetify })

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')

    expect(wrapper.emitted('haveChanges')).toBeUndefined()

    await wrapper.find(companyProvisionDoneButton).trigger('click')

    // Should validate and not emit changes
    expect(wrapper.emitted('haveChanges')).toBeUndefined()

    await wrapper.find(companyProvisionsCheckbox).trigger('click')
    await wrapper.find(companyProvisionDoneButton).trigger('click')

    expect(wrapper.emitted('haveChanges').length).toEqual(1)

    wrapper.destroy()
  })

  it('sets company provisions component as invalid when editing', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.businessInformation.hasRestrictions = true
    store.state.stateModel.newAlteration.provisionsRemoved = false
    const wrapper = mount(Articles, { router, store, vuetify })
    await Vue.nextTick()
    expect(store.state.stateModel.validationFlags.flagsCompanyInfo.isValidCompanyProvisions).toBe(true)

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')

    expect(store.state.stateModel.validationFlags.flagsCompanyInfo.isValidCompanyProvisions).toBe(false)

    wrapper.destroy()
  })

  it('should allow the user to change company provisions', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.businessInformation.hasRestrictions = true
    store.state.stateModel.newAlteration.provisionsRemoved = false
    const wrapper = mount(Articles, { router, store, vuetify })

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')
    await wrapper.find(companyProvisionsCheckbox).trigger('click')
    await wrapper.find(companyProvisionDoneButton).trigger('click')

    expect(store.state.stateModel.newAlteration.provisionsRemoved).toBeTruthy()

    wrapper.destroy()
  })

  it('should allow the user to undo changes to company provisions', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.businessInformation.hasRestrictions = true
    store.state.stateModel.newAlteration.provisionsRemoved = false
    const wrapper = mount(Articles, { router, store, vuetify })

    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(true)

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')
    await wrapper.find(companyProvisionsCheckbox).trigger('click')
    await wrapper.find(companyProvisionDoneButton).trigger('click')

    expect(store.state.stateModel.newAlteration.provisionsRemoved).toBeTruthy()
    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(false)
    expect(wrapper.find(undoCompanyProvisions).exists()).toBe(true)

    await wrapper.find(undoCompanyProvisions).trigger('click')

    expect(store.state.stateModel.newAlteration.provisionsRemoved).toBeFalsy()
    expect(wrapper.find(changeCompanyProvisionsButton).exists()).toBe(true)

    wrapper.destroy()
  })

  it('shows only Add button when list for the initial state', () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.shareStructureStep.resolutionDates = []
    const wrapper = mount(Articles, { router, store, vuetify })

    expect(wrapper.find(articlesTitle).exists()).toBe(true)
    expect(wrapper.find(resolutionDatesAddButtonn).exists()).toBe(true)

    wrapper.destroy()
  })

  it('shows only Close button when Add button is clicked', async () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.shareStructureStep.resolutionDates = []
    const wrapper = mount(Articles, { router, store, vuetify })

    expect(wrapper.find(articlesTitle).exists()).toBe(true)
    const addBtn = wrapper.find(resolutionDatesAddButtonn)
    await addBtn.trigger('click')

    expect(wrapper.find(resolutionDatesCloseButton).exists()).toBe(true)

    wrapper.destroy()
  })

  it('shows only Remove button when the list is not empty', () => {
    const router = mockRouter.mock()
    router.push({ name: alterationRoute })
    store.state.stateModel.shareStructureStep.resolutionDates = ['2022-08-31']
    const wrapper = mount(Articles, { router, store, vuetify })

    expect(wrapper.find(articlesTitle).exists()).toBe(true)
    expect(wrapper.find(resolutionDatesRemoveButton).exists()).toBe(true)
    const dates = wrapper.findAll(resolutionDatesTextsList)
    expect(dates.exists()).toBe(true)
    expect(dates.length).toBe(1)
    expect(dates.at(0).text()).toContain('2022-08-31')
    wrapper.destroy()
  })
})
