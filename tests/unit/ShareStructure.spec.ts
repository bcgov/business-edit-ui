import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import ShareStructure from '@/components/common/ShareStructure/ShareStructure.vue'
import { ActionChip } from '@bcrs-shared-components/action-chip'

// suppress the "[Vuetify] Unable to locate target [data-app]" warning
document.body.setAttribute('data-app', 'true')

// suppress the "[Vuetify] Unable to locate target #share-structure" warning
document.body.setAttribute('id', 'share-structure')

const vuetify = new Vuetify({})
const localVue = createLocalVue()

const shareClassesOriginal: any = [
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
        hasRightsOrRestrictions: false
      },
      {
        id: '2',
        name: 'Share Series 2',
        priority: 2,
        hasMaximumShares: true,
        maxNumberOfShares: 100,
        hasRightsOrRestrictions: false
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
    series: [
      {
        id: '1',
        name: 'Share Series 3',
        priority: 1,
        hasMaximumShares: true,
        maxNumberOfShares: 50,
        hasRightsOrRestrictions: false
      }
    ]
  },
  {
    id: '3',
    name: 'Common Shares 2',
    priority: 2,
    maxNumberOfShares: 10000,
    parValue: 0.568,
    currency: 'CAD',
    hasRightsOrRestrictions: true,
    series: []
  },
  {
    id: '4',
    priority: 3,
    name: 'Non-voting Shares 2',
    maxNumberOfShares: 1000,
    parValue: null,
    currency: '',
    hasRightsOrRestrictions: false,
    series: []
  }]

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
        action: 'REMOVED'
      },
      {
        id: '2',
        name: 'Share Series 2B',
        priority: 2,
        hasMaximumShares: true,
        maxNumberOfShares: 100,
        hasRightsOrRestrictions: false,
        action: 'EDITED'
      },
      {
        id: '3',
        name: 'Share Series 3C',
        priority: 3,
        hasMaximumShares: true,
        maxNumberOfShares: 100,
        hasRightsOrRestrictions: false,
        action: 'ADDED'
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
    series: [
      {
        id: '1',
        name: 'Share Series 3',
        priority: 1,
        hasMaximumShares: true,
        maxNumberOfShares: 50,
        hasRightsOrRestrictions: false
      },
      {
        id: '2',
        name: 'Share Series 3B',
        priority: 2,
        hasMaximumShares: true,
        maxNumberOfShares: 50,
        hasRightsOrRestrictions: false,
        action: 'ADDED'
      }
    ]
  },
  {
    id: '3',
    name: 'Common Shares 2B',
    priority: 2,
    maxNumberOfShares: 10000,
    parValue: 0.568,
    currency: 'CAD',
    hasRightsOrRestrictions: true,
    series: [],
    action: 'EDITED'
  },
  {
    id: '4',
    priority: 3,
    name: 'Non-voting Shares 2',
    maxNumberOfShares: 1000,
    parValue: null,
    currency: '',
    hasRightsOrRestrictions: false,
    series: [],
    action: 'REMOVED'
  },
  {
    id: '5',
    priority: 4,
    name: 'Non-voting Shares 3',
    maxNumberOfShares: 1000,
    parValue: null,
    currency: '',
    hasRightsOrRestrictions: false,
    series: [],
    action: 'ADDED'
  }]

const shareClassesNestedSeriesCorrected: any = [
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
        hasRightsOrRestrictions: false
      },
      {
        id: '2',
        name: 'Share Series 2',
        priority: 2,
        hasMaximumShares: true,
        maxNumberOfShares: 100,
        hasRightsOrRestrictions: false
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
    series: [
      {
        id: '1',
        name: 'Share Series 3B',
        priority: 1,
        hasMaximumShares: true,
        maxNumberOfShares: 50,
        hasRightsOrRestrictions: false,
        action: 'CORRECTED'
      }
    ]
  },
  {
    id: '3',
    name: 'Common Shares 2',
    priority: 2,
    maxNumberOfShares: 10000,
    parValue: 0.568,
    currency: 'CAD',
    hasRightsOrRestrictions: true,
    series: []
  },
  {
    id: '4',
    priority: 3,
    name: 'Non-voting Shares 2',
    maxNumberOfShares: 1000,
    parValue: null,
    currency: '',
    hasRightsOrRestrictions: false,
    series: []
  }]

