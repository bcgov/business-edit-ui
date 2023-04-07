import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { FilingTypes } from '@/enums'
import { mount } from '@vue/test-utils'
import Articles from '@/components/Alteration/Articles/Articles.vue'
import CompanyProvisions from '@/components/Alteration/Articles/CompanyProvisions.vue'
import ResolutionDates from '@/components/Alteration/Articles/ResolutionDates.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// Selectors
const articlesHeaderIcon = '.articles-header > .v-icon'
const articlesHeaderLabel = '.articles-title'
const changeCompanyProvisionsButton = '#change-company-provisions'
const addResolutionDateButton = '#add-resolution-date'

describe('Articles component - Company Provisions', () => {
  it('displays correct sections when this is an alteration filing and business has restrictions', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.businessInformation.hasRestrictions = true

    const wrapper = mount(Articles, { vuetify })
    await Vue.nextTick()

    expect(wrapper.findComponent(Articles).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderIcon).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderLabel).text()).toBe('Articles')
    expect(wrapper.findComponent(CompanyProvisions).exists()).toBe(true)
    expect(wrapper.findComponent(ResolutionDates).exists()).toBe(true)

    wrapper.destroy()
  })

  it('does not display Company Provisions when this is not an alteration filing', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.businessInformation.hasRestrictions = true

    const wrapper = mount(Articles, { vuetify })
    await Vue.nextTick()

    expect(wrapper.findComponent(Articles).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderIcon).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderLabel).text()).toBe('Articles')
    expect(wrapper.findComponent(CompanyProvisions).exists()).toBe(false)
    expect(wrapper.findComponent(ResolutionDates).exists()).toBe(true)

    wrapper.destroy()
  })

  it('does not display Company Provisions when business does not have restrictions', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.businessInformation.hasRestrictions = false

    const wrapper = mount(Articles, { vuetify })
    await Vue.nextTick()

    expect(wrapper.findComponent(Articles).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderIcon).exists()).toBe(true)
    expect(wrapper.find(articlesHeaderLabel).text()).toBe('Articles')
    expect(wrapper.findComponent(CompanyProvisions).exists()).toBe(false)
    expect(wrapper.findComponent(ResolutionDates).exists()).toBe(true)

    wrapper.destroy()
  })

  it('sets CompanyProvisions component as invalid when editing', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.businessInformation.hasRestrictions = true

    const wrapper = mount(Articles, { vuetify })
    await Vue.nextTick()

    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidCompanyProvisions).toBe(true)

    await wrapper.find(changeCompanyProvisionsButton).trigger('click')

    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidCompanyProvisions).toBe(false)

    wrapper.destroy()
  })

  it('sets ResolutionDates component as invalid when editing', async () => {
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
    store.stateModel.newAlteration.provisionsRemoved = true

    const wrapper = mount(Articles, { vuetify })
    await Vue.nextTick()

    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidResolutionDate).toBe(true)

    await wrapper.find(addResolutionDateButton).trigger('click')

    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidResolutionDate).toBe(false)

    wrapper.destroy()
  })
})
