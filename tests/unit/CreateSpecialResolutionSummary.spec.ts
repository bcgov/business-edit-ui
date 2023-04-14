import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import CreateSpecialResolutionSummary from '@/components/SpecialResolution/CreateSpecialResolutionSummary.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd } from '@/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('Special Resolution Summary component', () => {
  let wrapper: any

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: CorpTypeCd.COOP
    }
  }

  const signatory = {
    givenName: 'User',
    familyName: 'One',
    additionalName: ''
  }

  beforeAll(() => {
    // init store
    store.stateModel.entitySnapshot = entitySnapshot as any
    store.stateModel.specialResolution = {
      resolution: 'Test Resolution',
      resolutionDate: '2022-08-02',
      signatory: { ...signatory },
      resolutionConfirmed: false,
      signingDate: '2022-08-04'
    }
  })

  beforeEach(() => {
    // Set Original business Data
    store.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType as CorpTypeCd
    store.stateModel.summaryMode = false

    wrapper = shallowMount(CreateSpecialResolutionSummary, { vuetify })
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
    expect(wrapper.find('.siging-party').text()).toContain('User One')
    expect(wrapper.find('.siging-date').text()).toContain('August 4, 2022')
  })

  it('renders the Special Resolution Confirm component with invalid styling', async () => {
    expect(wrapper.find('#special-resolution-confirm.invalid-section').exists()).toBeFalsy()
    store.stateModel.validationFlags.flagsReviewCertify.isValidSpecialResolutionConfirm = false
    store.stateModel.validationFlags.appValidate = true

    await Vue.nextTick()

    expect(wrapper.find('#special-resolution-confirm.invalid-section').exists()).toBeTruthy()
  })
})
