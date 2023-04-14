import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ResolutionDates from '@/components/Alteration/Articles/ResolutionDates.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { CorpTypeCd, FilingTypes } from '@/enums'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

const addedDates = [
  '2020-05-23',
  '2020-06-01'
]

const previousDates = [
  {
    'date': '2020-06-12'
  },
  {
    'date': '2021-07-05'
  }
]

// FUTURE: this needs to be fixed so it uses the interface correctly. https://github.com/bcgov/entity/issues/15927
const shareClasses = [
  {
    'id': 1,
    'name': 'Share Class 1',
    'priority': 1,
    'hasMaximumShares': true,
    'maxNumberOfShares': 100,
    'hasParValue': true,
    'parValue': 10,
    'currency': 'CAD',
    'hasRightsOrRestrictions': false,
    'series': [
      {
        'id': 1,
        'name': 'Share Series 1',
        'priority': 1,
        'hasMaximumShares': true,
        'maxNumberOfShares': 50,
        'hasRightsOrRestrictions': false
      },
      {
        'id': 2,
        'name': 'Share Series 2',
        'priority': 2,
        'hasMaximumShares': true,
        'maxNumberOfShares': 100,
        'hasRightsOrRestrictions': false
      }
    ]
  },
  {
    'id': 2,
    'name': 'Share Class 2',
    'priority': 1,
    'hasMaximumShares': false,
    'maxNumberOfShares': null,
    'hasParValue': false,
    'parValue': null,
    'currency': null,
    'hasRightsOrRestrictions': true,
    'series': []
  }
]

