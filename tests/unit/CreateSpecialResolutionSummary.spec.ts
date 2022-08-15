import Vue from 'vue'
import Vuetify from 'vuetify'

import { getVuexStore } from '@/store/'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import CreateSpecialResolutionSummary from '@/components/SpecialResolution/CreateSpecialResolutionSummary.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('Special Resolution Summary component', () => {
  let wrapper: any
  let store: any = getVuexStore()
  //   sessionStorage.setItem('BASE_URL', 'http://localhost:8080/basePath/CP1002551/')
  //   sessionStorage.setItem('BUSINESS_ID', 'CP1002551')

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'CP'
    }
  }

  const signatory = {
    givenName: 'User',
    familyName: 'One',
    additionalName: null
  }

  beforeAll(() => {
    // init store
    // store.state.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    // store.state.stateModel.tombstone.currentDate = '2021-03-01'
    store.state.stateModel.entitySnapshot = entitySnapshot
    store.state.stateModel.createResolution = {
      resolution: 'Test Resolution',
      resolutionDate: '2022-08-02',
      signatory: { ...signatory },
      resolutionConfirmed: false,
      signingDate: '2022-08-04'
    }
  })

  beforeEach(() => {
    // Set Original business Data
    // store.state.resourceModel = CooperativeResource
    store.state.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.state.stateModel.summaryMode = false

    wrapper = shallowMount(CreateSpecialResolutionSummary, { vuetify, store, localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(CreateSpecialResolutionSummary).exists()).toBe(true)
  })

  it('renders the Resolution label', async () => {
    expect(wrapper.find('#resolution-date-header').text()).toContain('Special Resolution')

    expect(wrapper.find('.resolution-date-label').text()).toContain('Resolution Date')
    expect(wrapper.find('.resolution-text-label').text()).toContain('Resolution Text')
    expect(wrapper.find('.siging-party-label').text()).toContain('Signing Party')
  })

  it('renders the Resolution Values from store', async () => {
    expect(wrapper.find('.resolution-date').text()).toContain('August 2, 2022')
    expect(wrapper.find('.resolution-text').text()).toContain('Test Resolution')
    expect(wrapper.find('.siging-party').text()).toContain('User  One')
    expect(wrapper.find('.siging-date').text()).toContain('August 4, 2022')
  })

  it('renders the Special Resolution Confirm component with invalid styling', async () => {
    expect(wrapper.find('#special-resolution-confirm.invalid-section').exists()).toBeFalsy()
    store.state.stateModel.validationFlags.flagsReviewCertify.isValidSpecialResolutionConfirm = false
    store.state.stateModel.validationFlags.appValidate = true

    await Vue.nextTick()

    expect(wrapper.find('#special-resolution-confirm.invalid-section').exists()).toBeTruthy()
  })
})
