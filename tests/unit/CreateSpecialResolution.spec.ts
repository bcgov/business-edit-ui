import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
import { createLocalVue, mount } from '@vue/test-utils'
import CreateSpecialResolution from '@/components/SpecialResolution/CreateSpecialResolution.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { HelpSection } from '@/components/common/'
import { CpSpecialResolutionResource } from '@/resources/SpecialResolution/CP'

Vue.use(Vuetify)

const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('Special Resolution Form component', () => {
  let wrapper: any
  let store: any = getVuexStore()
  sessionStorage.setItem('BASE_URL', 'http://localhost:8080/basePath/CP1002551/')
  sessionStorage.setItem('BUSINESS_ID', 'CP1002551')

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'CP'
    }
  }

  const emptyPerson = {
    givenName: '',
    familyName: '',
    additionalName: null
  }

  beforeAll(() => {
    // init store
    store.state.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.state.stateModel.tombstone.currentDate = '2021-03-01'
    store.state.stateModel.entitySnapshot = entitySnapshot
    store.state.stateModel.specialResolution = {
      resolution: '',
      signatory: { ...emptyPerson },
      resolutionConfirmed: false
    }
  })

  beforeEach(() => {
    // Set Original business Data
    store.state.resourceModel = CpSpecialResolutionResource
    store.state.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.state.stateModel.summaryMode = false

    wrapper = mount(CreateSpecialResolution, { vuetify, store, localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(CreateSpecialResolution).exists()).toBe(true)
    expect(wrapper.findComponent(DatePickerShared).exists()).toBe(true)
    expect(wrapper.findComponent(HelpSection).exists()).toBe(true)
  })

  it('renders the sample-resolution-header', async () => {
    const instructional = wrapper.find('#sample-resolution-header').text()
    expect(instructional).toContain('Special Resolution (Form 06 COO)')
  })

  it('displays the correct help text', async () => {
    wrapper.find('.help-btn').trigger('click')
    // wait until next render to reflect click changes
    await Vue.nextTick()

    const helpHeader = wrapper.find('.help-header h2')

    expect(helpHeader.exists()).toBe(true)
  })

  it('renders the sample resolution section', async () => {
    expect(wrapper.find('#sample-resolution-section').exists()).toBe(true)
  })

  it('renders the correct sample resolution text', async () => {
    const descText = wrapper.find('#sample-resolution-section .section-description')

    expect(descText.exists()).toBe(true)
    expect(descText.text()).toContain(CpSpecialResolutionResource.changeData.specialResolution.sampleFormSection.text)
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
    store.state.stateModel.validationFlags.flagsCompanyInfo.isValidCreateCreateSpecialResolution = false
    store.state.stateModel.validationFlags.componentValidate = true

    await Vue.nextTick()

    expect(wrapper.find('#create-special-resolution .invalid-section').exists()).toBeTruthy()
  })
})