describe('Resolution Dates component - edit mode', () => {
  let wrapperFactory: any

  beforeAll(() => {
    store.stateModel.shareStructureStep.shareClasses = shareClasses as any
    wrapperFactory = (propsData: any) => {
      return mount(ResolutionDates, { propsData: { ...propsData, isEditMode: true }, vuetify })
    }
  })

  it('displays correctly with no data', () => {
    const wrapper = wrapperFactory()

    // verify there is just 1 row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // verify first row has 3 columns
    const cols = rows.at(0).findAll('.col')
    expect(cols.length).toBe(3)

    // verify column text
    expect(cols.at(0).text()).toContain('Resolution or')
    expect(cols.at(0).text()).toContain('Court Order Dates')
    expect(cols.at(1).text()).toContain('Dates of resolutions or court orders to alter the')

    // verify add button
    const button = cols.at(2).find('.add-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Add')

    wrapper.destroy()
  })

  it('displays previous dates', async () => {
    const wrapper = wrapperFactory({ previousDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify Show button
    const button = cols.at(1).find('.show-previous-dates-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    // click the button
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify Hide button
    expect(button.text()).toBe('Hide previous resolutions or court order dates')

    // verify previous dates
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toBe('2020-06-12')
    expect(items.at(1).text()).toBe('2021-07-05')

    // click the button again
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify that it went back to the original text
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    wrapper.destroy()
  })

  it('displays added dates', () => {
    const wrapper = wrapperFactory({ addedDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify added dates and buttons
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toContain('2020-05-23')
    expect(items.at(1).text()).toContain('2020-06-01')

    // verify Remove buttons
    let button = items.at(0).find('.remove-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Remove')
    button = items.at(1).find('.remove-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Remove')

    wrapper.destroy()
  })

  it('can add a date', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm

    // verify there is just 1 row
    let rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // click the Add button
    await vm.$el.querySelector('.add-btn').click()

    // verify there are now 2 rows
    rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify blurb
    const cols = rows.at(0).findAll('.col')
    expect(cols.at(1).text()).toContain('Indicate the date of the resolution or court order')

    // verify date picker form
    expect(wrapper.find('.date-picker-form')).toBeDefined()

    // inject a date
    vm.onDateEmitted('2021-03-17')

    // verify new date is emitted
    expect(wrapper.emitted('addRemoveDate').pop()[0]).toEqual(['2021-03-17'])

    wrapper.destroy()
  })

  it('can delete a date', async () => {
    const wrapper = wrapperFactory({ addedDates: ['2021-03-17'] })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // click the Remove button
    await vm.$el.querySelector('.remove-btn').click()

    // verify no date is emitted
    expect(wrapper.emitted('addRemoveDate').pop()[0]).toEqual([])

    wrapper.destroy()
  })

  it('displays the error message when invalid', async () => {
    const wrapper = wrapperFactory()

    // verify there is just 1 row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // verify first row has 3 columns
    const cols = rows.at(0).findAll('.col')
    expect(cols.length).toBe(3)

    // verify column text
    expect(cols.at(1).text()).toContain('You must add a resolution or court order date')

    wrapper.destroy()
  })

  it('hides the error message when valid', async () => {
    const wrapper = wrapperFactory()
    const vm = wrapper.vm

    // verify there is just 1 row
    let rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // verify first row has 3 columns
    const cols = rows.at(0).findAll('.col')
    expect(cols.length).toBe(3)

    // verify column text contains error initially
    expect(cols.at(1).text()).toContain('You must add a resolution or court order date')

    // click the Add button
    await vm.$el.querySelector('.add-btn').click()

    // verify there are now 2 rows
    rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify date picker form
    expect(wrapper.find('.date-picker-form')).toBeDefined()

    // inject a date
    vm.onDateEmitted('2021-03-17')
    store.stateModel.shareStructureStep.resolutionDates = ['2021-03-17']
    await Vue.nextTick()

    // verify new date is emitted
    expect(wrapper.emitted('addRemoveDate').pop()[0]).toEqual(['2021-03-17'])

    // verify column text does NOT contain error message
    expect(cols.at(1).text()).not.toContain('You must add a resolution or court order date')

    wrapper.destroy()
  })

  it('sets component as invalid when editing', async () => {
    const wrapper = wrapperFactory()
    await Vue.nextTick()
    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidResolutionDate).toBe(true)

    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    const cols = rows.at(0).findAll('.col')
    expect(cols.length).toBe(3)

    const button = cols.at(2).find('.add-btn')
    await button.trigger('click')

    expect(store.stateModel.validationFlags.flagsCompanyInfo.isValidResolutionDate).toBe(false)

    wrapper.destroy()
  })

  it('disables add btn when a date has already been added', async () => {
    const wrapper = wrapperFactory({ addedDates: ['2021-03-17'] })

    // Verify the Add button is disabled
    expect(wrapper.find('.add-btn').exists()).toBe(true)
    expect(wrapper.find('.add-btn').attributes('disabled')).toBeDefined()

    wrapper.destroy()
  })

  it('displays the Correct button for correction filings', () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.shareStructureStep.shareClasses = shareClasses as any
    store.stateModel.shareStructureStep.resolutionDates = addedDates

    const wrapper = wrapperFactory()

    const addBtn = wrapper.find('#add-resolution-date')
    expect(addBtn.exists()).toBe(true)
    expect(addBtn.text()).toBe('Correct')
    expect(addBtn.find('.v-icon.mdi-pencil').exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays the Undo button for correction filings', async () => {
    store.stateModel.tombstone.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.CORRECTION
    store.stateModel.shareStructureStep.shareClasses = shareClasses as any
    store.stateModel.shareStructureStep.resolutionDates = addedDates

    const wrapper = wrapperFactory({ addedDates: ['2021-03-17'] })

    const removeBtn = wrapper.find('#remove-resolution-date')
    expect(removeBtn.exists()).toBe(true)
    expect(removeBtn.text()).toBe('Undo')
    expect(removeBtn.find('.v-icon.mdi-undo').exists()).toBe(true)

    wrapper.destroy()
  })
})

describe('Resolution Dates component - review mode', () => {
  let wrapperFactory: any

  beforeAll(() => {
    store.stateModel.shareStructureStep.shareClasses = shareClasses as any
    wrapperFactory = (propsData: any) => {
      return mount(ResolutionDates, { propsData: { ...propsData, isEditMode: false }, vuetify })
    }
  })

  it('displays correctly with no data', () => {
    const wrapper = wrapperFactory()

    // verify there is just 1 row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    // verify first row has 2 columns (ie, no Add button column)
    const cols = rows.at(0).findAll('.col')
    expect(cols.length).toBe(2)

    // verify column text
    expect(cols.at(0).text()).toContain('Resolution or')
    expect(cols.at(0).text()).toContain('Court Order Dates')
    expect(cols.at(1).text()).toContain('Dates of resolutions or court orders to alter the')

    wrapper.destroy()
  })

  it('displays previous dates', async () => {
    const wrapper = wrapperFactory({ previousDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify Show button
    const button = cols.at(1).find('.show-previous-dates-btn')
    expect(button).toBeDefined()
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    // click the button
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify Hide button
    expect(button.text()).toBe('Hide previous resolutions or court order dates')

    // verify previous dates
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toBe('2020-06-12')
    expect(items.at(1).text()).toBe('2021-07-05')

    // click the button again
    await vm.$el.querySelector('.show-previous-dates-btn').click()

    // verify that it went back to the original text
    expect(button.text()).toBe('Show previous resolutions or court order dates')

    wrapper.destroy()
  })

  it('displays added dates', () => {
    const wrapper = wrapperFactory({ addedDates })
    const vm = wrapper.vm

    // verify there is a second row
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    // verify second row has 2 columns
    const cols = rows.at(1).findAll('.col')
    expect(cols.length).toBe(2)

    // verify added dates and buttons
    const items = cols.at(1).findAll('li')
    expect(items.length).toBe(2)
    expect(items.at(0).text()).toContain('2020-05-23')
    expect(items.at(1).text()).toContain('2020-06-01')

    // verify no Remove buttons
    expect(items.at(0).find('.remove-btn').exists()).toBe(false)
    expect(items.at(1).find('.remove-btn').exists()).toBe(false)

    wrapper.destroy()
  })
})
