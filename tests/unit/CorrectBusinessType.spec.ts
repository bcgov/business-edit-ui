import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ChangeBusinessType from '@/components/common/YourCompany/ChangeBusinessType.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { FilingTypes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { mockFeatureFlagsForAlterationChangeBusinessTypes } from './utils'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

describe('CorrectBusinessType in a Correction', () => {
  let wrapper: any

  beforeEach(() => {
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    wrapper = mount(ChangeBusinessType, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the ChangeBusinessType Component', async () => {
    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBe(true)
  })
})

describe('ChangeBusinessType in an Alteration', () => {
  let wrapper: any

  const entitySnapshot = {
    businessInfo: {
      legalName: 'Mock Original Name',
      legalType: 'BC'
    }
  } as any

  beforeEach(() => {
    // Set Original business Data
    store.stateModel.nameRequestLegalName = entitySnapshot.businessInfo.legalName
    store.stateModel.tombstone.entityType = entitySnapshot.businessInfo.legalType
    store.stateModel.entitySnapshot = entitySnapshot
    store.stateModel.tombstone.filingType = FilingTypes.ALTERATION

    mockFeatureFlagsForAlterationChangeBusinessTypes()
    wrapper = mount(ChangeBusinessType, { vuetify })
  })

  afterEach(() => {
    vi.clearAllMocks()
    wrapper.destroy()
  })

  it('renders the ChangeBusinessType Component', async () => {
    expect(wrapper.findComponent(ChangeBusinessType).exists()).toBe(true)
  })

  it('displays the Business Type row for Alterations', async () => {
    expect(wrapper.find('#change-business-type').exists()).toBe(true)
  })

  it('displays the title and entity type in display mode', async () => {
    expect(wrapper.findAll('label').at(0).text()).toBe('Business Type')
    expect(wrapper.findAll('.info-text').at(0).text()).toBe('BC Limited Company')
  })

  it('displays the type selector in edit mode', async () => {
    // Verify selector is hidden in display mode
    expect(wrapper.find('#business-type-selector').exists()).toBe(false)

    // Click edit btn and open edit mode
    await wrapper.find('#btn-correct-business-type').trigger('click')

    expect(wrapper.find('#business-type-selector').exists()).toBe(true)
  })

  it('displays the confirm articles checkbox and enables Done btn when selected', async () => {
    // Set the selected entity to Benefit Company
    wrapper.setData({ selectedEntityType: 'BEN' })

    // Verify checkbox is hidden until in display mode
    expect(wrapper.find('#confirm-articles-checkbox').exists()).toBe(false)

    // Click edit btn and open edit mode
    await wrapper.find('#btn-correct-business-type').trigger('click')

    // Verify checkbox is displayed in edit mode
    expect(wrapper.find('#confirm-articles-checkbox').exists()).toBe(true)

    // Select the Confirm Articles checkbox
    await wrapper.find('#confirm-articles-checkbox').trigger('click')

    // Verify DONE btn is enabled after selecting the checkbox
    expect(wrapper.find('#done-btn').attributes('disabled')).toBeUndefined()
  })

  it('renders the CHANGE option for editing a business type', async () => {
    const editLabel = wrapper.find('#btn-correct-business-type').text()
    expect(editLabel).toBe('Change')
  })

  it('hides the CHANGE option for editing a business type when NOT Limited Company', async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    await Vue.nextTick()

    expect(wrapper.find('#btn-correct-business-type').exists()).toBe(false)
  })
})