describe('Share Structure component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(ShareStructure, {
      localVue,
      vuetify,
      propsData: {
        originalShareStructure: shareClassesOriginal,
        shareClasses: shareClasses
      }
    })
  })

  afterEach(async () => {
    await wrapper.destroy()
  })

  it('displays the correct amount of share classes / series when data is present', () => {
    const classRowCount = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row').length
    const seriesRowCount = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row').length

    expect(classRowCount).toEqual(5)
    expect(seriesRowCount).toEqual(5)
  })

  it('displays the correct name data in the share classes / series table', () => {
    const classListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')[0]
    const seriesListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[0]

    expect(classListItem1.querySelector('.list-item__title').textContent).toContain('Common Shares')
    expect(seriesListItem1.querySelector('.series-name').textContent).toContain('Share Series 1')
  })

  it('displays the correct data in the selected table rows for shareClass', () => {
    const classListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')[2]

    expect(classListItem1.querySelectorAll('td')[0].textContent).toContain('Common Shares 2')
    expect(classListItem1.querySelectorAll('td')[1].textContent).toContain('10,000')
    expect(classListItem1.querySelectorAll('td')[2].textContent).toContain('0.568')
    expect(classListItem1.querySelectorAll('td')[3].textContent).toContain('CAD')
    expect(classListItem1.querySelectorAll('td')[4].textContent).toContain('Yes')

    const classListItem2 = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')[3]

    expect(classListItem2.querySelectorAll('td')[0].textContent).toContain('Non-voting Shares 2')
    expect(classListItem2.querySelectorAll('td')[1].textContent).toContain('1,000')
    expect(classListItem2.querySelectorAll('td')[2].textContent).toContain('No Par Value')
    expect(classListItem2.querySelectorAll('td')[3].textContent).toContain('')
    expect(classListItem2.querySelectorAll('td')[4].textContent).toContain('No')
  })

  it('displays the correct data in the selected table rows for ShareSeries', () => {
    const seriesListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[1]

    expect(seriesListItem1.querySelectorAll('td')[0].textContent).toContain('Share Series 2')
    expect(seriesListItem1.querySelectorAll('td')[1].textContent).toContain('100')
    expect(seriesListItem1.querySelectorAll('td')[2].textContent).toContain('1.58')
    expect(seriesListItem1.querySelectorAll('td')[3].textContent).toContain('CAD')
    expect(seriesListItem1.querySelectorAll('td')[4].textContent).toContain('No')

    const seriesListItem2 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[2]

    expect(seriesListItem2.querySelectorAll('td')[0].textContent).toContain('Share Series 3')
    expect(seriesListItem2.querySelectorAll('td')[1].textContent).toContain('100')
    expect(seriesListItem2.querySelectorAll('td')[2].textContent).toContain('1.58')
    expect(seriesListItem2.querySelectorAll('td')[3].textContent).toContain('')
    expect(seriesListItem2.querySelectorAll('td')[4].textContent).toContain('No')
  })

  it('checks for the Action chips on modified Class shares', async () => {
    expect(wrapper.findComponent(ActionChip).exists()).toBe(true)

    wrapper.setProps({ editedLabel: 'CORRECTED' })
    await Vue.nextTick()

    const classSharesEdited = wrapper.findAllComponents(ActionChip).at(4)
    const classSharesRemoved = wrapper.findAllComponents(ActionChip).at(5)
    const classSharesAdded = wrapper.findAllComponents(ActionChip).at(6)

    expect(classSharesEdited.text()).toContain('CORRECTED')
    expect(classSharesRemoved.text()).toContain('REMOVED')
    expect(classSharesAdded.text()).toContain('ADDED')
    expect(wrapper.vm.hasClassChanges).toBe(true)
  })

  it('checks for the Action chips on modified Series shares', async () => {
    expect(wrapper.findComponent(ActionChip).exists()).toBe(true)

    wrapper.setProps({ editedLabel: 'CORRECTED' })
    await Vue.nextTick()

    const seriesSharesRemoved = wrapper.findAllComponents(ActionChip).at(0)
    const seriesSharesEdited = wrapper.findAllComponents(ActionChip).at(1)
    const seriesSharesAdded = wrapper.findAllComponents(ActionChip).at(2)

    expect(seriesSharesRemoved.text()).toContain('REMOVED')
    expect(seriesSharesEdited.text()).toContain('CORRECTED')
    expect(seriesSharesAdded.text()).toContain('ADDED')
    expect(wrapper.vm.hasSeriesChanges).toBe(true)
  })

  it('checks for correct CLASS primary action', async () => {
    wrapper.setProps({ editLabel: 'Correct' })
    await Vue.nextTick()

    // Verify the correct PRIMARY action
    const classRows = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')
    expect(classRows[0].querySelector('#class-0-change-btn').textContent).toContain('Correct')
    expect(classRows[3].querySelector('#class-3-undo-btn').textContent).toContain('Undo')
    expect(classRows[4].querySelector('#class-4-change-added-btn').textContent).toContain('Edit')
  })

  it('checks for correct SERIES primary action', async () => {
    wrapper.setProps({ editLabel: 'Correct' })
    await Vue.nextTick()

    // Verify the correct PRIMARY action
    const seriesRows = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')
    expect(seriesRows[0].querySelector('#series-0-undo-btn').textContent).toContain('Undo')
    expect(seriesRows[2].querySelector('#series-2-change-added-btn').textContent).toContain('Edit')
    expect(seriesRows[3].querySelector('#series-0-change-btn').textContent).toContain('Correct')
  })

  it('assigns the correct data for ShareClasses after moving an item', async () => {
    // Validate the Class values pre move
    expect(wrapper.vm.shareClasses[0].name).toBe('Common Shares')
    expect(wrapper.vm.shareClasses[1].name).toBe('Non-voting Shares')

    // Validate the Series values pre move
    expect(wrapper.vm.shareClasses[0].series[0].name).toBe('Share Series 1')
    expect(wrapper.vm.shareClasses[0].series[1].name).toBe('Share Series 2B')

    // Identify and click the dropdown menu
    const dropDownMenu = wrapper.find('.actions__more-actions__btn')
    await dropDownMenu.trigger('click')

    expect(wrapper.find('.move-up-selector').exists()).toBe(true)
    expect(wrapper.find('.move-down-selector').exists()).toBe(true)

    const moveDown = wrapper.find('.move-down-selector')
    await moveDown.trigger('click')

    // Validate class data post move
    expect(wrapper.vm.shareClasses[0].name).toBe('Non-voting Shares')
    expect(wrapper.vm.shareClasses[1].name).toBe('Common Shares')

    // Validate series data post move
    expect(wrapper.vm.shareClasses[0].series[0].name).toBe('Share Series 3')
  })

  it('displays the Confirm Class Removal dialog when the class to remove has Series', async () => {
    // Confirm dialog is not viewable by default
    expect(wrapper.find('.confirm-dialog').exists()).toBe(false)

    const dropDownMenu = wrapper.find('.actions__more-actions__btn')
    await dropDownMenu.trigger('click')
    await Vue.nextTick()

    const moveDown = wrapper.find('.remove-selector')
    await moveDown.trigger('click')
    await Vue.nextTick()

    expect(wrapper.find('.confirm-dialog').exists()).toBe(true)
  })

  it('correctly identifies no changes in the class and series structure', async () => {
    // Restore the Share Structure to it's original state
    wrapper.setProps({ shareClasses: shareClassesOriginal })

    await Vue.nextTick()

    expect(wrapper.vm.hasClassChanges).toBe(false)
    expect(wrapper.vm.hasSeriesChanges).toBe(false)
  })

  it('correctly identifies changes in the nested series structure', async () => {
    // Restore the Share Structure to it's original state
    wrapper.setProps({ shareClasses: shareClassesOriginal })
    await Vue.nextTick()
    expect(wrapper.vm.hasSeriesChanges).toBe(false)

    // Modify the structure
    wrapper.setProps({ shareClasses: shareClassesNestedSeriesCorrected })
    await Vue.nextTick()

    expect(wrapper.vm.hasSeriesChanges).toBe(true)
  })

  // Checks for alterations label
  it('checks for the Action chips on modified Class shares', async () => {
    wrapper.setProps({ editedLabel: 'CHANGED' })
    await Vue.nextTick()

    expect(wrapper.findComponent(ActionChip).exists()).toBe(true)

    const classSharesEdited = wrapper.findAllComponents(ActionChip).at(4)
    const classSharesRemoved = wrapper.findAllComponents(ActionChip).at(5)
    const classSharesAdded = wrapper.findAllComponents(ActionChip).at(6)

    expect(classSharesEdited.text()).toContain('CHANGED')
    expect(classSharesRemoved.text()).toContain('REMOVED')
    expect(classSharesAdded.text()).toContain('ADDED')
    expect(wrapper.vm.hasClassChanges).toBe(true)
  })

  it('checks for the Action chips on modified Series shares', async () => {
    wrapper.setProps({ editedLabel: 'CHANGED' })
    await Vue.nextTick()

    expect(wrapper.findComponent(ActionChip).exists()).toBe(true)

    const seriesSharesRemoved = wrapper.findAllComponents(ActionChip).at(0)
    const seriesSharesEdited = wrapper.findAllComponents(ActionChip).at(1)
    const seriesSharesAdded = wrapper.findAllComponents(ActionChip).at(2)

    expect(seriesSharesRemoved.text()).toContain('ADDED')
    expect(seriesSharesEdited.text()).toContain('REMOVED')
    expect(seriesSharesAdded.text()).toContain('CHANGED')
    expect(wrapper.vm.hasSeriesChanges).toBe(true)
  })

  it('checks for correct CLASS primary action', async () => {
    wrapper.setProps({ editLabel: 'Change' })
    await Vue.nextTick()

    // Verify the correct PRIMARY action
    const classRows = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')
    expect(classRows[0].querySelector('#class-0-change-btn').textContent).toContain('Change')
    expect(classRows[3].querySelector('#class-3-undo-btn').textContent).toContain('Undo')
    expect(classRows[4].querySelector('#class-4-change-added-btn').textContent).toContain('Edit')
  })

  it('displays the error message when invalid minimum Share Classes', async () => {
    wrapper.setProps({ invalidMinimumShareClass: true })
    await Vue.nextTick()

    expect(wrapper.find('.share-info-container').text())
      .toContain('Your share structure must contain at least one share class.')
  })
})

