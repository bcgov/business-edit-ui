import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ShareStructures from '@/components/common/ShareStructure/ShareStructures.vue'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { ActionTypes } from '@bcrs-shared-components/enums'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Share Structures component', () => {
  let wrapper: any

  const shareClasses: any = [
    {
      id: '1',
      name: 'Common Shares',
      priority: 0,
      maxNumberOfShares: 10000,
      parValue: 1.58,
      currency: 'CAD',
      hasRightsOrRestrictions: true,
      series: [
        {
          id: '1',
          name: 'Share Series 1',
          priority: 1,
          hasMaximumShares: true,
          maxNumberOfShares: 50,
          hasRightsOrRestrictions: false,
          action: ActionTypes.REMOVED
        }
      ]
    },
    {
      id: '2',
      name: 'Non-voting Shares',
      priority: 1,
      maxNumberOfShares: 1000,
      parValue: null,
      currency: '',
      hasRightsOrRestrictions: false,
      series: []
    }]

  beforeEach(() => {
    wrapper = mount(ShareStructures, {
      vuetify,
      propsData: {
        isEditMode: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('displays share-structures component', () => {
    expect(wrapper.findComponent(ShareStructures).exists()).toBe(true)
  })

  it('is invalid when the minimum share class requirements are not met', () => {
    // Assign empty share classes
    store.stateModel.shareStructureStep.shareClasses = []
    expect(wrapper.vm.invalidShareSection).toBe(false)

    // Prompt the validations
    store.stateModel.validationFlags.componentValidate = true
    wrapper.vm.setShareStructureValidity()

    // Verify invalid share section
    expect(wrapper.vm.invalidShareSection).toBe(true)
  })

  it('is valid when the minimum share class requirements are met', () => {
    // Assign valid share classes
    store.stateModel.shareStructureStep.shareClasses = shareClasses
    expect(wrapper.vm.hasMinimumShareClass).toBe(true)

    // Prompt the validations
    store.stateModel.validationFlags.componentValidate = true
    wrapper.vm.setShareStructureValidity()

    // Verify valid share section
    expect(wrapper.vm.invalidShareSection).toBe(false)
  })

  it('stores shareClasses types as number', async () => {
    store.stateModel.shareStructureStep.shareClasses = shareClasses
    await Vue.nextTick()

    // Click on the button to add class
    await wrapper.find('#btn-add-person').trigger('click')

    const textNameInput = wrapper.find('#txt-name')
    const maxNumberOfSharesInput = wrapper.find('#txt-max-shares')
    const parValueInput = wrapper.find('#class-par-value')

    // Add new class
    await textNameInput.setValue('Test new class')
    await maxNumberOfSharesInput.setValue('1')
    await parValueInput.setValue('2')
    await wrapper.find('#done-btn').trigger('click')

    // maxNumberOfShares and parValue should be number
    expect(store.stateModel.shareStructureStep.shareClasses[2].maxNumberOfShares).toBe(1)
    expect(store.stateModel.shareStructureStep.shareClasses[2].parValue).toBe(2)
  })

  describe('resolutionsRequired', () => {
    beforeEach(async () => {
      store.stateModel.tombstone.entityType = CorpTypeCd.BC_COMPANY
      store.stateModel.shareStructureStep.resolutionDates = []
    })

    it('is true for alteration filings with no resolution dates', async () => {
      store.stateModel.tombstone.filingType = FilingTypes.ALTERATION

      expect(wrapper.vm.resolutionsRequired).toBe(true)
    })

    it('is false for corp correction filings with no resolution dates', async () => {
      store.stateModel.tombstone.filingType = FilingTypes.CORRECTION

      expect(wrapper.vm.resolutionsRequired).toBe(false)
    })

    it('is false for non-corp correction filings', async () => {
      store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
      store.stateModel.tombstone.entityType = CorpTypeCd.SOLE_PROP

      expect(wrapper.vm.resolutionsRequired).toBe(false)
    })

    it('is false when resolution dates already exist', async () => {
      store.stateModel.tombstone.filingType = FilingTypes.ALTERATION
      store.stateModel.shareStructureStep.resolutionDates = ['2024-01-01']

      expect(wrapper.vm.resolutionsRequired).toBe(false)
    })
  })

  describe('Action Chips', () => {
    const alteredShareClasses: any = [
      {
        id: '1',
        name: 'Common Shares',
        priority: 0,
        maxNumberOfShares: 10000,
        parValue: 1.58,
        currency: 'CAD',
        hasRightsOrRestrictions: true,
        action: ActionTypes.EDITED,
        series: [
          {
            id: '1',
            name: 'Share Series 1',
            priority: 1,
            hasMaximumShares: true,
            maxNumberOfShares: 50,
            hasRightsOrRestrictions: false,
            action: ActionTypes.ADDED
          }
        ]
      },
      {
        id: '2',
        name: 'Non-voting Shares',
        priority: 1,
        maxNumberOfShares: 1000,
        parValue: null,
        currency: '',
        hasRightsOrRestrictions: false,
        action: ActionTypes.REMOVED,
        series: []
      }
    ]

    it('shows action chips for added/edited class and series in edit mode', async () => {
      store.stateModel.shareStructureStep.shareClasses = alteredShareClasses
      await Vue.nextTick()

      const classRow = wrapper.find('.class-row')
      expect(classRow.findComponent({ name: 'ActionChip' }).exists()).toBe(true)

      const seriesRow = wrapper.find('.series-row')
      expect(seriesRow.findComponent({ name: 'ActionChip' }).exists()).toBe(true)
    })

    it('still shows action chips for added/edited class and series in summary (non-edit) mode', async () => {
      store.stateModel.shareStructureStep.shareClasses = alteredShareClasses

      const summaryWrapper = mount(ShareStructures, {
        vuetify,
        propsData: { isEditMode: false }
      })
      await Vue.nextTick()

      const classRow = summaryWrapper.find('.class-row')
      expect(classRow.findComponent({ name: 'ActionChip' }).exists()).toBe(true)

      const seriesRow = summaryWrapper.find('.series-row')
      expect(seriesRow.findComponent({ name: 'ActionChip' }).exists()).toBe(true)

      summaryWrapper.destroy()
    })

    it('does not render a row (or chip) for a removed class in summary (non-edit) mode', async () => {
      store.stateModel.shareStructureStep.shareClasses = alteredShareClasses

      const summaryWrapper = mount(ShareStructures, {
        vuetify,
        propsData: { isEditMode: false }
      })
      await Vue.nextTick()

      // removed class should be excluded entirely from the summary, not just its chip
      expect(summaryWrapper.text()).not.toContain('Non-voting Shares')

      summaryWrapper.destroy()
    })
  })
})
