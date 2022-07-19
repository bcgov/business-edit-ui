import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store/'
import { mount } from '@vue/test-utils'
import ConversionNOB from '@/components/Conversion/ConversionNOB.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

const businessInformation = {
  legalType: 'SP',
  identifier: '',
  legalName: '',
  foundingDate: '',
  hasRestrictions: false,
  naicsCode: '100000',
  naicsDescription: 'food'
}

const updatedBusinessInfo = {
  ...businessInformation,
  naicsCode: null,
  naicsDescription: '100001 - cake'
}

const entitySnapShot = {
  businessInfo: businessInformation,
  authInfo: null,
  orgPersons: null,
  addresses: null,
  nameTranslations: null,
  shareStructure: null,
  resolutions: null
}

const initialProps = {
  onEditMode: false,
  naicsText: ''
}

describe('ConversionNatureOfBusiness without update', () => {
  let wrapperFactory: any
  let wrapper: any
  let store: any = getVuexStore()

  beforeEach(() => {
    store.state.stateModel.businessInformation = businessInformation
    store.state.stateModel.entitySnapshot = entitySnapShot
    wrapperFactory = (propsData: any) => {
      return mount(ConversionNOB, {
        propsData: {
          ...propsData
        },
        store,
        vuetify
      })
    }
    wrapper = wrapperFactory(initialProps)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the naicsSummary text', async () => {
    expect(wrapper.findComponent(ConversionNOB).exists()).toBe(true)
    expect(wrapper.find('#naics-summary').text()).toBe('100000 - food')
  })

  it('renders the text field and texts', async () => {
    const changeBtn = wrapper.find('#nob-change-btn')
    await changeBtn.trigger('click')

    expect(wrapper.find('p').text()).toContain('Provide a brief description')
    expect(wrapper.find('.v-counter').text()).toBe('13 / 300')
    expect(wrapper.vm.$data.naicsText).toBe('100000 - food')
    expect(wrapper.vm.$data.onEditMode).toBeTruthy()
    expect(wrapper.find('#naics-summary').exists()).toBeFalsy()
  })

  it('simulates input text and the cancel button', async () => {
    const changeBtn = wrapper.find('#nob-change-btn')
    await changeBtn.trigger('click')

    expect(wrapper.vm.$data.onEditMode).toBeTruthy()

    const input = wrapper.find('textarea')
    await input.setValue('100001 - cake')

    const cancelBtn = wrapper.find('#nob-cancel-btn')
    await cancelBtn.trigger('click')

    expect(wrapper.vm.$data.naicsText).toBe('100001 - cake')
    expect(wrapper.vm.$data.onEditMode).toBeFalsy()
    expect(wrapper.find('#naics-summary').exists()).toBeTruthy()
    expect(wrapper.find('#naics-summary').text()).toBe('100000 - food')
    expect(wrapper.vm.$data.hasNatureOfBusinessChanged).toBeFalsy()
  })

  it('simulates error for 0 characters length', async () => {
    const changeBtn = wrapper.find('#nob-change-btn')
    await changeBtn.trigger('click')

    expect(wrapper.vm.$data.onEditMode).toBeTruthy()

    const input = wrapper.find('textarea')
    await input.setValue('')

    const doneBtn = wrapper.find('#nob-done-btn')
    await doneBtn.trigger('click')

    expect(wrapper.vm.$data.naicsText).toBe('')
    expect(wrapper.vm.$data.onEditMode).toBe(true)
    expect(wrapper.find('#naics-summary').exists()).toBe(false)
    expect(wrapper.find('.v-textarea').text()).toContain('Nature of Business is required')
  })

  it('simulates error for over 300 characters length', async () => {
    const wrapper = wrapperFactory({ ...initialProps,
      naicsRules: ['Maximum 300 characters reached']
    })

    const changeBtn = wrapper.find('#nob-change-btn')
    await changeBtn.trigger('click')

    expect(wrapper.vm.$data.onEditMode).toBeTruthy()

    const input = wrapper.find('textarea')
    const overLimit = 'FQbmUtcTEzdDUwa0JDbjF3bHF6dHN0UGdUM1dFIn0.eyJqdGkiOiIzZDQ3YjgwYy01MTAzLTRjMTYtOGNhZC0yMjU4Ns8' +
      'HAiOjE1Njg0ODk1NTksIm5iZiI6MCwiaWF0IjoxNTY4NDAzMTYwLCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2' +
      'EvYXV0aC9yZWFsbXMvZmNmMGtwcXIiLCJhdWQiOlsic2JjLWF1dGgtd2ViIiwicmVhbG0tbWFuYWdlbWVudCIsImJyb2tlciIsImFjY291bnQ'

    await input.setValue(overLimit)
    await Vue.nextTick()

    const doneBtn = wrapper.find('#nob-done-btn')
    await doneBtn.trigger('click')

    expect(wrapper.vm.$data.naicsText).toBe(overLimit)
    expect(wrapper.vm.$data.onEditMode).toBeTruthy()
    expect(wrapper.find('.v-counter').text()).toBe('311 / 300')
    expect(wrapper.find('.v-messages').text()).toBe('Maximum 300 characters reached')
    expect(wrapper.find('#naics-summary').exists()).toBeFalsy()
  })
})

