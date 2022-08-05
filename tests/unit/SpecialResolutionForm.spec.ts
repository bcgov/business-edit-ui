import Vue from 'vue'
import Vuetify from 'vuetify'

import { getVuexStore } from '@/store/'
import { createLocalVue, mount } from '@vue/test-utils'
import SpecialResolutionForm from '@/components/SpecialResolution/SpecialResolutionForm.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker/'
import { HelpSection } from '@/components/common/'
import { EmptySigningPersonIF } from '@/interfaces'
import { CooperativeResource } from '@/resources/SpecialResolution/CooperativeResource'

Vue.use(Vuetify)

const localVue = createLocalVue()
const vuetify = new Vuetify({})

describe('Special Resolution Form component', () => {
  let wrapper: any
  let store: any = getVuexStore()

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'CP'
    }
  }

  beforeAll(() => {
    // init store
    store.state.stateModel.currentJsDate = new Date('2020-03-01T16:30:00Z')
    store.state.stateModel.tombstone.currentDate = '2021-03-01'
    store.state.stateModel.entitySnapshot = entitySnapshot
    store.state.stateModel.createResolution = {
      resolutionText: '',
      signingPerson: { ...EmptySigningPersonIF },
      resolutionConfirmed: false
    }
  })

  beforeEach(() => {
    // Set Original business Data
    store.state.resourceModel = CooperativeResource
    store.state.stateModel.nameRequest.legalName = entitySnapshot.businessInfo.legalName
    store.state.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.state.stateModel.summaryMode = false

    wrapper = mount(SpecialResolutionForm, { vuetify, store, localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the components', async () => {
    expect(wrapper.findComponent(SpecialResolutionForm).exists()).toBe(true)
    expect(wrapper.findComponent(DatePickerShared).exists()).toBe(true)
    expect(wrapper.findComponent(HelpSection).exists()).toBe(true)
  })

  it('renders the sample-resolution-header', async () => {
    const instructional = wrapper.find('#sample-resolution-header').text()
    expect(instructional).toContain('Special Resolution (Form 06 COO)')
  })
})
