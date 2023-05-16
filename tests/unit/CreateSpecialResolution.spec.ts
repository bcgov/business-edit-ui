import Vue from 'vue'
import Vuetify from 'vuetify'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import { mount } from '@vue/test-utils'
import CreateSpecialResolution from '@/components/SpecialResolution/CreateSpecialResolution.vue'
import { CpSpecialResolutionResource } from '@/resources/SpecialResolution/CP'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@/enums'
import {
  HelpSpecialResolution, InstructionalText, ResolutionEditor, SigningParty
} from '@/components/SpecialResolution'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// For Vue 3: remove - consult assets team for a replacement.
Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'mdi'
})

setActivePinia(createPinia())
const store = useStore()

describe('Special Resolution Form component', () => {
  let wrapper: any
  sessionStorage.setItem('BASE_URL', 'http://localhost:8080/basePath/CP1002551/')
  sessionStorage.setItem('BUSINESS_ID', 'CP1002551')

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'CP'
    }
  }

  beforeAll(() => {
    // init store
    store.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.stateModel.tombstone.currentDate = '2030-03-01'
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.specialResolution = {
      resolution: '<p> heyhey </p> ',
      resolutionDate: '2022-03-01',
      signingDate: '2024-01-01',
      signatory: {
        givenName: 't',
        familyName: 't'
      }
    }
  })

  beforeEach(() => {
    // Set Original business Data
    store.resourceModel = CpSpecialResolutionResource
    store.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType as CorpTypeCd
    store.stateModel.summaryMode = false
    store.stateModel.rules = {}
    store.stateModel.memorandum = {}
    store.stateModel.entitySnapshot = null
    wrapper = mount(CreateSpecialResolution, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(CreateSpecialResolution).exists()).toBe(true)
    expect(wrapper.findComponent(InstructionalText).exists()).toBe(true)
    expect(wrapper.findComponent(HelpSpecialResolution).exists()).toBe(true)
    expect(wrapper.findComponent(ResolutionEditor).exists()).toBe(true)
    expect(wrapper.findComponent(SigningParty).exists()).toBe(true)
  })

  it('displays the correct help text', async () => {
    wrapper.find('.help-btn').trigger('click')
    // wait until next render to reflect click changes
    await Vue.nextTick()

    const helpHeader = wrapper.find('.help-header h2')

    expect(helpHeader.exists()).toBe(true)
  })

  it('renders the form input', async () => {
    const resolutionDate = wrapper.find('#resolution-date-card .resolution-date-vcard-title')

    expect(resolutionDate.exists()).toBe(true)
    expect(resolutionDate.text()).toContain('Resolution Date')

    const resolution = wrapper.find('#resolution-date-card .resolution-text-vcard-title')

    expect(resolution.exists()).toBe(true)
    expect(resolution.text()).toContain('Resolution Text')
  })

  it('renders the signature form section', async () => {
    const resolutionDate = wrapper.find('#resolution-signature-card .resolution-signature-vcard-title')
    expect(resolutionDate.exists()).toBe(true)
    expect(resolutionDate.text()).toContain('Signing Party')
  })

  it('renders the Special Resolution form  component with invalid styling', async () => {
    expect(wrapper.find('#create-special-resolution .invalid-section').exists()).toBeFalsy()
    store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolution = false
    store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolutionSignature = false
    await Vue.nextTick()
    expect(wrapper.find('#create-special-resolution .invalid-section').exists()).toBeTruthy()
  })

  it('validation - signatory date should be after or on resolution date', async () => {
    store.stateModel.validationFlags.componentValidate = true
    await Vue.nextTick()
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolutionSignature).toBe(true)
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(true)
    store.stateModel.specialResolution = {
      ...store.stateModel.specialResolution,
      resolutionDate: '2026-03-01',
      signingDate: '2024-01-01'
    }
    await Vue.nextTick()
    wrapper = mount(CreateSpecialResolution, { vuetify })
    store.stateModel.validationFlags.componentValidate = true
    await flushPromises()

    // Should fail on the signature, because the signing date is before the resolution date.
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolutionSignature).toBe(false)
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(false)
  })
})