describe('Share Structure component - enabled/disabled', () => {
  it('disables the action buttons when the disabled prop is not specified (default: False)', () => {
    const wrapper = mount(ShareStructure, {
      localVue,
      vuetify,
      propsData: {
        originalShareStructure: shareClassesOriginal,
        shareClasses: shareClasses
      }
    })

    // verify that the action buttons are enabled
    expect(wrapper.find('#btn-add-person').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#class-0-change-btn').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.class-row .actions__more-actions__btn').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#series-0-change-btn').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.series-row .actions__more-actions__btn').attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('disables the action buttons when the disabled prop is True', () => {
    const wrapper = mount(ShareStructure, {
      localVue,
      vuetify,
      propsData: {
        originalShareStructure: shareClassesOriginal,
        shareClasses: shareClasses,
        disabled: true
      }
    })

    // verify that the action buttons are disabled
    expect(wrapper.find('#btn-add-person').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#class-0-change-btn').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('.class-row .actions__more-actions__btn').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#series-0-change-btn').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('.series-row .actions__more-actions__btn').attributes('disabled')).toBe('disabled')

    wrapper.destroy()
  })
})

describe('formatParValue()', () => {
  let wrapper

  beforeAll(() => {
    wrapper = shallowMount(ShareStructure)
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('formats null par value correctly', () => {
    // NB: zero par values are invalid
    expect(wrapper.vm.formatParValue({ parValue: null })).toBe('No Par Value')
  })

  it('formats par values for specific currencies correctly', () => {
    const parValues = [
      // very small number
      { currency: 'CAD', parValue: 1E-20, expected: '$0.00000000000000000001' },
      // very large number
      { currency: 'CAD', parValue: 1E38, expected: '$100,000,000,000,000,000,000,000,000,000,000,000,000.00' },
      // maximum significant digits
      { currency: 'CAD', parValue: 0.1234567890123456, expected: '$0.1234567890123456' },
      { currency: 'CAD', parValue: 1234567890123456, expected: '$1,234,567,890,123,456.00' },
      // misc numbers / different currencies
      { currency: 'USD', parValue: 0.01, expected: '$0.01' },
      { currency: 'AUD', parValue: 0.01, expected: '$0.01' },
      { currency: 'CAD', parValue: 0.01, expected: '$0.01' },
      { currency: 'CAD', parValue: 0.1, expected: '$0.10' },
      { currency: 'CAD', parValue: 1, expected: '$1.00' },
      { currency: 'CAD', parValue: 1000000, expected: '$1,000,000.00' },
      { currency: 'CAD', parValue: 1000000.1234, expected: '$1,000,000.1234' }
    ]

    parValues.forEach(({ currency, parValue, expected }) => {
      expect(wrapper.vm.formatParValue({ parValue, currency })).toBe(expected)
    })
  })

  it('formats par values for other currencies correctly', () => {
    const parValues = [
      // very small number
      { currency: '', parValue: 1E-20, expected: '0.00000000000000000001' },
      // very large number
      { currency: '', parValue: 1E38, expected: '100,000,000,000,000,000,000,000,000,000,000,000,000' },
      // maximum significant digits
      { currency: '', parValue: 0.1234567890123456, expected: '0.1234567890123456' },
      { currency: '', parValue: 1234567890123456, expected: '1,234,567,890,123,456' },
      // misc numbers
      { currency: '', parValue: 0.01, expected: '0.01' },
      { currency: '', parValue: 0.1, expected: '0.1' },
      { currency: '', parValue: 1, expected: '1' },
      { currency: '', parValue: 1000000, expected: '1,000,000' },
      { currency: '', parValue: 1000000.1234, expected: '1,000,000.1234' }
    ]

    parValues.forEach(({ currency, parValue, expected }) => {
      expect(wrapper.vm.formatParValue({ parValue, currency })).toBe(expected)
    })
  })
})

describe('formatCurrency()', () => {
  let wrapper: any

  beforeAll(() => {
    wrapper = shallowMount(ShareStructure)
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('returns the ISO currency code for standard currencies', () => {
    expect(wrapper.vm.formatCurrency({ currency: 'CAD' })).toBe('CAD')
    expect(wrapper.vm.formatCurrency({ currency: 'USD' })).toBe('USD')
    expect(wrapper.vm.formatCurrency({ currency: 'EUR' })).toBe('EUR')
  })

  it('returns the free-text value for grandfathered OTHER currency', () => {
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: 'Bitcoin' }))
      .toBe('Bitcoin')
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: 'Swiss Francs' }))
      .toBe('Swiss Francs')
  })

  it('falls back to "Other" when OTHER currency has no free-text value', () => {
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: '' })).toBe('Other')
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: null })).toBe('Other')
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER' })).toBe('Other')
  })
})