describe('ConversionNatureOfBusiness after the update', () => {
  let wrapperFactory: any
  let wrapper: any
  let store: any = getVuexStore()

  beforeEach(() => {
    store.state.stateModel.businessInformation = updatedBusinessInfo
    store.state.stateModel.entitySnapshot = entitySnapShot

    wrapperFactory = (propsData: any) => {
      return mount(ConversionNOB, {
        propsData: {
          ...propsData
        },
        store,
        vuetify
      })
    }
    wrapper = wrapperFactory({
      onEditMode: false,
      dropdown: false
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the updated naicsSummary text', async () => {
    expect(wrapper.findComponent(ConversionNOB).exists()).toBe(true)
    expect(wrapper.find('#naics-summary').text()).toBe('100001 - cake')
  })

  it('renders the text field and texts', async () => {
    expect(wrapper.vm.$data.onEditMode).toBeFalsy()

    expect(wrapper.find('#naics-summary').exists()).toBeTruthy()
    expect(wrapper.find('#naics-summary').text()).toBe('100001 - cake')
    expect(wrapper.vm.$data.hasEdited).toBeFalsy()

    expect(wrapper.find('#more-menu-btn').exists()).toBeFalsy()
    expect(wrapper.find('#more-changes-btn').exists()).toBeFalsy()
    expect(wrapper.find('#nob-change-btn').exists()).toBeTruthy()
    await wrapper.find('#nob-change-btn').trigger('click')

    expect(wrapper.vm.$data.onEditMode).toBeTruthy()
    expect(wrapper.vm.$data.naicsText).toBe('100001 - cake')
    expect(wrapper.find('p').text()).toContain('Provide a brief description')
    expect(wrapper.find('.v-counter').text()).toBe('13 / 300')
    expect(wrapper.find('#naics-summary').exists()).toBeFalsy()
  })

  it('simulates input text and the done button', async () => {
    const changeBtn = wrapper.find('#nob-change-btn')
    await changeBtn.trigger('click')

    expect(wrapper.vm.$data.onEditMode).toBeTruthy()

    const input = wrapper.find('textarea')
    await input.setValue('no code coke')

    const doneBtn = wrapper.find('#nob-done-btn')
    await doneBtn.trigger('click')

    expect(wrapper.vm.$data.naicsText).toBe('no code coke')
    expect(wrapper.vm.$data.onEditMode).toBeFalsy()
    expect(wrapper.find('#naics-summary').exists()).toBeTruthy()
    expect(wrapper.find('#naics-summary').text()).toBe('no code coke')
  })
})
