import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import Resolution from '@/components/SpecialResolution/Resolution.vue'
import { CpSpecialResolutionResource } from '@/resources/SpecialResolution/CP'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, FilingTypes } from '@/enums'
import {
  HelpResolution, InstructionalText, ResolutionEditor, SigningParty
} from '@/components/SpecialResolution'
import flushPromises from 'flush-promises'

const vuetify = new Vuetify({})

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
  beforeEach(() => {
    // init store
    store.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.stateModel.tombstone.currentDate = '2030-03-01'
    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
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
    store.resourceModel = CpSpecialResolutionResource
    store.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType as CorpTypeCd
    store.stateModel.summaryMode = false
    store.stateModel.rules = {}
    store.stateModel.memorandum = {}
    store.stateModel.entitySnapshot = null
    wrapper = mount(Resolution, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(Resolution).exists()).toBe(true)
    expect(wrapper.findComponent(InstructionalText).exists()).toBe(true)
    expect(wrapper.findComponent(HelpResolution).exists()).toBe(true)
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
    expect(wrapper.find('#resolution .invalid-section').exists()).toBeFalsy()
    await store.setSpecialResolutionValid(false)
    await store.setSpecialResolutionSignatureValid(false)
    expect(wrapper.find('#resolution .invalid-section').exists()).toBeTruthy()
  })

  it('validation - signatory date should be after or on resolution date', async () => {
    wrapper.vm.isEditing = false
    await Vue.nextTick()
    store.stateModel.validationFlags.componentValidate = true
    await Vue.nextTick()
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolutionSignature).toBe(true)
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(true)
    // Set resolutionDate to a date AFTER the current date to make it invalid
    const dayAfterCurrentDate = new Date(store.stateModel.tombstone.currentDate)
    dayAfterCurrentDate.setDate(dayAfterCurrentDate.getDate() + 1)
    const invalidResolutionDate = dayAfterCurrentDate.toISOString().split('T')[0]
    store.stateModel.specialResolution = {
      ...store.stateModel.specialResolution,
      resolutionDate: invalidResolutionDate,
      signingDate: '2021-01-01'
    }
    await Vue.nextTick()
    wrapper = mount(Resolution, { vuetify })
    wrapper.vm.isEditing = false
    store.stateModel.validationFlags.componentValidate = true
    await flushPromises()

    // Should fail on the signature, because the signing date is before the resolution date.
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolutionSignature).toBe(false)
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidSpecialResolution).toBe(false)
  })

  it('test isEditing and isCoopCorrectionFiling', async () => {
    // Ensure the change button doesn't exist for special resolution.
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
    await Vue.nextTick()
    expect(wrapper.find('#btn-change-resolution').exists()).toBe(false)

    // Ensure the change button exists for correction.
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    await Vue.nextTick()
    await wrapper.find('#btn-change-resolution').trigger('click')
    expect(wrapper.vm.isEditing).toBe(true)
    expect(wrapper.vm.hasChanged).toBe(false)
    await Vue.nextTick()

    await wrapper.find('#btn-resolution-cancel').trigger('click')

    expect(wrapper.vm.hasChanged).toBe(false)
  })

  it('(correction) toggle edit, should be able to submit right away - without validation error', async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION

    await Vue.nextTick()
    await wrapper.find('#btn-change-resolution').trigger('click')
    await wrapper.vm.updateSpecialResolutionStore()
    await Vue.nextTick()
    expect(wrapper.vm.hasChanged).toBe(true)
    expect(wrapper.find('#btn-resolution-undo').exists()).toBe(true)
  })

  it('(non correction) normal special resolution ', async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.COOP
    store.stateModel.tombstone.filingType = FilingTypes.SPECIAL_RESOLUTION
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
    await Vue.nextTick()
    // No change button needed.
    await wrapper.vm.updateSpecialResolutionStore()
    await Vue.nextTick()
    expect(wrapper.vm.hasChanged).toBe(true)
    expect(wrapper.find('#btn-resolution-undo').exists()).toBe(false)
  })
})