describe('hasOtherCurrency notice', () => {
  const mountWith = (classes: any[], isEditMode = true) => mount(ShareStructure, {
    localVue,
    vuetify,
    propsData: { shareClasses: classes, isEditMode }
  })

  it('is false when no class or series uses OTHER currency', () => {
    const wrapper = mountWith([
      { id: '1',
        name: 'A Shares',
        priority: 0,
        maxNumberOfShares: 1,
        parValue: 1,
        currency: 'CAD',
        hasRightsOrRestrictions: false,
        series: [] }
    ])
    expect(wrapper.vm.hasOtherCurrency).toBe(false)
    expect(wrapper.find('#other-currency-notice').exists()).toBe(false)
    wrapper.destroy()
  })

  it('is true when a class uses OTHER currency and renders the notice', () => {
    const wrapper = mountWith([
      { id: '1',
        name: 'A Shares',
        priority: 0,
        maxNumberOfShares: 1,
        parValue: 1,
        currency: 'OTHER',
        currencyAdditional: 'Bitcoin',
        hasRightsOrRestrictions: false,
        series: [] }
    ])
    expect(wrapper.vm.hasOtherCurrency).toBe(true)
    const notice = wrapper.find('#other-currency-notice')
    expect(notice.exists()).toBe(true)
    expect(notice.text()).toContain('Important:')
    expect(notice.text()).toContain('Other')
    wrapper.destroy()
  })

  it('is true when a nested series uses OTHER currency', () => {
    const wrapper = mountWith([
      {
        id: '1',
        name: 'A Shares',
        priority: 0,
        maxNumberOfShares: 1,
        parValue: 1,
        currency: 'CAD',
        hasRightsOrRestrictions: true,
        series: [
          { id: '2',
            name: 'S Shares',
            priority: 1,
            maxNumberOfShares: 1,
            currency: 'OTHER',
            hasRightsOrRestrictions: false }
        ]
      }
    ])
    expect(wrapper.vm.hasOtherCurrency).toBe(true)
    expect(wrapper.find('#other-currency-notice').exists()).toBe(true)
    wrapper.destroy()
  })

  it('notice is hidden in review mode even with OTHER present', () => {
    const wrapper = mountWith([
      { id: '1',
        name: 'A Shares',
        priority: 0,
        maxNumberOfShares: 1,
        parValue: 1,
        currency: 'OTHER',
        hasRightsOrRestrictions: false,
        series: [] }
    ], false)
    expect(wrapper.vm.hasOtherCurrency).toBe(true)
    expect(wrapper.find('#other-currency-notice').exists()).toBe(false)
    wrapper.destroy()
  })
})
